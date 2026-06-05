// =============================================
// HEALTH4SPAIN · HUB · Audit log (append-only)
// =============================================
// Helper para registrar acciones sensibles en hub_audit_log.
// Nunca lanza: un fallo de auditoría no debe romper la operación principal,
// pero se loguea en consola para detectarlo.

import type { SupabaseClient } from '@supabase/supabase-js';

export interface HubAuditEntry {
  actor_email?: string | null;
  actor_rol?: string | null;
  ip_address?: string | null;
  action: string;
  resource_type?: string | null;
  resource_id?: string | null;
  metadata?: Record<string, unknown> | null;
  result?: string;
}

export async function logHubAction(
  supabase: SupabaseClient,
  entry: HubAuditEntry
): Promise<void> {
  try {
    const { error } = await supabase.from('hub_audit_log').insert({
      actor_email: entry.actor_email ?? null,
      actor_rol: entry.actor_rol ?? null,
      ip_address: entry.ip_address ?? null,
      action: entry.action,
      resource_type: entry.resource_type ?? null,
      resource_id: entry.resource_id ?? null,
      metadata: entry.metadata ?? {},
      result: entry.result ?? 'ok',
    });
    if (error) console.error('[hub/audit] no se pudo registrar:', error.message);
  } catch (err) {
    console.error('[hub/audit] excepción:', err);
  }
}

/** Extrae la IP del request (mejor esfuerzo, detrás de proxy Vercel). */
export function ipFromRequest(request: Request): string | null {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip');
}
