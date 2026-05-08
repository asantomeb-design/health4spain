import { createServerSupabaseClient, supabase } from './supabase';
import { LandingPage } from './types';
import type { Locale } from './routes';

// ── Landing Pages ────────────────────────────────────────────────────────

export async function getLandingBySlug(slug: string, locale: Locale): Promise<LandingPage | null> {
  try {
    const sb = createServerSupabaseClient();
    const { data, error } = await sb
      .from('landing_pages')
      .select('*')
      .eq('slug', slug)
      .eq('activo', true)
      .eq('idioma', locale)
      .single();

    if (error || !data) return null;
    return data as LandingPage;
  } catch {
    return null;
  }
}

export async function getActiveLandingSlugs(locale: Locale) {
  const sb = createServerSupabaseClient();
  const { data } = await sb
    .from('landing_pages')
    .select('slug')
    .eq('activo', true)
    .eq('idioma', locale);
  return (data || []).map(l => l.slug).filter((s): s is string => !!s);
}

// ── Ciudad Contenido ─────────────────────────────────────────────────────

export async function getCiudadContenido(ciudadSlug: string, locale: Locale = 'es') {
  try {
    const sb = createServerSupabaseClient();
    const { data, error } = await sb
      .from('ciudades_contenido')
      .select('*')
      .eq('ciudad_slug', ciudadSlug)
      .eq('activo', true)
      .eq('idioma', locale)
      .single();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

// ── Ciudad Catalogo (sin idioma, datos base) ─────────────────────────────

export async function getCiudadCatalogo(ciudadSlug: string) {
  try {
    const sb = createServerSupabaseClient();
    const { data, error } = await sb
      .from('ciudades_catalogo')
      .select('*')
      .eq('slug', ciudadSlug)
      .single();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

// ── Blog Posts ────────────────────────────────────────────────────────────

export async function getBlogPosts(locale: Locale) {
  try {
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt, category, published_at, featured_image, views')
      .eq('status', 'published')
      .eq('lang', locale)
      .lte('published_at', nowIso)
      .order('published_at', { ascending: false });

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function getPopularBlogPosts(locale: Locale, limit = 5) {
  try {
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt, category, published_at, views, featured_image')
      .eq('status', 'published')
      .eq('lang', locale)
      .lte('published_at', nowIso)
      .order('views', { ascending: false })
      .limit(limit);

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function getBlogPost(slug: string, locale: Locale) {
  try {
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .eq('lang', locale)
      .lte('published_at', nowIso)
      .single();

    if (error || !data) return null;

    await supabase
      .from('blog_posts')
      .update({ views: (data.views || 0) + 1 })
      .eq('slug', slug)
      .eq('lang', locale);

    return data;
  } catch {
    return null;
  }
}

export async function getBlogPostMeta(slug: string, locale: Locale) {
  try {
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('title, excerpt, category, published_at, featured_image')
      .eq('slug', slug)
      .eq('status', 'published')
      .eq('lang', locale)
      .lte('published_at', nowIso)
      .single();
    return error || !data ? null : data;
  } catch {
    return null;
  }
}

export async function getRelatedBlogPosts(category: string, currentSlug: string, locale: Locale, limit = 2) {
  try {
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, title, category, featured_image')
      .eq('status', 'published')
      .eq('lang', locale)
      .eq('category', category)
      .neq('slug', currentSlug)
      .lte('published_at', nowIso)
      .limit(limit);

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function getBlogSlugs(locale: Locale) {
  try {
    const nowIso = new Date().toISOString();
    const { data } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('status', 'published')
      .eq('lang', locale)
      .lte('published_at', nowIso);
    return data?.map(p => p.slug) || [];
  } catch {
    return [];
  }
}

// ── Translation groups ───────────────────────────────────────────────────
//
// Un grupo de traducción agrupa el mismo artículo en distintos idiomas con
// un UUID común (`translation_group_id`). Estas funciones permiten resolver
// "dame el slug del hermano de este post en idioma X" sin asumir que los
// slugs son iguales en todos los idiomas.

/**
 * Devuelve un mapa { lang → slug } con todos los hermanos publicados del
 * artículo identificado por (slug, locale). Solo posts en estado published
 * con published_at <= ahora.
 */
export async function getBlogTranslations(
  slug: string,
  locale: Locale
): Promise<Partial<Record<Locale, string>>> {
  try {
    const nowIso = new Date().toISOString();
    const { data: source, error: sourceError } = await supabase
      .from('blog_posts')
      .select('translation_group_id')
      .eq('slug', slug)
      .eq('lang', locale)
      .eq('status', 'published')
      .lte('published_at', nowIso)
      .single();

    if (sourceError || !source?.translation_group_id) {
      // Sin grupo, el único "hermano" es el propio artículo en su idioma
      return { [locale]: slug };
    }

    const { data: siblings, error } = await supabase
      .from('blog_posts')
      .select('lang, slug')
      .eq('translation_group_id', source.translation_group_id)
      .eq('status', 'published')
      .lte('published_at', nowIso);

    if (error || !siblings) return { [locale]: slug };

    const map: Partial<Record<Locale, string>> = {};
    for (const s of siblings) {
      if (s?.lang && s?.slug) {
        map[s.lang as Locale] = s.slug as string;
      }
    }
    if (!map[locale]) map[locale] = slug;
    return map;
  } catch {
    return { [locale]: slug };
  }
}

/**
 * Versión que también devuelve borradores y archivados (para uso del admin).
 * No se debe exponer públicamente.
 */
export async function getBlogTranslationsAllStatuses(
  slug: string,
  locale: Locale
): Promise<Array<{ lang: Locale; slug: string; status: string }>> {
  try {
    const sb = createServerSupabaseClient();
    const { data: source, error: sourceError } = await sb
      .from('blog_posts')
      .select('translation_group_id')
      .eq('slug', slug)
      .eq('lang', locale)
      .single();

    if (sourceError || !source?.translation_group_id) return [];

    const { data, error } = await sb
      .from('blog_posts')
      .select('lang, slug, status')
      .eq('translation_group_id', source.translation_group_id);

    if (error || !data) return [];
    return data as Array<{ lang: Locale; slug: string; status: string }>;
  } catch {
    return [];
  }
}

// ── Landing Pages for sitemap ────────────────────────────────────────────

export async function getLandingPagesForSitemap(locale: Locale) {
  try {
    const { data, error } = await supabase
      .from('landing_pages')
      .select('slug, servicio_nombre, ciudad_nombre, meta_title')
      .eq('activo', true)
      .eq('idioma', locale)
      .order('servicio_slug')
      .order('ciudad_slug');
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}
