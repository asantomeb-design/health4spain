import { NextRequest, NextResponse } from 'next/server';
import { validateHubAuth } from '@/lib/hub/auth';
import { capabilitiesOf, HUB_ROLE_LABELS } from '@/lib/hub/permissions';

// =============================================
// GET /api/hub/me
// ---------------------------------------------
// Resuelve el hub_user del token Supabase y devuelve su perfil + rol +
// capacidades RBAC. Base del gate de acceso del Hub.
// =============================================

export async function GET(request: NextRequest) {
  const { hubUser, error } = await validateHubAuth(request);
  if (error) return error;
  if (!hubUser) {
    return NextResponse.json(
      { success: false, error: 'No tienes acceso al Hub' },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      id: hubUser.id,
      nombre: hubUser.nombre,
      email: hubUser.email,
      rol: hubUser.rol,
      rol_label: HUB_ROLE_LABELS[hubUser.rol],
      canal: hubUser.canal,
      supervisor_id: hubUser.supervisor_id ?? null,
      productos_asignados: hubUser.productos_asignados ?? [],
      capabilities: capabilitiesOf(hubUser.rol),
    },
  });
}
