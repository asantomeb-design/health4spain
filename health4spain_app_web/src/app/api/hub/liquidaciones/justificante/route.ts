import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { validateHubAuth } from '@/lib/hub/auth';
import { can } from '@/lib/hub/permissions';
import { logHubAction, ipFromRequest } from '@/lib/hub/audit';
import { formatEuros, HUB_LINEA_ESTADO_LABELS } from '@/lib/hub/commissions';

// =============================================
// GET /api/hub/liquidaciones/justificante
// ---------------------------------------------
// Justificante imprimible (guardar como PDF) de la liquidación de un closer
// en un periodo. Spec multi-compañía §3.6 ("PDF firmable").
//  Query: periodo (req), hub_user_id? (admin/supervisor; closer = sí mismo)
// =============================================

interface Row {
  poliza: string | null;
  cliente: string | null;
  producto: string | null;
  comision_bruta: number;
  comision_neta: number | null;
  irpf_importe: number | null;
  neto_pagar: number | null;
  regimen: string | null;
  estado: string;
  hub_companies: { nombre: string } | null;
}

function esc(s: string | null | undefined): string {
  return (s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
}

export async function GET(request: NextRequest) {
  const { hubUser, error: authError } = await validateHubAuth(request, 'comisiones.view.own');
  if (authError) return authError;
  if (!hubUser) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const periodo = searchParams.get('periodo');
  let targetId = searchParams.get('hub_user_id') || hubUser.id;

  if (!periodo) {
    return NextResponse.json({ success: false, error: 'Falta periodo (MM-YYYY)' }, { status: 400 });
  }

  // Un closer solo puede ver el suyo
  const esPrivilegiado = can(hubUser.rol, 'comisiones.view.team') || can(hubUser.rol, 'comisiones.view.all');
  if (!esPrivilegiado) targetId = hubUser.id;

  const supabase = createServerSupabaseClient();

  const { data: target } = await supabase
    .from('hub_users')
    .select('nombre, nif, iban, email')
    .eq('id', targetId)
    .maybeSingle();

  const { data, error } = await supabase
    .from('hub_liquidacion_lineas')
    .select('poliza, cliente, producto, comision_bruta, comision_neta, irpf_importe, neto_pagar, regimen, estado, hub_companies(nombre)')
    .eq('periodo', periodo)
    .eq('hub_user_id', targetId)
    .order('created_at');

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  const rows = (data ?? []) as unknown as Row[];
  const totalBruta = rows.reduce((s, r) => s + (Number(r.comision_bruta) || 0), 0);
  const totalNeta = rows.reduce((s, r) => s + (Number(r.comision_neta) || 0), 0);
  const totalIrpf = rows.reduce((s, r) => s + (Number(r.irpf_importe) || 0), 0);
  const totalNeto = rows.reduce((s, r) => s + (Number(r.neto_pagar) || 0), 0);

  await logHubAction(supabase, {
    actor_email: hubUser.email,
    actor_rol: hubUser.rol,
    ip_address: ipFromRequest(request),
    action: 'justificante_pdf',
    resource_type: 'hub_liquidacion_lineas',
    resource_id: targetId,
    metadata: { periodo, n_lineas: rows.length, total_neto: totalNeto },
  });

  const filas = rows.map((r) => `
    <tr>
      <td>${esc(r.hub_companies?.nombre)}</td>
      <td>${esc(r.poliza)}</td>
      <td>${esc(r.cliente)}</td>
      <td>${esc(r.producto)}</td>
      <td>${esc(r.regimen)}</td>
      <td>${esc(HUB_LINEA_ESTADO_LABELS[r.estado] || r.estado)}</td>
      <td class="r">${formatEuros(Number(r.comision_bruta) || 0)}</td>
      <td class="r">${formatEuros(Number(r.comision_neta) || 0)}</td>
      <td class="r">${formatEuros(Number(r.neto_pagar) || 0)}</td>
    </tr>`).join('');

  const hoy = new Date().toLocaleDateString('es-ES');

  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"/>
<meta name="robots" content="noindex,nofollow"/>
<title>Justificante de comisiones ${esc(periodo)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 40px; }
  .head { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #c7956d; padding-bottom:16px; margin-bottom:24px; }
  h1 { font-size: 20px; margin: 0; }
  .muted { color:#666; font-size:12px; }
  .meta { margin: 16px 0 24px; font-size: 13px; line-height: 1.7; }
  table { width:100%; border-collapse: collapse; font-size: 12px; }
  th, td { padding: 7px 8px; border-bottom: 1px solid #eee; text-align:left; }
  th { background:#f7f7f7; text-transform:uppercase; font-size:10px; letter-spacing:.05em; color:#666; }
  td.r, th.r { text-align: right; }
  tfoot td { font-weight: bold; border-top: 2px solid #333; }
  .firma { margin-top: 60px; display:flex; gap:60px; }
  .firma div { flex:1; border-top:1px solid #999; padding-top:8px; font-size:12px; color:#666; }
  .btn { margin-bottom:24px; }
  button { background:#c7956d; color:#fff; border:0; padding:10px 20px; border-radius:8px; font-size:14px; cursor:pointer; }
  @media print { .btn { display:none; } body { padding: 0; } }
</style></head>
<body>
  <div class="btn"><button onclick="window.print()">Imprimir / Guardar PDF</button></div>
  <div class="head">
    <div>
      <h1>Justificante de comisiones</h1>
      <p class="muted">Health4Spain · Hub Colaboradores</p>
    </div>
    <div class="muted" style="text-align:right">
      Periodo <strong>${esc(periodo)}</strong><br/>Emitido ${hoy}
    </div>
  </div>

  <div class="meta">
    <strong>Colaborador:</strong> ${esc(target?.nombre)}<br/>
    <strong>NIF:</strong> ${esc(target?.nif) || '—'} &nbsp;·&nbsp; <strong>IBAN:</strong> ${esc(target?.iban) || '—'}<br/>
    <strong>Email:</strong> ${esc(target?.email)}
  </div>

  <table>
    <thead><tr>
      <th>Compañía</th><th>Póliza</th><th>Cliente</th><th>Producto</th><th>Régimen</th><th>Estado</th>
      <th class="r">Bruta</th><th class="r">Neta</th><th class="r">Neto a pagar</th>
    </tr></thead>
    <tbody>${filas || '<tr><td colspan="9" style="text-align:center;color:#999;padding:24px">Sin líneas para este periodo.</td></tr>'}</tbody>
    <tfoot><tr>
      <td colspan="6">Totales (${rows.length} líneas) · IRPF ${formatEuros(totalIrpf)}</td>
      <td class="r">${formatEuros(totalBruta)}</td>
      <td class="r">${formatEuros(totalNeta)}</td>
      <td class="r">${formatEuros(totalNeto)}</td>
    </tr></tfoot>
  </table>

  <div class="firma">
    <div>Firma del colaborador</div>
    <div>Health4Spain</div>
  </div>
</body></html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow' },
  });
}
