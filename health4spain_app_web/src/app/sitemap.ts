import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { LOCALES, ROUTES, type Locale } from '@/lib/routes';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.health4spain.com';

const STATIC_ROUTE_KEYS = [
  'home', 'services', 'destinations', 'blog', 'contact',
  'about', 'privacy', 'cookies', 'terms', 'professionals',
  'quote', 'sitemap', 'request',
];

function buildLocaleStaticPages(locale: Locale): string[] {
  const routes = ROUTES[locale];
  return STATIC_ROUTE_KEYS.map((key) => {
    const segment = routes[key] ?? key;
    return segment ? `/${locale}/${segment}` : `/${locale}`;
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let landingsByLocale: Record<string, { slug: string; updated_at?: string }[]> = {};
  let postsByLocale: Record<string, { slug: string; updated_at?: string }[]> = {};
  let ciudades: { slug: string }[] = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const results = await Promise.all([
      ...LOCALES.map((l) =>
        supabase.from('landing_pages').select('slug, updated_at, idioma').eq('activo', true).eq('idioma', l)
      ),
      ...LOCALES.map((l) =>
        supabase.from('blog_posts').select('slug, updated_at, lang').eq('status', 'published').eq('lang', l)
      ),
      supabase.from('ciudades_catalogo').select('slug'),
    ]);

    const localeCount = LOCALES.length;
    LOCALES.forEach((l, i) => {
      landingsByLocale[l] = results[i].data || [];
      postsByLocale[l] = results[localeCount + i].data || [];
    });
    ciudades = results[localeCount * 2].data || [];
  }

  const now = new Date().toISOString();
  const entries: MetadataRoute.Sitemap = [];

  entries.push({ url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 });

  for (const locale of LOCALES) {
    const routes = ROUTES[locale];
    const landings = landingsByLocale[locale] || [];
    const posts = postsByLocale[locale] || [];

    const staticPages = buildLocaleStaticPages(locale);
    for (const path of staticPages) {
      entries.push({
        url: `${BASE_URL}${path}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: path === `/${locale}` ? 0.9 : 0.7,
      });
    }

    for (const landing of landings) {
      entries.push({
        url: `${BASE_URL}/${locale}/${routes.destinations}/${landing.slug}`,
        lastModified: landing.updated_at || now,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
      entries.push({
        url: `${BASE_URL}/${locale}/${routes.services}/${landing.slug}`,
        lastModified: landing.updated_at || now,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }

    for (const ciudad of ciudades) {
      const alreadyHasLanding = landings.some((l) => l.slug === ciudad.slug);
      if (!alreadyHasLanding) {
        entries.push({
          url: `${BASE_URL}/${locale}/${routes.destinations}/${ciudad.slug}`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }

    for (const post of posts) {
      entries.push({
        url: `${BASE_URL}/${locale}/${routes.blog || 'blog'}/${post.slug}`,
        lastModified: post.updated_at || now,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
