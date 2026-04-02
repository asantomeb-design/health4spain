/**
 * Etiquetas en español para payloads hacia GoHighLevel (webhook),
 * alineadas con el formulario ES (`getDictionary('es').request`).
 */

import { getDictionary } from '@/lib/dictionaries';
import { createServerSupabaseClient } from '@/lib/supabase';
import type { Lead } from '@/lib/types';

/** Misma forma que `GHLWebhookExtras` en gohighlevel (evita import circular). */
export type GhlWebhookExtrasInput = { ciudadServicioNombre?: string };

const STATUS_ES: Record<string, string> = {
  nuevo: 'Nuevo',
  contactado: 'Contactado',
  cualificado: 'Cualificado',
  asignado: 'Asignado',
  en_proceso: 'En proceso',
  convertido: 'Convertido',
  perdido: 'Perdido',
  descartado: 'Descartado',
};

/** Urgencias del componente LeadForm (guiones bajos), no del flujo solicitar. */
const URGENCIA_LEGACY_ES: Record<string, string> = {
  esta_semana: 'Esta semana',
  este_mes: 'Este mes',
  sin_prisa: 'Sin prisa',
};

function requestEs() {
  return getDictionary('es').request;
}

export function servicioEs(slug: string): string {
  if (slug === 'otro') return 'Otro servicio';
  const s = requestEs().servicios as Record<string, string>;
  return s[slug] ?? slug;
}

export function presupuestoEs(key: string | undefined | null): string | null {
  if (key == null || key === '') return null;
  const p = requestEs().presupuestos as Record<string, string>;
  return p[key] ?? null;
}

export function urgenciaEs(key: string | undefined | null): string | null {
  if (key == null || key === '') return null;
  if (key === 'no_especificado') return 'No especificado';
  const u = requestEs().urgencias as Record<string, string>;
  if (u[key]) return u[key];
  if (URGENCIA_LEGACY_ES[key]) return URGENCIA_LEGACY_ES[key];
  return key;
}

export function idiomaPreferidoEs(code: string | undefined): string {
  const m: Record<string, string> = {
    es: 'Español',
    en: 'Inglés',
    de: 'Alemán',
    fr: 'Francés',
    pt: 'Portugués',
  };
  return m[code || 'es'] ?? code ?? 'Español';
}

export function dispositivoEs(v: string | undefined | null): string | null {
  if (v == null || v === '') return null;
  if (v === 'mobile') return 'Móvil';
  if (v === 'desktop') return 'Ordenador';
  return v;
}

export function tipoRutaEs(esSalud: boolean): string {
  return esSalud ? 'Seguros de salud' : 'Otros servicios';
}

export function statusEs(status: string): string {
  return STATUS_ES[status] ?? status;
}

async function ciudadNombreDesdeSlug(slug: string): Promise<string | null> {
  if (!slug || slug === 'otra') return null;
  try {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('ciudades_catalogo')
      .select('nombre')
      .eq('slug', slug)
      .maybeSingle();
    return data?.nombre ?? null;
  } catch {
    return null;
  }
}

/**
 * Campos legibles en español para el JSON del webhook GHL.
 * Mantiene los slugs originales; añade *_es para mapear en GHL sin flujos de traducción.
 */
export async function buildGhlWebhookSpanishFields(
  lead: Lead,
  extras?: GhlWebhookExtrasInput
): Promise<{
  servicio_es: string;
  presupuesto_es: string | null;
  urgencia_es: string | null;
  idioma_preferido_es: string;
  dispositivo_es: string | null;
  tipo_ruta_es: string;
  status_es: string;
  ciudad_servicio_espana_nombre: string | null;
}> {
  const esSalud = lead.servicio === 'seguros';
  let ciudadNombre = extras?.ciudadServicioNombre?.trim() || null;
  if (!ciudadNombre && lead.ciudad === 'otra') {
    ciudadNombre = requestEs().otherCity;
  }
  if (!ciudadNombre && lead.ciudad) {
    ciudadNombre = await ciudadNombreDesdeSlug(lead.ciudad);
  }
  if (!ciudadNombre && lead.ciudad) {
    ciudadNombre = lead.ciudad;
  }

  return {
    servicio_es: servicioEs(lead.servicio),
    presupuesto_es: presupuestoEs(lead.presupuesto),
    urgencia_es: urgenciaEs(lead.urgencia),
    idioma_preferido_es: idiomaPreferidoEs(lead.idioma_preferido),
    dispositivo_es: dispositivoEs(lead.dispositivo),
    tipo_ruta_es: tipoRutaEs(esSalud),
    status_es: statusEs(lead.status),
    ciudad_servicio_espana_nombre: ciudadNombre,
  };
}
