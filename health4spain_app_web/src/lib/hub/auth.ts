// =============================================
// HEALTH4SPAIN · HUB · Auth multi-rol (server-side)
// =============================================
// Valida el token de Supabase Auth y resuelve el hub_user correspondiente
// (por email) para obtener su rol. Comprueba capacidades RBAC opcionalmente.
//
// Diferencia con validateAdminAuth (src/lib/auth.ts):
//   · admin auth → exige estar en admin_users / whitelist env.
//   · hub auth   → exige estar en hub_users (activo). Los closers NO son
//                  admins del CMS pero sí usuarios del Hub.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@/lib/supabase';
import { can, type HubCapability } from '@/lib/hub/permissions';
import type { HubUser } from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export interface HubAuthResult {
  hubUser: HubUser | null;
  error: NextResponse | null;
}

function unauthorized(message: string, status = 401): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status });
}

/**
 * Valida la request del Hub.
 * @param request  NextRequest con header Authorization: Bearer <supabase_jwt>
 * @param capability  capacidad RBAC requerida (opcional)
 */
export async function validateHubAuth(
  request: NextRequest,
  capability?: HubCapability
): Promise<HubAuthResult> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { hubUser: null, error: unauthorized('Token de autenticación requerido') };
  }

  const token = authHeader.slice(7);

  try {
    const authClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: { user }, error } = await authClient.auth.getUser(token);
    if (error || !user?.email) {
      return { hubUser: null, error: unauthorized('Token inválido o expirado') };
    }

    // Resolver hub_user por email (activo)
    const supabase = createServerSupabaseClient();
    const { data: hubUser, error: hubErr } = await supabase
      .from('hub_users')
      .select('*')
      .eq('email', user.email.toLowerCase())
      .eq('activo', true)
      .maybeSingle();

    if (hubErr) {
      console.error('[hub/auth] error resolviendo hub_user:', hubErr);
      return { hubUser: null, error: unauthorized('Error de autenticación', 500) };
    }

    if (!hubUser) {
      return {
        hubUser: null,
        error: unauthorized('No tienes acceso al Hub Colaboradores', 403),
      };
    }

    // Comprobar capacidad RBAC si se pidió
    if (capability && !can(hubUser.rol, capability)) {
      return {
        hubUser: null,
        error: unauthorized('No tienes permisos para esta acción', 403),
      };
    }

    return { hubUser: hubUser as HubUser, error: null };
  } catch (err) {
    console.error('[hub/auth] excepción:', err);
    return { hubUser: null, error: unauthorized('Error de autenticación', 500) };
  }
}
