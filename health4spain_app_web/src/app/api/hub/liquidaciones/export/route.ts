import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { validateHubAuth } from '@/lib/hub/auth';
import { logHubAction, ipFromRequest } from '@/lib/hub/audit';

// =============================================
// GET /api/hub/liquidaciones/export
// ---------------------------------------------
// Export CSV contable para gestoría (Manolo). Spec multi-compañía §3.5.
//  Query: periodo (req), company_id?, estado?
//  Formato español: separador ';', decimal ','.
// =============================================

interface ExportRow {
  periodo: string;
  poliza: string | null;
  cliente: string | null;
  producto: string | null;
  comision_bruta: number;
  pct_reparto: number | null;
  pct_closer: number | null;
  comision_neta: number | null;
  irpf_pct: number | null;
  irpf_importe: number | null;
  neto_pagar: number | null;
  regimen: string | null;
  fecha_cobro_estimada: string | null;
  estado: string;
  hub_users: { nombre: string; nif: string | null; iban: string | null } | null;
  hub_companies: { nombre: string } | null;
}

function num(n: number | null | undefined): string {
  if (n === null || n === undefined) return '';
  return n.toFixed(2).replace('.', ',');
}

function esc(v: string | null | undefined): string {
  const s = (v ?? '').toString();
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(request: NextRequest) {
  const { hubUser, error: authError } = await validateHubAuth(request, 'liquidaciones.export');
  if (authError) return authError;
  if (!hubUser) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const periodo = searchParams.get('periodo');
  const companyId = searchParams.get('company_id');
  const estado = searchParams.get('estado');

  if (!periodo) {
    return NextResponse.json({ success: false, error: 'Falta periodo (MM-YYYY)' }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  let query = supabase
    .from('hub_liquidacion_lineas')
    .select(
      'periodo, poliza, cliente, producto, comision_bruta, pct_reparto, pct_closer, comision_neta, irpf_pct, irpf_importe, neto_pagar, regimen, fecha_cobro_estimada, estado, hub_users(nombre, nif, iban), hub_companies(nombre)'
    )
    .eq('periodo', periodo)
    .not('hub_user_id', 'is', null)
    .order('hub_user_id');

  if (companyId) query = query.eq('company_id', companyId);
  if (estado) query = query.eq('estado', estado);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as unknown as ExportRow[];

  const headers = [
    'Periodo', 'Compañía', 'Closer', 'NIF', 'IBAN', 'Póliza', 'Cliente', 'Producto',
    'Comisión bruta', '% reparto', '% closer', 'Comisión neta', 'IRPF %', 'IRPF importe',
    'Neto a pagar', 'Régimen', 'Cobro estimado', 'Estado',
  ];

  const lines = [headers.join(';')];
  for (const r of rows) {
    lines.push([
      esc(r.periodo),
      esc(r.hub_companies?.nombre),
      esc(r.hub_users?.nombre),
      esc(r.hub_users?.nif),
      esc(r.hub_users?.iban),
      esc(r.poliza),
      esc(r.cliente),
      esc(r.producto),
      num(r.comision_bruta),
      num(r.pct_reparto),
      num(r.pct_closer),
      num(r.comision_neta),
      num(r.irpf_pct),
      num(r.irpf_importe),
      num(r.neto_pagar),
      esc(r.regimen),
      esc(r.fecha_cobro_estimada),
      esc(r.estado),
    ].join(';'));
  }

  await logHubAction(supabase, {
    actor_email: hubUser.email,
    actor_rol: hubUser.rol,
    ip_address: ipFromRequest(request),
    action: 'export_contable',
    resource_type: 'hub_liquidacion_lineas',
    metadata: { periodo, company_id: companyId, estado, n_filas: rows.length },
  });

  // BOM para que Excel reconozca UTF-8
  const csv = '\uFEFF' + lines.join('\r\n');
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="liquidacion_${periodo}.csv"`,
    },
  });
}
