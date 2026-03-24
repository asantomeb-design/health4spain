import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, handleSupabaseError } from '@/lib/supabase';
import { validateAdminAuth } from '@/lib/auth';

// GET /api/landings - Listar landing pages (público)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const per_page = parseInt(searchParams.get('per_page') || '20');
    const servicio = searchParams.get('servicio');
    const ciudad = searchParams.get('ciudad');
    const revisado = searchParams.get('revisado'); // 'true', 'false', o null (todos)
    const activo = searchParams.get('activo');
    
    const supabase = createServerSupabaseClient();
    
    let query = supabase
      .from('landing_pages')
      .select('id, slug, servicio_slug, ciudad_slug, meta_title, hero_title, activo, revisado, generado_por_ia, created_at, updated_at', { count: 'exact' })
      .order('slug', { ascending: true });
    
    // Filtros
    if (servicio) query = query.eq('servicio_slug', servicio);
    if (ciudad) query = query.eq('ciudad_slug', ciudad);
    if (revisado === 'true') query = query.eq('revisado', true);
    if (revisado === 'false') query = query.eq('revisado', false);
    if (activo === 'true') query = query.eq('activo', true);
    if (activo === 'false') query = query.eq('activo', false);
    
    // Paginación
    const from = (page - 1) * per_page;
    const to = from + per_page - 1;
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) {
      return NextResponse.json(handleSupabaseError(error), { status: 500 });
    }
    
    return NextResponse.json({
      data: data || [],
      total: count || 0,
      page,
      per_page,
      total_pages: Math.ceil((count || 0) / per_page),
    });
    
  } catch (error) {
    console.error('Error fetching landings:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/landings - Crear landing page (requiere Supabase Auth admin)
export async function POST(request: NextRequest) {
  try {
    // Validar autenticación admin
    const authResult = await validateAdminAuth(request);
    if (authResult.error) return authResult.error;
    
    const body = await request.json();
    
    // Validación básica
    if (!body.slug || !body.servicio_slug || !body.ciudad_slug) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos: slug, servicio_slug, ciudad_slug' },
        { status: 400 }
      );
    }
    
    const supabase = createServerSupabaseClient();
    
    // Verificar que no exista
    const { data: existing } = await supabase
      .from('landing_pages')
      .select('id')
      .eq('slug', body.slug)
      .single();
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Ya existe una landing con ese slug' },
        { status: 409 }
      );
    }
    
    // Crear
    const newLanding = {
      slug: body.slug,
      servicio_slug: body.servicio_slug,
      ciudad_slug: body.ciudad_slug,
      meta_title: body.meta_title || '',
      meta_description: body.meta_description || '',
      meta_keywords: body.meta_keywords || [],
      hero_title: body.hero_title || '',
      hero_subtitle: body.hero_subtitle || '',
      hero_bullets: body.hero_bullets || [],
      problem_title: body.problem_title || '',
      problems: body.problems || [],
      solution_title: body.solution_title || '',
      solution_text: body.solution_text || '',
      services_title: body.services_title || '',
      services: body.services || [],
      why_city_title: body.why_city_title || '',
      why_city_text: body.why_city_text || '',
      why_city_stats: body.why_city_stats || [],
      faqs: body.faqs || [],
      cta_title: body.cta_title || '',
      cta_subtitle: body.cta_subtitle || '',
      activo: body.activo ?? true,
      revisado: body.revisado ?? false,
      generado_por_ia: body.generado_por_ia ?? false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('landing_pages')
      .insert(newLanding)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(handleSupabaseError(error), { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      data,
      message: 'Landing creada correctamente',
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating landing:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
