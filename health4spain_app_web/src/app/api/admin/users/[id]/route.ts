import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, handleSupabaseError } from '@/lib/supabase';
import { validateAdminAuth } from '@/lib/auth';
import type { AdminUserUpdatePayload } from '@/lib/types';

interface RouteContext {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const authResult = await validateAdminAuth(request);
    if (authResult.error) return authResult.error;

    const { id } = params;
    const body = (await request.json()) as AdminUserUpdatePayload;
    const supabase = createServerSupabaseClient();

    const { data: existing, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json(handleSupabaseError(fetchError), { status: 500 });
    }

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    if (
      body.active === false &&
      authResult.user?.email.toLowerCase() === existing.email.toLowerCase()
    ) {
      return NextResponse.json(
        { success: false, error: 'No puedes desactivar tu propia cuenta' },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof body.name === 'string') {
      updates.name = body.name.trim() || existing.email.split('@')[0];
    }

    if (typeof body.active === 'boolean') {
      updates.active = body.active;
    }

    const { data: updated, error: updateError } = await supabase
      .from('admin_users')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) {
      return NextResponse.json(handleSupabaseError(updateError), { status: 500 });
    }

    if (body.password && body.password.length >= 6) {
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const authUser = authUsers?.users?.find(
        (u) => (u.email || '').toLowerCase() === existing.email.toLowerCase()
      );

      if (authUser) {
        const { error: pwdError } = await supabase.auth.admin.updateUserById(authUser.id, {
          password: body.password,
        });
        if (pwdError) {
          return NextResponse.json(
            { success: false, error: `Usuario actualizado pero falló el cambio de contraseña: ${pwdError.message}` },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error('Error updating admin user:', err);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const authResult = await validateAdminAuth(request);
    if (authResult.error) return authResult.error;

    const { id } = params;
    const supabase = createServerSupabaseClient();

    const { data: existing, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json(handleSupabaseError(fetchError), { status: 500 });
    }

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    if (authResult.user?.email.toLowerCase() === existing.email.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: 'No puedes eliminar tu propia cuenta' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get('hard') === 'true';

    if (hardDelete) {
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const authUser = authUsers?.users?.find(
        (u) => (u.email || '').toLowerCase() === existing.email.toLowerCase()
      );

      if (authUser) {
        const { error: authDeleteError } = await supabase.auth.admin.deleteUser(authUser.id);
        if (authDeleteError) {
          return NextResponse.json(
            { success: false, error: authDeleteError.message },
            { status: 500 }
          );
        }
      }

      const { error: deleteError } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      if (deleteError) {
        return NextResponse.json(handleSupabaseError(deleteError), { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Usuario eliminado permanentemente' });
    }

    const { error: deactivateError } = await supabase
      .from('admin_users')
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (deactivateError) {
      return NextResponse.json(handleSupabaseError(deactivateError), { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Usuario desactivado' });
  } catch (err) {
    console.error('Error deleting admin user:', err);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
