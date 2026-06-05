import { NextRequest, NextResponse } from 'next/server';
import { validateHubAuth } from '@/lib/hub/auth';
import { getUsers, ghlConfigured } from '@/lib/hub/ghl-client';

// GET /api/hub/ghl/users → usuarios de la subcuenta GHL (para mapear closer↔ghl_user_id).
// Requiere integrations.manage (admin/técnico).
export async function GET(request: NextRequest) {
  const { error: authError } = await validateHubAuth(request, 'integrations.manage');
  if (authError) return authError;

  if (!ghlConfigured()) {
    return NextResponse.json(
      { success: false, error: 'GHL no configurado en el servidor.' },
      { status: 503 }
    );
  }

  const res = await getUsers();
  if (!res.ok) return NextResponse.json({ success: false, error: res.error }, { status: 502 });

  const users = (res.data ?? []).map((u) => ({
    id: u.id,
    nombre: u.name || [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email || u.id,
    email: u.email ?? null,
    rol: u.roles?.role ?? null,
  }));

  return NextResponse.json({ success: true, data: users });
}
