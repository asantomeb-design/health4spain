import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, handleSupabaseError } from '@/lib/supabase';
import { validateHubAuth } from '@/lib/hub/auth';

// GET /api/hub/companies → lista de aseguradoras activas (para selector de carga)
export async function GET(request: NextRequest) {
  const { error: authError } = await validateHubAuth(request, 'hub.access');
  if (authError) return authError;

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('hub_companies')
    .select('id, slug, nombre, parser_key, regimen_default, activo')
    .eq('activo', true)
    .order('nombre');

  if (error) return NextResponse.json(handleSupabaseError(error), { status: 500 });
  return NextResponse.json({ success: true, data });
}
