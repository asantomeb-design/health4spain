// =============================================
// HEALTH4SPAIN · HUB · Cliente de lectura GoHighLevel
// =============================================
// Reutiliza el Private Token + Location ID YA configurados (los mismos que usa
// src/lib/gohighlevel.ts para empujar leads). Aquí solo LEEMOS de GHL:
// pipelines/stages, usuarios y oportunidades. Sirve para:
//   · que admin/técnico hagan el mapeo closer↔usuario GHL y stage↔CVR,
//   · alimentar el cálculo de CVR cuando se confirmen los stages.
//
// No lanza: ante fallo devuelve { ok:false, error } para que la UI lo muestre.

const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';

function creds(): { token: string; locationId: string } | null {
  const token = process.env.GHL_PRIVATE_TOKEN?.trim();
  const locationId = process.env.GHL_LOCATION_ID?.trim();
  if (!token || !locationId) return null;
  return { token, locationId };
}

export interface GhlResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

async function ghlGet<T>(path: string): Promise<GhlResult<T>> {
  const c = creds();
  if (!c) return { ok: false, error: 'GHL no configurado (falta GHL_PRIVATE_TOKEN o GHL_LOCATION_ID).' };

  try {
    const res = await fetch(`${GHL_API_BASE}${path}`, {
      headers: {
        Authorization: `Bearer ${c.token}`,
        Version: GHL_VERSION,
        Accept: 'application/json',
      },
      // Respuestas de configuración cambian poco: cache corto
      next: { revalidate: 60 },
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, error: `GHL ${res.status}: ${json?.message || res.statusText}` };
    }
    return { ok: true, data: json as T };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Error de red con GHL' };
  }
}

// ---------------------------------------------
// Pipelines + stages
// ---------------------------------------------
export interface GhlStage {
  id: string;
  name: string;
  position?: number;
}
export interface GhlPipeline {
  id: string;
  name: string;
  stages: GhlStage[];
}

export async function getPipelines(): Promise<GhlResult<GhlPipeline[]>> {
  const c = creds();
  if (!c) return { ok: false, error: 'GHL no configurado.' };
  const res = await ghlGet<{ pipelines: GhlPipeline[] }>(
    `/opportunities/pipelines?locationId=${encodeURIComponent(c.locationId)}`
  );
  if (!res.ok) return { ok: false, error: res.error };
  return { ok: true, data: res.data?.pipelines ?? [] };
}

// ---------------------------------------------
// Usuarios de la subcuenta
// ---------------------------------------------
export interface GhlUser {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roles?: { role?: string };
}

export async function getUsers(): Promise<GhlResult<GhlUser[]>> {
  const c = creds();
  if (!c) return { ok: false, error: 'GHL no configurado.' };
  const res = await ghlGet<{ users: GhlUser[] }>(
    `/users/?locationId=${encodeURIComponent(c.locationId)}`
  );
  if (!res.ok) return { ok: false, error: res.error };
  return { ok: true, data: res.data?.users ?? [] };
}

// ---------------------------------------------
// Búsqueda de oportunidades (para CVR cuando se confirmen stages)
// ---------------------------------------------
export interface GhlOpportunity {
  id: string;
  name?: string;
  pipelineId?: string;
  pipelineStageId?: string;
  status?: string;
  assignedTo?: string;
  contactId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GhlOpportunitySearch {
  opportunities: GhlOpportunity[];
  meta?: { total?: number; nextPageUrl?: string };
}

export async function searchOpportunities(params: {
  pipelineId?: string;
  stageId?: string;
  assignedTo?: string;
  startAfter?: string;
  limit?: number;
}): Promise<GhlResult<GhlOpportunitySearch>> {
  const c = creds();
  if (!c) return { ok: false, error: 'GHL no configurado.' };
  const qs = new URLSearchParams({ location_id: c.locationId });
  if (params.pipelineId) qs.set('pipeline_id', params.pipelineId);
  if (params.stageId) qs.set('pipeline_stage_id', params.stageId);
  if (params.assignedTo) qs.set('assigned_to', params.assignedTo);
  if (params.limit) qs.set('limit', String(params.limit));
  return ghlGet<GhlOpportunitySearch>(`/opportunities/search?${qs.toString()}`);
}

export function ghlConfigured(): boolean {
  return creds() !== null;
}
