import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, handleSupabaseError } from '@/lib/supabase';
import { validateHubAuth } from '@/lib/hub/auth';
import { comisionesScope } from '@/lib/hub/permissions';

// =============================================
// GET /api/hub/liquidaciones/lineas
// ---------------------------------------------
// Lista líneas de liquidación con filtros (pantalla de asignación / closer).
//  Query: upload_id, company_id, periodo, estado, asignadas=true|false, q
//  Alcance: closer solo ve las suyas; supervisor su equipo; admin todas.
// =============================================
export async function GET(request: NextRequest) {
  const { hubUser, error: authError } = await validateHubAuth(request, 'hub.access');
  if (authError) return authError;
  if (!hubUser) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const uploadId = searchParams.get('upload_id');
  const companyId = searchParams.get('company_id');
  const periodo = searchParams.get('periodo');
  const estado = searchParams.get('estado');
  const asignadas = searchParams.get('asignadas');
  const q = searchParams.get('q');
  const limit = Math.min(parseInt(searchParams.get('limit') || '500', 10), 2000);

  const supabase = createServerSupabaseClient();
  let query = supabase
    .from('hub_liquidacion_lineas')
    .select(
      'id, company_id, periodo, cliente, producto, subramo, poliza, asegurado, prima_neta, comision_bruta, comision_pct_compania, hub_user_id, pct_reparto, pct_closer, comision_neta, neto_pagar, regimen, fecha_cobro_estimada, estado, assigned_at, hub_users(nombre)',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (uploadId) query = query.eq('csv_upload_id', uploadId);
  if (companyId) query = query.eq('company_id', companyId);
  if (periodo) query = query.eq('periodo', periodo);
  if (estado) query = query.eq('estado', estado);
  if (asignadas === 'true') query = query.not('hub_user_id', 'is', null);
  if (asignadas === 'false') query = query.is('hub_user_id', null);
  if (q) query = query.or(`poliza.ilike.%${q}%,cliente.ilike.%${q}%,asegurado.ilike.%${q}%`);

  // Alcance por rol
  const scope = comisionesScope(hubUser.rol);
  if (scope === 'own') {
    query = query.eq('hub_user_id', hubUser.id);
  } else if (scope === 'team') {
    // Supervisor: líneas de su equipo. Resolvemos ids del equipo.
    const { data: team } = await supabase
      .from('hub_users')
      .select('id')
      .eq('supervisor_id', hubUser.id)
      .eq('activo', true);
    const ids = (team ?? []).map((t) => t.id);
    ids.push(hubUser.id);
    query = query.in('hub_user_id', ids);
  } else if (scope === 'none') {
    return NextResponse.json({ success: true, data: [], count: 0 });
  }

  const { data, error, count } = await query;
  if (error) return NextResponse.json(handleSupabaseError(error), { status: 500 });
  return NextResponse.json({ success: true, data, count: count ?? data?.length ?? 0 });
}
