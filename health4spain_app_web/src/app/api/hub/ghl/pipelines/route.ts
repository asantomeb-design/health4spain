import { NextRequest, NextResponse } from 'next/server';
import { validateHubAuth } from '@/lib/hub/auth';
import { getPipelines, ghlConfigured } from '@/lib/hub/ghl-client';

// GET /api/hub/ghl/pipelines → pipelines + stages de GHL (para mapear stage↔CVR).
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

  const res = await getPipelines();
  if (!res.ok) return NextResponse.json({ success: false, error: res.error }, { status: 502 });
  return NextResponse.json({ success: true, data: res.data });
}
