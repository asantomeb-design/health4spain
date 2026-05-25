import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, handleSupabaseError } from '@/lib/supabase';
import { validateAdminAuth } from '@/lib/auth';
import type { AdminUser, AdminUserCreatePayload } from '@/lib/types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function fetchAuthUsersByEmail() {
  const supabase = createServerSupabaseClient();
  const map = new Map<
    string,
    { id: string; last_sign_in_at: string | null }
  >();

  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    const users = data?.users || [];
    for (const user of users) {
      const email = (user.email || '').toLowerCase();
      if (!email) continue;
      map.set(email, {
        id: user.id,
        last_sign_in_at: user.last_sign_in_at ?? null,
      });
    }

    if (users.length < perPage) break;
    page += 1;
  }

  return map;
}

function enrichAdminUser(
  row: AdminUser,
  authMap: Map<string, { id: string; last_sign_in_at: string | null }>
): AdminUser {
  const auth = authMap.get(row.email.toLowerCase());
  return {
    ...row,
    auth_user_id: auth?.id ?? null,
    last_sign_in_at: auth?.last_sign_in_at ?? null,
    has_auth_account: Boolean(auth?.id),
  };
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await validateAdminAuth(request);
    if (authResult.error) return authResult.error;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get('per_page') || '20', 10)));
    const search = searchParams.get('search')?.trim();
    const activeFilter = searchParams.get('active');

    const supabase = createServerSupabaseClient();

    let query = supabase
      .from('admin_users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (activeFilter === 'true') query = query.eq('active', true);
    if (activeFilter === 'false') query = query.eq('active', false);

    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
    }

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    const [{ data, error, count }, authMap] = await Promise.all([
      query,
      fetchAuthUsersByEmail(),
    ]);

    if (error) {
      return NextResponse.json(handleSupabaseError(error), { status: 500 });
    }

    const enriched = (data || []).map((row) => enrichAdminUser(row as AdminUser, authMap));

    return NextResponse.json({
      data: enriched,
      total: count || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((count || 0) / perPage),
    });
  } catch (err) {
    console.error('Error fetching admin users:', err);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await validateAdminAuth(request);
    if (authResult.error) return authResult.error;

    const body = (await request.json()) as Partial<AdminUserCreatePayload>;
    const email = (body.email || '').trim().toLowerCase();
    const name = (body.name || '').trim() || email.split('@')[0];
    const password = body.password || '';

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Email no válido' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    const { data: existing } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Ya existe un usuario con ese email' },
        { status: 409 }
      );
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (authError) {
      if (authError.message.includes('already been registered')) {
        return NextResponse.json(
          { success: false, error: 'Ya existe una cuenta Auth con ese email' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const { data: inserted, error: insertError } = await supabase
      .from('admin_users')
      .insert({
        email,
        name,
        active: true,
        updated_at: now,
      })
      .select('*')
      .single();

    if (insertError) {
      if (authData.user?.id) {
        await supabase.auth.admin.deleteUser(authData.user.id);
      }
      return NextResponse.json(handleSupabaseError(insertError), { status: 500 });
    }

    const enriched: AdminUser = {
      ...(inserted as AdminUser),
      auth_user_id: authData.user?.id ?? null,
      last_sign_in_at: null,
      has_auth_account: Boolean(authData.user?.id),
    };

    return NextResponse.json(
      { success: true, data: enriched },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error creating admin user:', err);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
