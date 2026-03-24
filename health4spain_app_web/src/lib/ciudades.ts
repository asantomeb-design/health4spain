import { supabase } from './supabase';
import type { Locale } from './routes';

export interface Ciudad {
  slug: string;
  nombre: string;
  provincia: string;
  comunidad: string;
  poblacion?: number;
  porcentaje_extranjeros?: number;
  destacada?: boolean;
  datos_extra?: any;
}

export async function getCiudades(): Promise<Ciudad[]> {
  try {
    const { data, error } = await supabase
      .from('ciudades_catalogo')
      .select('slug, nombre, provincia, comunidad, poblacion, porcentaje_extranjeros, destacada, datos_extra')
      .order('nombre');

    if (error) {
      console.error('Error fetching ciudades:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching ciudades:', error);
    return [];
  }
}

export async function getCiudadBySlug(slug: string): Promise<Ciudad | null> {
  try {
    const { data, error } = await supabase
      .from('ciudades_catalogo')
      .select('slug, nombre, provincia, comunidad, poblacion, porcentaje_extranjeros, destacada, datos_extra')
      .eq('slug', slug)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getCiudadesDestacadas(): Promise<Ciudad[]> {
  try {
    const { data, error } = await supabase
      .from('ciudades_catalogo')
      .select('slug, nombre, provincia, comunidad, poblacion, porcentaje_extranjeros, destacada, datos_extra')
      .eq('destacada', true)
      .order('nombre');

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function getCiudadTraducida(slug: string, locale: Locale = 'es') {
  try {
    const { data, error } = await supabase.rpc('get_ciudad_traducida', {
      p_slug: slug,
      p_idioma: locale,
    });

    if (error || !data || data.length === 0) return null;
    return data[0];
  } catch {
    return null;
  }
}
