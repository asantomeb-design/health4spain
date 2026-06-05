import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { createServerSupabaseClient } from '@/lib/supabase';
import { logHubAction, ipFromRequest } from '@/lib/hub/audit';

// =============================================
// POST /api/hub/ghl/webhook
// ---------------------------------------------
// Webhook entrante desde GHL (Workflow → acción "Webhook").
// Blueprint §06: idempotente + verificado + append-only.
//
// Seguridad (shared secret, porque es un webhook de workflow, no app marketplace):
//   · ?secret=... en la URL  Ó  header x-webhook-secret  ==  GHL_WEBHOOK_SECRET.
//   · Si GHL_WEBHOOK_SECRET no está configurado → 503 (fail-closed, no endpoint abierto).
//
// Idempotencia: hash SHA-256 del cuerpo → hub_processed_events (PK).
//
// Procesamiento de CVR: se ACTIVA solo cuando estén configurados
//   GHL_STAGE_RECIBIDO y GHL_STAGE_CERRADO (los confirma Claudia). Mientras
//   tanto, el evento se registra y audita, listo para reprocesar.
// =============================================

function extractStageId(body: Record<string, unknown>): string | null {
  // GHL manda distintos shapes según el trigger; cubrimos los habituales.
  const candidates = [
    body['pipelineStageId'],
    body['pipeline_stage_id'],
    (body['opportunity'] as Record<string, unknown> | undefined)?.['pipelineStageId'],
    body['stageId'],
  ];
  for (const c of candidates) if (typeof c === 'string' && c) return c;
  return null;
}

function extractAssignedTo(body: Record<string, unknown>): string | null {
  const candidates = [
    body['assignedTo'],
    body['assigned_to'],
    (body['opportunity'] as Record<string, unknown> | undefined)?.['assignedTo'],
    body['userId'],
  ];
  for (const c of candidates) if (typeof c === 'string' && c) return c;
  return null;
}

export async function GET() {
  // Health check (sin filtrar el secret)
  const configured = Boolean(process.env.GHL_WEBHOOK_SECRET?.trim());
  const cvrReady = Boolean(
    process.env.GHL_STAGE_RECIBIDO?.trim() && process.env.GHL_STAGE_CERRADO?.trim()
  );
  return NextResponse.json({ ok: true, secret_configured: configured, cvr_ready: cvrReady });
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.GHL_WEBHOOK_SECRET?.trim();
  if (!expectedSecret) {
    return NextResponse.json(
      { success: false, error: 'Webhook no configurado (falta GHL_WEBHOOK_SECRET).' },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const providedSecret = searchParams.get('secret') || request.headers.get('x-webhook-secret') || '';
  if (providedSecret !== expectedSecret) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
  }

  const rawBody = await request.text();
  let body: Record<string, unknown> = {};
  try {
    body = rawBody ? (JSON.parse(rawBody) as Record<string, unknown>) : {};
  } catch {
    return NextResponse.json({ success: false, error: 'Body no es JSON válido' }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  // Idempotencia: id estable del evento, o hash del cuerpo.
  const eventId =
    (typeof body['webhookId'] === 'string' && body['webhookId']) ||
    (typeof body['id'] === 'string' && body['id']) ||
    createHash('sha256').update(rawBody).digest('hex');
  const eventType = (typeof body['type'] === 'string' && body['type']) || 'ghl_event';

  const { error: insErr } = await supabase
    .from('hub_processed_events')
    .insert({ event_id: eventId, event_type: eventType });

  if (insErr) {
    // PK duplicada → ya procesado. Respondemos 200 para que GHL no reintente.
    if (insErr.code === '23505') {
      return NextResponse.json({ success: true, duplicate: true });
    }
    console.error('[ghl/webhook] error idempotencia:', insErr);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }

  const stageId = extractStageId(body);
  const assignedTo = extractAssignedTo(body);

  const stageRecibido = process.env.GHL_STAGE_RECIBIDO?.trim();
  const stageCerrado = process.env.GHL_STAGE_CERRADO?.trim();
  const cvrReady = Boolean(stageRecibido && stageCerrado);

  // TODO(activar con Claudia): cuando cvrReady, recalcular snapshot CVR del closer
  // (mapear assignedTo → hub_users.ghl_user_id, contar oportunidades recibidas/cerradas
  //  últimos 30d vía searchOpportunities y upsert en hub_snapshots_cvr).
  const accion = cvrReady
    ? stageId === stageCerrado
      ? 'cvr_evento_cerrado'
      : stageId === stageRecibido
      ? 'cvr_evento_recibido'
      : 'ghl_evento_otro_stage'
    : 'ghl_evento_registrado_sin_mapeo';

  await logHubAction(supabase, {
    actor_email: 'ghl-webhook',
    actor_rol: 'system',
    ip_address: ipFromRequest(request),
    action: accion,
    resource_type: 'ghl_opportunity',
    resource_id: (typeof body['contactId'] === 'string' && body['contactId']) || null,
    metadata: { eventType, stageId, assignedTo, cvrReady },
  });

  return NextResponse.json({ success: true, processed: true, cvr_ready: cvrReady, accion });
}
