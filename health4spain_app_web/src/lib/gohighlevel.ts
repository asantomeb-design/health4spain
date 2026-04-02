/**
 * GoHighLevel (GHL) Integration
 * Docs: https://marketplace.gohighlevel.com/docs/
 *
 * Crea o actualiza un contacto en GHL cada vez que llega un lead nuevo.
 * Usa la API v2 con autenticación por Private Integration Token.
 *
 * Webhook entrante (Workflows): GHL_INCOMING_WEBHOOK_SALUD — todos los leads (el JSON trae `servicio`).
 */

import type { Lead } from '@/lib/types';

const GHL_API_BASE = 'https://services.leadconnectorhq.com';

// Mapa de servicios web → tags en GHL
const SERVICIO_TAGS: Record<string, string> = {
  seguros: 'servicio-seguros',
  abogados: 'servicio-abogados',
  inmobiliarias: 'servicio-inmobiliarias',
  gestorias: 'servicio-gestorias',
};

// Mapa de perfiles web → tags en GHL
const PERFIL_TAGS: Record<string, string> = {
  jubilados: 'perfil-jubilado',
  trabajadores: 'perfil-trabajador',
  inversores: 'perfil-inversor',
  estudiantes: 'perfil-estudiante',
};

export interface GHLContactPayload {
  nombre: string;
  email: string;
  telefono: string;
  codigo_pais?: string;
  ciudad?: string;
  ciudad_origen?: string;
  pais_origen?: string;
  fecha_nacimiento?: string;
  servicio?: string;
  perfil?: string;
  presupuesto?: string;
  urgencia?: string;
  idioma_preferido?: string;
  mensaje?: string;
  landing_page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  score?: number;
}

/** Nombres internos → valor del lead (para GHL_CUSTOM_FIELD_IDS). */
const CUSTOM_FIELD_VALUE_KEYS = [
  'ciudad_interes',
  'ciudad_origen',
  'pais_origen',
  'servicio_solicitado',
  'presupuesto',
  'urgencia',
  'idioma_preferido',
  'landing_page',
  'utm_campaign',
  'lead_score',
  'mensaje',
  'fecha_nacimiento',
] as const;

type CustomFieldInternalKey = (typeof CUSTOM_FIELD_VALUE_KEYS)[number];

function splitNombreCompleto(nombre: string): { firstName: string; lastName: string } {
  const parts = nombre.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] || nombre.trim() || 'Lead';
  const lastName = parts.slice(1).join(' ');
  return { firstName, lastName };
}

/** E.164: código país numérico + número nacional en dígitos. */
function normalizeGhlPhone(codigoPais: string | undefined, telefono: string): string {
  const raw = (telefono || '').trim();
  if (!raw) return '';
  if (raw.startsWith('+')) {
    const rest = raw.slice(1).replace(/\D/g, '');
    return rest ? `+${rest}` : '';
  }
  const national = raw.replace(/\D/g, '');
  if (!national) return '';
  const cc = (codigoPais || '').replace(/\D/g, '');
  if (cc) return `+${cc}${national}`;
  return `+${national}`;
}

/**
 * La API v2 de GHL espera customFields como { id, value } (UUID del campo en la sub-cuenta).
 * Ver GHL_CUSTOM_FIELD_IDS en .env.example. Sin ese mapa no enviamos customFields para no romper el upsert.
 */
function buildGhlCustomFields(lead: GHLContactPayload): { id: string; value: string }[] {
  const raw = process.env.GHL_CUSTOM_FIELD_IDS?.trim();
  if (!raw) return [];

  let idMap: Record<string, string>;
  try {
    idMap = JSON.parse(raw) as Record<string, string>;
  } catch {
    console.warn('[GHL] GHL_CUSTOM_FIELD_IDS no es JSON válido; se omiten custom fields.');
    return [];
  }

  const values: Record<CustomFieldInternalKey, string | undefined> = {
    ciudad_interes: lead.ciudad,
    ciudad_origen: lead.ciudad_origen,
    pais_origen: lead.pais_origen,
    servicio_solicitado: lead.servicio,
    presupuesto: lead.presupuesto,
    urgencia: lead.urgencia,
    idioma_preferido: lead.idioma_preferido || 'es',
    landing_page: lead.landing_page,
    utm_campaign: lead.utm_campaign,
    lead_score: lead.score != null ? String(lead.score) : undefined,
    mensaje: lead.mensaje,
    fecha_nacimiento: lead.fecha_nacimiento,
  };

  const out: { id: string; value: string }[] = [];
  for (const key of CUSTOM_FIELD_VALUE_KEYS) {
    const id = idMap[key];
    const v = values[key];
    if (id && v != null && String(v).trim() !== '') {
      out.push({ id, value: String(v).trim() });
    }
  }
  return out;
}

/**
 * Crea un contacto en GoHighLevel.
 * Si el contacto ya existe (mismo email), GHL lo actualiza automáticamente (upsert).
 */
export async function createGHLContact(lead: GHLContactPayload): Promise<void> {
  const apiKey = process.env.GHL_PRIVATE_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    console.warn('[GHL] Variables GHL_PRIVATE_TOKEN o GHL_LOCATION_ID no configuradas. Saltando integración.');
    return;
  }

  // Construir tags dinámicos
  const tags: string[] = ['web-lead', 'health4spain'];
  if (lead.servicio && SERVICIO_TAGS[lead.servicio]) tags.push(SERVICIO_TAGS[lead.servicio]);
  if (lead.perfil && PERFIL_TAGS[lead.perfil]) tags.push(PERFIL_TAGS[lead.perfil]);
  if (lead.urgencia === 'esta-semana' || lead.urgencia === 'este-mes') tags.push('alta-urgencia');

  const { firstName, lastName } = splitNombreCompleto(lead.nombre);
  const phone = normalizeGhlPhone(lead.codigo_pais, lead.telefono);
  const customFields = buildGhlCustomFields(lead);

  const payload: Record<string, unknown> = {
    locationId,
    firstName,
    lastName,
    email: lead.email,
    phone,
    tags,
    source: lead.utm_source || 'web-organico',
    ...(lead.utm_source && { utmSource: lead.utm_source }),
    ...(lead.utm_medium && { utmMedium: lead.utm_medium }),
    ...(lead.utm_campaign && { utmCampaign: lead.utm_campaign }),
  };

  // Campo estándar "City" en GHL = ciudad donde vive el contacto (paso 2), no la ciudad del servicio en España (paso 1).
  const ciudadOrigen = lead.ciudad_origen?.trim();
  if (ciudadOrigen) payload.city = ciudadOrigen;
  if (lead.pais_origen && /^[A-Za-z]{2}$/.test(lead.pais_origen)) {
    payload.country = lead.pais_origen.toUpperCase();
  }
  if (lead.fecha_nacimiento) payload.dateOfBirth = lead.fecha_nacimiento;
  if (customFields.length > 0) payload.customFields = customFields;

  try {
    const response = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('[GHL] Error al crear contacto:', {
        status: response.status,
        body: responseData,
      });
      return;
    }

    const action = responseData.traceId ? 'actualizado' : 'creado';
    console.log(`[GHL] Contacto ${action} correctamente. ID: ${responseData.contact?.id}`);

  } catch (err) {
    // Nunca lanzar el error hacia arriba — que GHL falle no debe romper la web
    console.error('[GHL] Excepción al llamar a la API:', err);
  }
}

/** Datos solo para el webhook (no se guardan en Supabase salvo que el cliente los envíe en el POST). */
export interface GHLWebhookExtras {
  /** Nombre legible de la ciudad/zona donde quiere el servicio (paso 1), p. ej. "Alicante". */
  ciudadServicioNombre?: string;
}

/**
 * Envía el lead por POST JSON al webhook entrante de GHL correspondiente al servicio elegido.
 * URL en servidor: GHL_INCOMING_WEBHOOK_SALUD (único webhook; segmentar en GHL con `servicio` o `tipo_ruta`).
 *
 * Claves recomendadas en el flujo GHL:
 * - Campo estándar **City** → `{{inboundWebhookRequest.ciudad_origen}}` (ciudad de procedencia del usuario).
 * - Custom **¿Dónde en España?** → `{{inboundWebhookRequest.ciudad_servicio_espana_nombre}}` o `ciudad_servicio_espana` (slug).
 */
export async function sendLeadToGHLIncomingWebhook(
  lead: Lead,
  extras?: GHLWebhookExtras
): Promise<void> {
  const url = process.env.GHL_INCOMING_WEBHOOK_SALUD?.trim();

  if (!url) {
    console.warn('[GHL Webhook] GHL_INCOMING_WEBHOOK_SALUD no configurada; se omite el envío.');
    return;
  }

  const esSalud = lead.servicio === 'seguros';

  const telefonoCompleto = normalizeGhlPhone(lead.codigo_pais, lead.telefono);
  const { firstName, lastName } = splitNombreCompleto(lead.nombre);

  const ciudadServicioSlug = lead.ciudad;
  const ciudadServicioNombre =
    extras?.ciudadServicioNombre?.trim() || null;

  const payload = {
    /** Ayuda en GHL si quieres ramificar: `salud` solo si servicio es seguros; si no, `otros`. */
    tipo_ruta: esSalud ? 'salud' : 'otros',
    lead_id: lead.id,
    nombre: lead.nombre,
    firstName,
    lastName,
    email: lead.email,
    telefono: lead.telefono,
    phone: telefonoCompleto,
    telefono_completo: telefonoCompleto,
    codigo_pais: lead.codigo_pais ?? null,
    fecha_nacimiento: lead.fecha_nacimiento ?? null,
    /** Alias camelCase por si GHL solo sugiere claves “estilo inglés” en el mapeo */
    dateOfBirth: lead.fecha_nacimiento ?? null,
    pais_origen: lead.pais_origen ?? null,
    /** Ciudad donde vive / procedencia (paso 2 del formulario solicitar). */
    ciudad_origen: lead.ciudad_origen ?? null,
    servicio: lead.servicio,
    /**
     * Slug de la ciudad/zona en España donde quiere el servicio (paso 1).
     * `ciudad` se mantiene por compatibilidad; preferir `ciudad_servicio_espana` en mapeos nuevos.
     */
    ciudad: ciudadServicioSlug,
    ciudad_interes: ciudadServicioSlug,
    ciudad_servicio_espana: ciudadServicioSlug,
    ciudad_servicio_espana_nombre: ciudadServicioNombre,
    presupuesto: lead.presupuesto ?? null,
    urgencia: lead.urgencia,
    idioma_preferido: lead.idioma_preferido,
    mensaje: lead.mensaje ?? null,
    landing_page: lead.landing_page,
    utm_source: lead.utm_source ?? null,
    utm_medium: lead.utm_medium ?? null,
    utm_campaign: lead.utm_campaign ?? null,
    dispositivo: lead.dispositivo ?? null,
    score: lead.score ?? null,
    status: lead.status,
    created_at: lead.created_at,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const snippet = (await response.text()).slice(0, 300);
      console.error('[GHL Webhook] Respuesta no OK:', response.status, snippet);
    }
  } catch (err) {
    console.error('[GHL Webhook] Error de red:', err);
  }
}
