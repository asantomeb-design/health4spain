/**
 * GoHighLevel (GHL) Integration
 * Docs: https://marketplace.gohighlevel.com/docs/
 *
 * Crea o actualiza un contacto en GHL cada vez que llega un lead nuevo.
 * Usa la API v2 con autenticación por Private Integration Token.
 */

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
