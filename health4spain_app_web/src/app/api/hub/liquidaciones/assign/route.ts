import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, handleSupabaseError } from '@/lib/supabase';
import { validateHubAuth } from '@/lib/hub/auth';
import { logHubAction, ipFromRequest } from '@/lib/hub/audit';
import { computeComisionLinea, fechaCobroEstimada, IRPF_PCT_DEFAULT } from '@/lib/hub/commissions';
import type { HubRegimen } from '@/lib/types';

// =============================================
// POST /api/hub/liquidaciones/assign
// ---------------------------------------------
// Asigna una o varias líneas a un closer (Spec multi-compañía §3.3).
//  Body: {
//    linea_ids: string[],          // líneas a asignar (bulk)
//    hub_user_id: string,          // closer destino
//    pct_reparto?: number,         // 100 si no se reparte la póliza
//    pct_closer?: number,          // override; si no, se busca en commission_config
//    irpf_pct?: number,            // override del 15% por defecto
//    bonus_pct?: number,           // bono CVR a aplicar (0 por defecto)
//  }
// =============================================

interface AssignBody {
  linea_ids?: string[];
  hub_user_id?: string;
  pct_reparto?: number;
  pct_closer?: number;
  irpf_pct?: number;
  bonus_pct?: number;
}

export async function POST(request: NextRequest) {
  try {
    const { hubUser, error: authError } = await validateHubAuth(request, 'liquidaciones.assign');
    if (authError) return authError;
    if (!hubUser) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });

    const body = (await request.json()) as AssignBody;
    const lineaIds = Array.isArray(body.linea_ids) ? body.linea_ids.filter(Boolean) : [];
    const closerId = (body.hub_user_id || '').trim();
    const pctReparto = typeof body.pct_reparto === 'number' ? body.pct_reparto : 100;
    const irpfPct = typeof body.irpf_pct === 'number' ? body.irpf_pct : IRPF_PCT_DEFAULT;
    const bonusPct = typeof body.bonus_pct === 'number' ? body.bonus_pct : 0;

    if (lineaIds.length === 0) {
      return NextResponse.json({ success: false, error: 'No hay líneas para asignar' }, { status: 400 });
    }
    if (!closerId) {
      return NextResponse.json({ success: false, error: 'Falta hub_user_id (closer)' }, { status: 400 });
    }
    if (pctReparto < 0 || pctReparto > 100) {
      return NextResponse.json({ success: false, error: 'pct_reparto debe estar entre 0 y 100' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Validar closer
    const { data: closer, error: closerErr } = await supabase
      .from('hub_users')
      .select('id, nombre, rol, supervisor_id')
      .eq('id', closerId)
      .eq('activo', true)
      .maybeSingle();
    if (closerErr) return NextResponse.json(handleSupabaseError(closerErr), { status: 500 });
    if (!closer) {
      return NextResponse.json({ success: false, error: 'Closer no encontrado o inactivo' }, { status: 404 });
    }

    // Supervisor solo asigna a su equipo
    if (hubUser.rol === 'supervisor' && closer.supervisor_id !== hubUser.id) {
      return NextResponse.json(
        { success: false, error: 'Solo puedes asignar a closers de tu equipo' },
        { status: 403 }
      );
    }

    // Cargar líneas a asignar
    const { data: lineas, error: lineasErr } = await supabase
      .from('hub_liquidacion_lineas')
      .select('id, company_id, producto, comision_bruta, periodo, regimen')
      .in('id', lineaIds);
    if (lineasErr) return NextResponse.json(handleSupabaseError(lineasErr), { status: 500 });
    if (!lineas || lineas.length === 0) {
      return NextResponse.json({ success: false, error: 'Líneas no encontradas' }, { status: 404 });
    }

    const now = new Date().toISOString();
    let asignadas = 0;
    const errores: { id: string; error: string }[] = [];

    for (const linea of lineas) {
      // Resolver pct_closer: override del body o de commission_config
      let pctCloser = body.pct_closer;
      let regimen: HubRegimen | null = (linea.regimen as HubRegimen) ?? null;

      if (pctCloser === undefined) {
        const { data: cfg } = await supabase
          .from('hub_commission_config')
          .select('pct_closer, regimen')
          .eq('hub_user_id', closerId)
          .eq('company_id', linea.company_id)
          .eq('producto', linea.producto ?? '')
          .eq('activo', true)
          .maybeSingle();
        if (cfg) {
          pctCloser = cfg.pct_closer;
          if (cfg.regimen) regimen = cfg.regimen as HubRegimen;
        }
      }

      if (pctCloser === undefined || pctCloser === null) {
        errores.push({ id: linea.id, error: 'Sin % de comisión configurado para este closer/compañía/producto' });
        continue;
      }

      const breakdown = computeComisionLinea({
        comisionBruta: Number(linea.comision_bruta) || 0,
        pctReparto,
        pctCloser,
        bonusPct,
        irpfPct,
      });

      const fechaCobro = regimen ? fechaCobroEstimada(linea.periodo, regimen) : null;

      const { error: updErr } = await supabase
        .from('hub_liquidacion_lineas')
        .update({
          hub_user_id: closerId,
          pct_reparto: pctReparto,
          pct_closer: pctCloser,
          comision_neta: breakdown.comisionTotal,
          bonus_cvr: breakdown.bonusCvr,
          irpf_pct: breakdown.irpfPct,
          irpf_importe: breakdown.irpfImporte,
          neto_pagar: breakdown.netoPagar,
          regimen,
          fecha_cobro_estimada: fechaCobro,
          estado: 'acumulado',
          assigned_by_email: hubUser.email,
          assigned_at: now,
        })
        .eq('id', linea.id);

      if (updErr) {
        errores.push({ id: linea.id, error: updErr.message });
        continue;
      }
      asignadas++;
    }

    await logHubAction(supabase, {
      actor_email: hubUser.email,
      actor_rol: hubUser.rol,
      ip_address: ipFromRequest(request),
      action: 'lineas_assign',
      resource_type: 'hub_liquidacion_lineas',
      resource_id: closerId,
      metadata: { closer: closer.nombre, n_solicitadas: lineaIds.length, n_asignadas: asignadas, pctReparto },
    });

    return NextResponse.json({
      success: true,
      message: `${asignadas} línea(s) asignadas a ${closer.nombre}.`,
      data: { asignadas, errores },
    });
  } catch (err) {
    console.error('Error en /api/hub/liquidaciones/assign:', err);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
