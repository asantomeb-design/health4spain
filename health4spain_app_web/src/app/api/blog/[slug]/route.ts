import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, handleSupabaseError } from '@/lib/supabase';
import { validateAdminAuth } from '@/lib/auth';

// GET /api/blog/[slug] - Obtener post por slug (público)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'es';
    
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('lang', lang)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Post no encontrado' },
          { status: 404 }
        );
      }
      return NextResponse.json(handleSupabaseError(error), { status: 500 });
    }
    
    // Incrementar vistas
    await supabase
      .from('blog_posts')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', data.id);
    
    return NextResponse.json({ success: true, data });
    
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/blog/[slug] - Actualizar post (requiere Supabase Auth admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Validar autenticación admin
    const authResult = await validateAdminAuth(request);
    if (authResult.error) return authResult.error;
    
    const { slug } = await params;
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'es';
    
    const supabase = createServerSupabaseClient();
    
    // Buscar post existente
    const { data: existing, error: findError } = await supabase
      .from('blog_posts')
      .select('id, status')
      .eq('slug', slug)
      .eq('lang', lang)
      .single();
    
    if (findError || !existing) {
      return NextResponse.json(
        { success: false, error: 'Post no encontrado' },
        { status: 404 }
      );
    }
    
    // Preparar actualización
    const updates: Record<string, unknown> = {
      ...body,
      updated_at: new Date().toISOString(),
    };
    
    // Si cambia a published y no tenía fecha, poner fecha actual
    if (body.status === 'published' && existing.status !== 'published') {
      updates.published_at = new Date().toISOString();
    }
    
    // No permitir cambiar ciertos campos
    delete updates.id;
    delete updates.created_at;
    
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', existing.id)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(handleSupabaseError(error), { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      data,
      message: 'Post actualizado correctamente',
    });
    
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/[slug] - Eliminar post (requiere Supabase Auth admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Validar autenticación admin
    const authResult = await validateAdminAuth(request);
    if (authResult.error) return authResult.error;
    
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'es';
    
    const supabase = createServerSupabaseClient();
    
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('slug', slug)
      .eq('lang', lang);
    
    if (error) {
      return NextResponse.json(handleSupabaseError(error), { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Post eliminado correctamente',
    });
    
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
