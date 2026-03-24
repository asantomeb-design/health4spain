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
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt, category, published_at, featured_image, views')
      .eq('status', 'published')
      .eq('lang', locale)
      .order('published_at', { ascending: false });

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function getPopularBlogPosts(locale: Locale, limit = 5) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt, category, published_at, views, featured_image')
      .eq('status', 'published')
      .eq('lang', locale)
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
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .eq('lang', locale)
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
    const { data, error } = await supabase
      .from('blog_posts')
      .select('title, excerpt, category, published_at, featured_image')
      .eq('slug', slug)
      .eq('status', 'published')
      .eq('lang', locale)
      .single();
    return error || !data ? null : data;
  } catch {
    return null;
  }
}

export async function getRelatedBlogPosts(category: string, currentSlug: string, locale: Locale, limit = 2) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, title, category, featured_image')
      .eq('status', 'published')
      .eq('lang', locale)
      .eq('category', category)
      .neq('slug', currentSlug)
      .limit(limit);

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function getBlogSlugs(locale: Locale) {
  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('status', 'published')
      .eq('lang', locale);
    return data?.map(p => p.slug) || [];
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
