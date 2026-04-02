/**
 * GoHighLevel (GHL) Integration
 * Docs: https://marketplace.gohighlevel.com/docs/
 *
 * Crea o actualiza un contacto en GHL cada vez que llega un lead nuevo.
 * Usa la API v2 con autenticación por Private Integration Token.
 *
 * Webhooks entrantes (Workflows): GHL_INCOMING_WEBHOOK_SALUD / GHL_INCOMING_WEBHOOK_OTROS
 */

import type { Lead } from '@/lib/types';

const GHL_API_BASE = 'https://services.leadconnectorhq.com';

/** Valores de `servicio` que van al webhook de seguros / salud (encuesta paso 1) */
const SERVICIOS_WEBHOOK_SALUD = new Set<string>(['seguros']);

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
  pais_origen?: string;
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

  // Separar nombre y apellido (GHL los quiere por separado)
  const nameParts = lead.nombre.trim().split(' ');
  const firstName = nameParts[0] || lead.nombre;
  const lastName = nameParts.slice(1).join(' ') || '';

  // Teléfono: añadir código de país si viene separado
  const phone = lead.codigo_pais
    ? `+${lead.codigo_pais}${lead.telefono}`
    : lead.telefono;

  const payload = {
    locationId,
    firstName,
    lastName,
    email: lead.email,
    phone,
    tags,
    source: lead.utm_source || 'web-organico',

    // Campos personalizados (customFields) - deben existir en tu cuenta GHL
    // Si no los tienes creados, puedes comentar los que no necesites.
    customFields: [
      { key: 'ciudad_interes', field_value: lead.ciudad || '' },
      { key: 'pais_origen', field_value: lead.pais_origen || '' },
      { key: 'servicio_solicitado', field_value: lead.servicio || '' },
      { key: 'presupuesto', field_value: lead.presupuesto || '' },
      { key: 'urgencia', field_value: lead.urgencia || '' },
      { key: 'idioma_preferido', field_value: lead.idioma_preferido || 'es' },
      { key: 'landing_page', field_value: lead.landing_page || '' },
      { key: 'utm_campaign', field_value: lead.utm_campaign || '' },
      { key: 'lead_score', field_value: String(lead.score || '') },
      { key: 'mensaje', field_value: lead.mensaje || '' },
    ].filter(cf => cf.field_value !== ''), // No enviar campos vacíos

    // UTM como campos estándar de GHL
    ...(lead.utm_source && { utmSource: lead.utm_source }),
    ...(lead.utm_medium && { utmMedium: lead.utm_medium }),
    ...(lead.utm_campaign && { utmCampaign: lead.utm_campaign }),
  };

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

/**
 * Envía el lead por POST JSON al webhook entrante de GHL correspondiente al servicio elegido.
 * URLs en servidor: GHL_INCOMING_WEBHOOK_SALUD (p. ej. seguros/salud) y GHL_INCOMING_WEBHOOK_OTROS (resto).
 */
export async function sendLeadToGHLIncomingWebhook(lead: Lead): Promise<void> {
  const urlSalud = process.env.GHL_INCOMING_WEBHOOK_SALUD?.trim();
  const urlOtros = process.env.GHL_INCOMING_WEBHOOK_OTROS?.trim();

  const esSalud = SERVICIOS_WEBHOOK_SALUD.has(lead.servicio);
  const url = esSalud ? urlSalud : urlOtros;

  if (!url) {
    if (esSalud && !urlSalud) {
      console.warn('[GHL Webhook] GHL_INCOMING_WEBHOOK_SALUD no configurada; se omite el envío.');
    }
    if (!esSalud && !urlOtros) {
      console.warn('[GHL Webhook] GHL_INCOMING_WEBHOOK_OTROS no configurada; se omite el envío.');
    }
    return;
  }

  const telefonoCompleto = lead.codigo_pais
    ? `+${lead.codigo_pais}${lead.telefono}`
    : lead.telefono;

  const payload = {
    tipo_ruta: esSalud ? 'salud' : 'otros',
    lead_id: lead.id,
    nombre: lead.nombre,
    email: lead.email,
    telefono: lead.telefono,
    telefono_completo: telefonoCompleto,
    codigo_pais: lead.codigo_pais ?? null,
    fecha_nacimiento: lead.fecha_nacimiento ?? null,
    pais_origen: lead.pais_origen ?? null,
    ciudad_origen: lead.ciudad_origen ?? null,
    servicio: lead.servicio,
    ciudad: lead.ciudad,
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
