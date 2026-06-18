/**
 * Etiquetas en español para payloads hacia GoHighLevel (webhook),
 * alineadas con el formulario ES (`getDictionary('es').request`).
 */

import { getDictionary } from '@/lib/dictionaries';
import { createServerSupabaseClient } from '@/lib/supabase';
import type { Lead } from '@/lib/types';

/** Misma forma que `GHLWebhookExtras` en gohighlevel (evita import circular). */
export type GhlWebhookExtrasInput = { ciudadServicioNombre?: string };

/** Payload de etiquetas ES para webhook GHL y custom fields API (mismo origen que `request` ES). */
export interface GhlWebhookSpanishFields {
  servicio_es: string;
  /** Lista de slugs cuando el lead tiene varios servicios. */
  servicios: string[];
  presupuesto_es: string;
  urgencia_es: string;
  idioma_preferido_es: string;
  dispositivo_es: string | null;
  tipo_ruta_es: string;
  status_es: string;
  ciudad_servicio_espana_nombre: string | null;
  /** País tal como en formularios (lista `PAISES` ya en español). */
  pais_origen_es: string | null;
  /** Fecha legible para workflows GHL (p. ej. merge en emails). */
  fecha_nacimiento_legible_es: string | null;
}

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

export function servicioEs(slug: string | undefined | null): string {
  const id = (slug ?? '').trim();
  if (!id) return 'No indicado';
  if (id === 'otro') return 'Otro servicio';
  const s = requestEs().servicios as Record<string, string>;
  return s[id] ?? id;
}

/** Extrae slugs desde un campo `servicio` (uno o varios separados por coma). */
export function parseServiciosSlug(value: string | undefined | null): string[] {
  const s = (value ?? '').trim();
  if (!s) return [];
  return s.split(',').map((x) => x.trim()).filter(Boolean);
}

/** Etiquetas en español para varios servicios (p. ej. emails GHL). */
export function serviciosEs(slugs: string[]): string {
  if (!slugs.length) return 'No indicado';
  return slugs.map((slug) => servicioEs(slug)).join(', ');
}

/** Une slugs existentes con nuevos sin duplicar. */
export function mergeServicioSlugs(existing: string | undefined | null, incoming: string[]): string {
  const set = new Set([...parseServiciosSlug(existing), ...incoming.map((s) => s.trim()).filter(Boolean)]);
  return Array.from(set).join(',');
}

/** Normaliza un valor de formulario que puede venir como string u objeto { id, nombre, label, value }. */
export function normalizeLeadField(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value).trim();
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const candidate = obj.nombre ?? obj.label ?? obj.value ?? obj.id ?? obj.slug;
    if (candidate != null) return String(candidate).trim();
  }
  return '';
}

export function presupuestoEs(key: string | undefined | null): string | null {
  const k = (key ?? '').trim();
  if (!k) return null;
  const p = requestEs().presupuestos as Record<string, string>;
  return p[k] ?? null;
}

/** Siempre texto en español para GHL (nunca null por urgencia vacía). */
export function urgenciaEs(key: string | undefined | null): string {
  const k = (key ?? '').trim();
  if (k === '' || k === 'no_especificado') return 'No especificado';
  const u = requestEs().urgencias as Record<string, string>;
  if (u[k]) return u[k];
  if (URGENCIA_LEGACY_ES[k]) return URGENCIA_LEGACY_ES[k];
  return k;
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

function fechaNacimientoLegibleEs(iso: string | undefined | null): string | null {
  const s = (iso ?? '').trim();
  if (!s) return null;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
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
): Promise<GhlWebhookSpanishFields> {
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

  const presupuestoRaw = (lead.presupuesto ?? '').trim();
  const servicioSlugs = parseServiciosSlug(lead.servicio);
  const servicioLista = servicioSlugs.length ? servicioSlugs : (lead.servicio ? [lead.servicio] : []);

  return {
    servicio_es: serviciosEs(servicioLista),
    servicios: servicioLista,
    presupuesto_es: presupuestoRaw
      ? presupuestoEs(presupuestoRaw) ?? presupuestoRaw
      : 'No especificado',
    urgencia_es: urgenciaEs(lead.urgencia),
    idioma_preferido_es: idiomaPreferidoEs(lead.idioma_preferido),
    dispositivo_es: dispositivoEs(lead.dispositivo),
    tipo_ruta_es: tipoRutaEs(esSalud),
    status_es: statusEs(lead.status),
    ciudad_servicio_espana_nombre: ciudadNombre,
    pais_origen_es: lead.pais_origen?.trim() || null,
    fecha_nacimiento_legible_es: fechaNacimientoLegibleEs(lead.fecha_nacimiento),
  };
}
