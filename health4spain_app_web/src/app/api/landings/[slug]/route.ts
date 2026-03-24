import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, handleSupabaseError } from '@/lib/supabase';
import { validateAdminAuth } from '@/lib/auth';

// GET /api/landings/[slug] - Obtener landing completa (público)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Landing no encontrada' },
          { status: 404 }
        );
      }
      return NextResponse.json(handleSupabaseError(error), { status: 500 });
    }
    
    return NextResponse.json({ success: true, data });
    
  } catch (error) {
    console.error('Error fetching landing:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/landings/[slug] - Actualizar landing (requiere Supabase Auth admin)
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
    
    const supabase = createServerSupabaseClient();
    
    // Buscar existente
    const { data: existing, error: findError } = await supabase
      .from('landing_pages')
      .select('id')
      .eq('slug', slug)
      .single();
    
    if (findError || !existing) {
      return NextResponse.json(
        { success: false, error: 'Landing no encontrada' },
        { status: 404 }
      );
    }
    
    // Preparar actualización
    const updates: Record<string, unknown> = {
      ...body,
      updated_at: new Date().toISOString(),
    };
    
    // No permitir cambiar ciertos campos
    delete updates.id;
    delete updates.slug; // El slug no se puede cambiar
    delete updates.created_at;
    
    const { data, error } = await supabase
      .from('landing_pages')
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
      message: 'Landing actualizada correctamente',
    });
    
  } catch (error) {
    console.error('Error updating landing:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PATCH /api/landings/[slug] - Actualización parcial (requiere Supabase Auth admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Validar autenticación admin
    const authResult = await validateAdminAuth(request);
    if (authResult.error) return authResult.error;
    
    const { slug } = await params;
    const body = await request.json();
    
    const supabase = createServerSupabaseClient();
    
    // Solo permitir ciertos campos en PATCH
    const allowedFields = ['activo', 'revisado'];
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }
    
    const { data, error } = await supabase
      .from('landing_pages')
      .update(updates)
      .eq('slug', slug)
      .select('id, slug, activo, revisado, updated_at')
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Landing no encontrada' },
          { status: 404 }
        );
      }
      return NextResponse.json(handleSupabaseError(error), { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      data,
      message: 'Landing actualizada',
    });
    
  } catch (error) {
    console.error('Error patching landing:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/landings/[slug] - Eliminar landing (requiere Supabase Auth admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Validar autenticación admin
    const authResult = await validateAdminAuth(request);
    if (authResult.error) return authResult.error;
    
    const { slug } = await params;
    
    const supabase = createServerSupabaseClient();
    
    const { error } = await supabase
      .from('landing_pages')
      .delete()
      .eq('slug', slug);
    
    if (error) {
      return NextResponse.json(handleSupabaseError(error), { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Landing eliminada correctamente',
    });
    
  } catch (error) {
    console.error('Error deleting landing:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
