import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, handleSupabaseError } from '@/lib/supabase';
import { validateHubAuth } from '@/lib/hub/auth';
import { leadsScope } from '@/lib/hub/permissions';
import type { HubRole } from '@/lib/types';

// GET /api/hub/users?rol=closer → lista de usuarios del Hub (para asignación).
// Supervisor ve solo su equipo; admin ve todos.
export async function GET(request: NextRequest) {
  const { hubUser, error: authError } = await validateHubAuth(request, 'liquidaciones.assign');
  if (authError) return authError;
  if (!hubUser) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const rolFilter = searchParams.get('rol') as HubRole | null;

  const supabase = createServerSupabaseClient();
  let query = supabase
    .from('hub_users')
    .select('id, nombre, email, rol, canal, supervisor_id, productos_asignados')
    .eq('activo', true)
    .order('nombre');

  if (rolFilter) query = query.eq('rol', rolFilter);

  // Alcance: supervisor solo ve su equipo
  if (leadsScope(hubUser.rol) === 'team') {
    query = query.eq('supervisor_id', hubUser.id);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json(handleSupabaseError(error), { status: 500 });
  return NextResponse.json({ success: true, data });
}
