import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { createServerSupabaseClient, handleSupabaseError } from '@/lib/supabase';
import { validateHubAuth } from '@/lib/hub/auth';
import { logHubAction, ipFromRequest } from '@/lib/hub/audit';
import { getParser } from '@/lib/hub/parsers';
import type { HubCompany, HubParsedLine } from '@/lib/types';

// =============================================
// POST /api/hub/liquidaciones/upload
// ---------------------------------------------
// Carga un CSV de liquidación de una aseguradora (Spec multi-compañía §3.1).
//  Body JSON: { company_id: string, csv_content: string, periodo?: 'MM-YYYY' }
//  - Idempotencia por hash(contenido) + periodo + compañía → 409 si duplicado.
//  - Parser elegido por company.parser_key.
//  - Inserta las líneas válidas; reporta errores sin bloquear la importación.
// =============================================

interface UploadBody {
  company_id?: string;
  csv_content?: string;
  periodo?: string;
  filename?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { hubUser, error: authError } = await validateHubAuth(
      request,
      'liquidaciones.upload_csv'
    );
    if (authError) return authError;

    const body = (await request.json()) as UploadBody;
    const companyId = (body.company_id || '').trim();
    const csvContent = body.csv_content || '';
    const filename = (body.filename || 'liquidacion.csv').trim();

    if (!companyId) {
      return NextResponse.json(
        { success: false, error: 'Falta company_id' },
        { status: 400 }
      );
    }
    if (!csvContent || csvContent.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'El CSV está vacío' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Resolver compañía + parser
    const { data: company, error: compErr } = await supabase
      .from('hub_companies')
      .select('*')
      .eq('id', companyId)
      .maybeSingle();

    if (compErr) return NextResponse.json(handleSupabaseError(compErr), { status: 500 });
    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Compañía no encontrada' },
        { status: 404 }
      );
    }
    const comp = company as HubCompany;

    // Parsear
    const parser = getParser(comp.parser_key);
    const result = parser.parse(csvContent);

    if (result.n_total === 0) {
      return NextResponse.json(
        { success: false, error: 'No se han detectado líneas válidas. ¿El formato coincide con la compañía seleccionada?' },
        { status: 422 }
      );
    }

    // Periodo: el indicado, o el detectado por el parser
    const periodo = (body.periodo || result.periodo_detectado || '').trim();
    if (!periodo) {
      return NextResponse.json(
        { success: false, error: 'No se ha podido determinar el periodo (MM-YYYY). Indícalo manualmente.' },
        { status: 422 }
      );
    }

    // Hash + idempotencia
    const fileHash = createHash('sha256').update(csvContent).digest('hex');
    const { data: existing } = await supabase
      .from('hub_csv_uploads')
      .select('id, created_at, n_lineas')
      .eq('company_id', comp.id)
      .eq('periodo', periodo)
      .eq('file_hash', fileHash)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: 'Este fichero ya se cargó previamente para este periodo y compañía.',
          data: { upload_id: existing.id, cargado_at: existing.created_at },
        },
        { status: 409 }
      );
    }

    // Crear registro de carga
    const { data: upload, error: upErr } = await supabase
      .from('hub_csv_uploads')
      .insert({
        company_id: comp.id,
        periodo,
        file_hash: fileHash,
        filename,
        n_lineas: result.n_total,
        n_lineas_validas: result.n_validas,
        n_lineas_error: result.n_error,
        total_comision_bruta: result.total_comision_bruta,
        uploaded_by_email: hubUser?.email ?? null,
        estado: 'cargado',
      })
      .select('id')
      .single();

    if (upErr) return NextResponse.json(handleSupabaseError(upErr), { status: 500 });

    // Insertar líneas válidas (las inválidas se reportan, no se guardan)
    const validas = result.lineas.filter((l: HubParsedLine) => l.errores.length === 0);
    const rows = validas.map((l) => ({
      csv_upload_id: upload.id,
      company_id: comp.id,
      periodo,
      nif_agente: l.nif_agente,
      nombre_agente: l.nombre_agente,
      cliente: l.cliente,
      producto: l.producto,
      subramo: l.subramo,
      poliza: l.poliza,
      asegurado: l.asegurado,
      fecha_desde: l.fecha_desde,
      fecha_hasta: l.fecha_hasta,
      prima_neta: l.prima_neta,
      comision_bruta: l.comision_bruta,
      comision_pct_compania: l.comision_pct_compania,
      ref_externa: l.ref_externa,
      raw: l.raw,
      regimen: comp.regimen_default,
      estado: 'consolidandose' as const,
    }));

    if (rows.length > 0) {
      // Insertar en lotes de 500 para CSVs grandes (§5: hasta 5.000 líneas)
      const BATCH = 500;
      for (let i = 0; i < rows.length; i += BATCH) {
        const slice = rows.slice(i, i + BATCH);
        const { error: insErr } = await supabase.from('hub_liquidacion_lineas').insert(slice);
        if (insErr) {
          console.error('[hub/upload] error insertando líneas:', insErr);
          return NextResponse.json(handleSupabaseError(insErr), { status: 500 });
        }
      }
    }

    await logHubAction(supabase, {
      actor_email: hubUser?.email,
      actor_rol: hubUser?.rol,
      ip_address: ipFromRequest(request),
      action: 'csv_upload',
      resource_type: 'hub_csv_uploads',
      resource_id: upload.id,
      metadata: {
        company: comp.slug,
        periodo,
        n_total: result.n_total,
        n_validas: result.n_validas,
        n_error: result.n_error,
        filename,
      },
    });

    const erroresMuestra = result.lineas
      .filter((l) => l.errores.length > 0)
      .slice(0, 10)
      .map((l, i) => ({ fila: i + 2, poliza: l.poliza, errores: l.errores }));

    return NextResponse.json({
      success: true,
      message: `Cargadas ${result.n_validas} líneas válidas de ${result.n_total} (${result.n_error} con error).`,
      data: {
        upload_id: upload.id,
        company: comp.nombre,
        periodo,
        n_total: result.n_total,
        n_validas: result.n_validas,
        n_error: result.n_error,
        total_comision_bruta: result.total_comision_bruta,
        errores_muestra: erroresMuestra,
      },
    });
  } catch (err) {
    console.error('Error en /api/hub/liquidaciones/upload:', err);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
