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
import {
  buildGhlWebhookSpanishFields,
  idiomaPreferidoEs,
  parseServiciosSlug,
  presupuestoEs,
  servicioEs,
  serviciosEs,
  urgenciaEs,
  type GhlWebhookSpanishFields,
} from '@/lib/ghl-spanish-labels';

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
  email?: string;
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
  'h4s_servicio',
  'h4s_ciudad',
  'h4s_pais_origen',
  'h4s_situacion',
  'h4s_plazo_necesidad',
  'h4s_idioma',
  'h4s_score',
  'h4s_presupuesto',
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
function buildGhlCustomFields(
  lead: GHLContactPayload,
  spanish?: GhlWebhookSpanishFields | null
): { id: string; value: string }[] {
  const raw = process.env.GHL_CUSTOM_FIELD_IDS?.trim();
  if (!raw) return [];

  let idMap: Record<string, string>;
  try {
    idMap = JSON.parse(raw) as Record<string, string>;
  } catch {
    console.warn('[GHL] GHL_CUSTOM_FIELD_IDS no es JSON válido; se omiten custom fields.');
    return [];
  }

  const ciudadDestino =
    spanish?.ciudad_servicio_espana_nombre?.trim() || lead.ciudad?.trim() || '';
  const presupuestoSlug = lead.presupuesto?.trim();
  const presupuestoValor =
    presupuestoSlug != null && presupuestoSlug !== ''
      ? spanish?.presupuesto_es ?? presupuestoEs(presupuestoSlug) ?? presupuestoSlug
      : undefined;

  const servicioSlugs = parseServiciosSlug(lead.servicio);
  const servicioLista = servicioSlugs.length ? servicioSlugs : (lead.servicio ? [lead.servicio] : []);
  const servicioTexto = spanish?.servicio_es ?? serviciosEs(servicioLista);
  const urgenciaTexto = spanish?.urgencia_es ?? urgenciaEs(lead.urgencia ?? '');
  const idiomaTexto =
    spanish?.idioma_preferido_es ?? idiomaPreferidoEs(lead.idioma_preferido);
  const paisOrigenTexto = spanish?.pais_origen_es ?? lead.pais_origen ?? '';

  const values: Record<CustomFieldInternalKey, string | undefined> = {
    ciudad_interes: ciudadDestino,
    ciudad_origen: lead.ciudad_origen,
    pais_origen: lead.pais_origen,
    servicio_solicitado: servicioTexto,
    h4s_servicio: servicioTexto,
    h4s_ciudad: ciudadDestino,
    h4s_pais_origen: paisOrigenTexto || undefined,
    h4s_situacion: urgenciaTexto,
    h4s_plazo_necesidad: urgenciaTexto,
    h4s_idioma: idiomaTexto,
    h4s_score: lead.score != null ? String(lead.score) : undefined,
    h4s_presupuesto: presupuestoValor,
    presupuesto: presupuestoValor,
    urgencia: spanish?.urgencia_es ?? urgenciaEs(lead.urgencia ?? ''),
    idioma_preferido:
      spanish?.idioma_preferido_es ?? idiomaPreferidoEs(lead.idioma_preferido),
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
function esAltaUrgencia(urgencia: string | undefined): boolean {
  const u = (urgencia ?? '').trim();
  return (
    u === 'esta-semana' ||
    u === 'este-mes' ||
    u === 'esta_semana' ||
    u === 'este_mes'
  );
}

export async function createGHLContact(
  lead: GHLContactPayload,
  spanishFields?: GhlWebhookSpanishFields | null,
  extraTags?: string[]
): Promise<void> {
  const apiKey = process.env.GHL_PRIVATE_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    console.warn('[GHL] Variables GHL_PRIVATE_TOKEN o GHL_LOCATION_ID no configuradas. Saltando integración.');
    return;
  }

  // Construir tags dinámicos
  const tags: string[] = ['web-lead', 'health4spain', 'web', 'origen-web'];
  const servicioSlugs = parseServiciosSlug(lead.servicio);
  const serviciosParaTags = servicioSlugs.length ? servicioSlugs : (lead.servicio ? [lead.servicio] : []);
  for (const slug of serviciosParaTags) {
    if (SERVICIO_TAGS[slug]) tags.push(SERVICIO_TAGS[slug]);
  }
  if (lead.perfil && PERFIL_TAGS[lead.perfil]) tags.push(PERFIL_TAGS[lead.perfil]);
  if (esAltaUrgencia(lead.urgencia)) tags.push('alta-urgencia');
  // Tags adicionales (p. ej. etiquetas acumuladas por el chat de Mar-IA y bot-handoff-humano)
  if (extraTags?.length) {
    for (const t of extraTags) {
      const clean = (t || '').trim();
      if (clean && !tags.includes(clean)) tags.push(clean);
    }
  }

  const { firstName, lastName } = splitNombreCompleto(lead.nombre);
  const phone = normalizeGhlPhone(lead.codigo_pais, lead.telefono);
  const customFields = buildGhlCustomFields(lead, spanishFields);

  const payload: Record<string, unknown> = {
    locationId,
    firstName,
    lastName,
    phone,
    tags,
    source: 'web',
    ...(lead.utm_source && { utmSource: lead.utm_source }),
    ...(lead.utm_medium && { utmMedium: lead.utm_medium }),
    ...(lead.utm_campaign && { utmCampaign: lead.utm_campaign }),
  };

  // Email opcional: el upsert acepta solo teléfono (p. ej. handoff de WhatsApp sin email).
  const emailNorm = lead.email?.trim();
  if (emailNorm) payload.email = emailNorm;

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
  /** Si ya se calculó en `/api/leads`, evita repetir consulta y mantiene mismos textos que la API. */
  spanishFields?: GhlWebhookSpanishFields;
}

/**
 * Payload del webhook según brief H4S_BR_1_v2:
 * - Mantener nombres de campo históricos (ciudad, servicio, ciudad_origen…)
 * - ciudad = destino en España (slug); ciudad_origen = procedencia del lead
 * - servicio = slug string; un POST por servicio (opción A)
 * - Sin objetos ni arrays en ningún valor
 */
function buildWebhookPayloadV2(
  lead: Lead,
  spanish: GhlWebhookSpanishFields,
  servicioSlug: string,
  telefonoCompleto: string,
  firstName: string,
  lastName: string
): Record<string, string | number | null> {
  const esSalud = servicioSlug === 'seguros';
  const ciudadDestinoSlug = lead.ciudad?.trim() || '';
  const ciudadDestinoNombre =
    spanish.ciudad_servicio_espana_nombre?.trim() || ciudadDestinoSlug;
  const servicioTexto = servicioEs(servicioSlug);

  return {
    tipo_ruta: esSalud ? 'salud' : 'otros',
    origen: 'web',
    lead_id: lead.id,
    nombre: lead.nombre,
    firstName,
    lastName,
    email: lead.email,
    telefono: lead.telefono,
    telefono_completo: telefonoCompleto,
    codigo_pais: lead.codigo_pais ?? null,
    fecha_nacimiento: lead.fecha_nacimiento ?? null,
    pais_origen: lead.pais_origen ?? null,
    ciudad_origen: lead.ciudad_origen ?? null,
    servicio: servicioSlug,
    ciudad: ciudadDestinoSlug,
    presupuesto: lead.presupuesto ?? null,
    urgencia: lead.urgencia ?? null,
    idioma_preferido: lead.idioma_preferido ?? 'es',
    mensaje: lead.mensaje ?? null,
    landing_page: lead.landing_page ?? null,
    utm_source: lead.utm_source ?? null,
    utm_medium: lead.utm_medium ?? null,
    utm_campaign: lead.utm_campaign ?? null,
    dispositivo: lead.dispositivo ?? null,
    score: lead.score ?? null,
    status: lead.status,
    created_at: lead.created_at,
    // Textos legibles para plantillas GHL (campos históricos *_es)
    servicio_es: servicioTexto,
    urgencia_es: spanish.urgencia_es,
    presupuesto_es: spanish.presupuesto_es,
    idioma_preferido_es: spanish.idioma_preferido_es,
    dispositivo_es: spanish.dispositivo_es,
    tipo_ruta_es: esSalud ? 'Seguros de salud' : 'Otros servicios',
    status_es: spanish.status_es,
    ciudad_servicio_espana_nombre: ciudadDestinoNombre,
    ciudad_servicio_espana: ciudadDestinoSlug,
    ciudad_interes: ciudadDestinoSlug,
    pais_origen_es: spanish.pais_origen_es,
    fecha_nacimiento_legible_es: spanish.fecha_nacimiento_legible_es,
    email_asunto: `Tu consulta sobre ${servicioTexto} en ${ciudadDestinoNombre} - Health4Spain`,
  };
}

/**
 * Envía el lead por POST JSON al webhook entrante de GHL (brief H4S_BR_1_v2).
 * Opción A: un envío por cada servicio. Sin renombrar campos del webhook.
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

  const spanish =
    extras?.spanishFields ?? (await buildGhlWebhookSpanishFields(lead, extras));

  const telefonoCompleto = normalizeGhlPhone(lead.codigo_pais, lead.telefono);
  const { firstName, lastName } = splitNombreCompleto(lead.nombre);

  const servicioSlugs = spanish.servicios.length
    ? spanish.servicios
    : parseServiciosSlug(lead.servicio);
  const serviciosParaEnviar = servicioSlugs.length
    ? servicioSlugs
    : lead.servicio?.trim()
      ? [lead.servicio.trim()]
      : [];

  if (!serviciosParaEnviar.length) {
    console.warn('[GHL Webhook] Lead sin servicio; se omite el envío.', lead.id);
    return;
  }

  for (const servicioSlug of serviciosParaEnviar) {
    const payload = buildWebhookPayloadV2(
      lead,
      spanish,
      servicioSlug,
      telefonoCompleto,
      firstName,
      lastName
    );

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const snippet = (await response.text()).slice(0, 300);
        console.error(
          `[GHL Webhook] Respuesta no OK (${servicioSlug}):`,
          response.status,
          snippet
        );
      }
    } catch (err) {
      console.error(`[GHL Webhook] Error de red (${servicioSlug}):`, err);
    }
  }
}
