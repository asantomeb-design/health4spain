import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, handleSupabaseError } from '@/lib/supabase';
import { validateAdminAuth } from '@/lib/auth';
import { BlogPost, PaginatedResponse } from '@/lib/types';

// GET /api/blog - Listar posts (público)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const per_page = parseInt(searchParams.get('per_page') || '10');
    const lang = searchParams.get('lang') || 'es';
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'published';
    const search = searchParams.get('search');
    
    const supabase = createServerSupabaseClient();
    
    // Query base
    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('lang', lang)
      .eq('status', status)
      .order('published_at', { ascending: false });
    
    // Filtros opcionales
    if (category) {
      query = query.eq('category', category);
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }
    
    // Paginación
    const from = (page - 1) * per_page;
    const to = from + per_page - 1;
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) {
      return NextResponse.json(handleSupabaseError(error), { status: 500 });
    }
    
    const response: PaginatedResponse<BlogPost> = {
      data: data || [],
      total: count || 0,
      page,
      per_page,
      total_pages: Math.ceil((count || 0) / per_page),
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/blog - Crear post (requiere Supabase Auth admin)
export async function POST(request: NextRequest) {
  try {
    // Validar autenticación admin con Supabase Auth
    const authResult = await validateAdminAuth(request);
    if (authResult.error) return authResult.error;
    
    const body = await request.json();
    
    // Validación básica
    if (!body.title || !body.content || !body.slug) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos: title, content, slug' },
        { status: 400 }
      );
    }
    
    const supabase = createServerSupabaseClient();
    
    // Verificar que el slug no exista
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', body.slug)
      .eq('lang', body.lang || 'es')
      .single();
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Ya existe un post con ese slug' },
        { status: 409 }
      );
    }
    
    // Crear post
    const newPost: Partial<BlogPost> = {
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt || '',
      content: body.content,
      featured_image: body.featured_image,
      category: body.category || 'guias',
      tags: body.tags || [],
      meta_title: body.meta_title || body.title,
      meta_description: body.meta_description || body.excerpt,
      lang: body.lang || 'es',
      status: body.status || 'draft',
      author_name: body.author_name || 'Health4Spain',
      published_at: body.status === 'published' ? new Date().toISOString() : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(newPost)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(handleSupabaseError(error), { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      data,
      message: 'Post creado correctamente',
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
