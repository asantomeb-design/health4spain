import { supabase } from './supabase';
import type { Locale } from './routes';

/** Orden de servicios: Seguros de Salud destacado primero */
const SERVICIOS_ORDER = ['seguros', 'abogados', 'inmobiliarias', 'gestorias'];

function ordenarServicios(servicios: Servicio[]): Servicio[] {
  return [...servicios].sort((a, b) => {
    const ia = SERVICIOS_ORDER.indexOf(a.slug);
    const ib = SERVICIOS_ORDER.indexOf(b.slug);
    if (ia === -1 && ib === -1) return 0;
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

export interface Servicio {
  slug: string;
  nombre: string;
  nombre_plural?: string;
  icon?: string;
  descripcion_corta?: string;
  keywords?: string[];
}

export async function getServicios(locale: Locale = 'es'): Promise<Servicio[]> {
  try {
    const { data, error } = await supabase.rpc('get_servicios_traducidos', {
      p_idioma: locale,
    });

    if (error) {
      console.error('Error fetching servicios traducidos:', error);
      const { data: fallback } = await supabase
        .from('servicios_catalogo')
        .select('slug, nombre, nombre_plural, icon, descripcion_corta, keywords')
        .order('slug');
      return ordenarServicios(fallback || []);
    }

    return ordenarServicios(data || []);
  } catch (error) {
    console.error('Error fetching servicios:', error);
    return [];
  }
}

export async function getServicioBySlug(slug: string, locale: Locale = 'es'): Promise<Servicio | null> {
  try {
    const { data, error } = await supabase.rpc('get_servicio_traducido', {
      p_slug: slug,
      p_idioma: locale,
    });

    if (error || !data || data.length === 0) {
      const { data: fallback } = await supabase
        .from('servicios_catalogo')
        .select('slug, nombre, nombre_plural, icon, descripcion_corta, keywords')
        .eq('slug', slug)
        .single();
      return fallback || null;
    }

    return data[0];
  } catch (error) {
    console.error('Error fetching servicio:', error);
    return null;
  }
}
