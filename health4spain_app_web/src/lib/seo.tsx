import type { Locale } from './routes';
import { LOCALES, ROUTES } from './routes';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.health4spain.com';

const OG_LOCALE_MAP: Record<Locale, string> = {
  es: 'es_ES',
  en: 'en_US',
  fr: 'fr_FR',
  de: 'de_DE',
  pt: 'pt_PT',
};

// ── Alternates & Canonical ──────────────────────────────────────────────

export function buildAlternates(locale: Locale, path: string) {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${BASE_URL}/${l}${path}`;
  }
  languages['x-default'] = `${BASE_URL}/es${path}`;
  return {
    canonical: `${BASE_URL}/${locale}${path}`,
    languages,
  };
}

export function buildDynamicAlternates(
  locale: Locale,
  routeKey: string,
  slug: string
) {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    const segment = ROUTES[l][routeKey] || routeKey;
    languages[l] = `${BASE_URL}/${l}/${segment}/${slug}`;
  }
  languages['x-default'] = `${BASE_URL}/es/${ROUTES.es[routeKey] || routeKey}/${slug}`;
  return {
    canonical: `${BASE_URL}/${locale}/${ROUTES[locale][routeKey] || routeKey}/${slug}`,
    languages,
  };
}

// ── Blog portada / cover image resolver ────────────────────────────────
// Mantener sincronizado con el fallback visual usado en las páginas de blog.
export const BLOG_CATEGORY_IMAGES: Record<string, string> = {
  'guias-ciudad': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1200',
  'procedimientos': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200',
  'tramites': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200',
  'salud': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200',
  'finanzas': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200',
  'vida-espana': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
};

/**
 * Devuelve la URL absoluta de la portada (OG image) de un post.
 * Mismo fallback que usa la página del artículo para la imagen de cabecera:
 *   featured_image → imagen por categoría → vida-espana.
 */
export function resolveBlogImage(featuredImage?: string | null, category?: string | null): string {
  const pick =
    (featuredImage && featuredImage.trim()) ||
    (category && BLOG_CATEGORY_IMAGES[category]) ||
    BLOG_CATEGORY_IMAGES['vida-espana'];
  if (/^https?:\/\//i.test(pick)) return pick;
  return `${BASE_URL}${pick.startsWith('/') ? '' : '/'}${pick}`;
}

// ── Open Graph helpers ──────────────────────────────────────────────────

export function buildOpenGraph(locale: Locale, opts: {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  authors?: string[];
}) {
  return {
    title: opts.title,
    description: opts.description,
    url: opts.url,
    siteName: 'Health4Spain',
    locale: OG_LOCALE_MAP[locale],
    alternateLocale: LOCALES.filter(l => l !== locale).map(l => OG_LOCALE_MAP[l]),
    type: opts.type || 'website',
    images: opts.image
      ? [{ url: opts.image, width: 1200, height: 630, alt: opts.title }]
      : [{ url: `${BASE_URL}/images/hero-servicios.webp`, width: 1200, height: 630, alt: 'Health4Spain - Servicios para extranjeros en España' }],
    ...(opts.publishedTime && { publishedTime: opts.publishedTime }),
    ...(opts.authors && { authors: opts.authors }),
  };
}

export function buildTwitter(opts: { title: string; description: string; image?: string }) {
  return {
    card: 'summary_large_image' as const,
    title: opts.title,
    description: opts.description,
    images: opts.image ? [opts.image] : [`${BASE_URL}/images/hero-servicios.webp`],
  };
}

// ── JSON-LD Structured Data ─────────────────────────────────────────────

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Health4Spain',
    url: BASE_URL,
    logo: `${BASE_URL}/images/h4s vertical color_recortado.webp`,
    description: 'Conectamos extranjeros con profesionales verificados en España: abogados, seguros, inmobiliarias y gestorías.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@health4spain.com',
      contactType: 'customer service',
      availableLanguage: ['Spanish', 'English', 'French', 'German', 'Portuguese'],
    },
    sameAs: [
      'https://www.facebook.com/health4spain',
      'https://www.instagram.com/health4spain',
      'https://www.linkedin.com/company/health4spain',
    ],
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Health4Spain',
    url: `${BASE_URL}/${locale}`,
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/${locale}/${ROUTES[locale].request}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

export function blogPostingJsonLd(opts: {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt: string;
  author: string;
  locale: Locale;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    url: opts.url.startsWith('http') ? opts.url : `${BASE_URL}${opts.url}`,
    image: opts.image || `${BASE_URL}/images/hero-servicios.webp`,
    datePublished: opts.publishedAt,
    dateModified: opts.publishedAt,
    author: {
      '@type': 'Organization',
      name: opts.author || 'Health4Spain',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Health4Spain',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/images/h4s vertical color_recortado.webp` },
    },
    inLanguage: opts.locale,
    mainEntityOfPage: { '@type': 'WebPage', '@id': opts.url.startsWith('http') ? opts.url : `${BASE_URL}${opts.url}` },
  };
}

export function faqPageJsonLd(faqs: { question: string; answer: string }[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function serviceJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  locale: Locale;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: opts.url.startsWith('http') ? opts.url : `${BASE_URL}${opts.url}`,
    provider: {
      '@type': 'Organization',
      name: 'Health4Spain',
      url: BASE_URL,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Spain',
    },
    availableLanguage: ['Spanish', 'English', 'French', 'German', 'Portuguese'],
  };
}

// ── Place schema for city destination pages ─────────────────────────────

export function cityPlaceJsonLd(opts: {
  name: string;
  slug: string;
  provincia: string;
  comunidad?: string;
  poblacion?: number;
  porcentajeExtranjeros?: number;
  locale: Locale;
}) {
  const url = `${BASE_URL}/${opts.locale}/${ROUTES[opts.locale].destinations}/${opts.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: opts.name,
    url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: opts.name,
      addressRegion: opts.provincia,
      addressCountry: 'ES',
    },
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: opts.comunidad || opts.provincia,
      containedInPlace: {
        '@type': 'Country',
        name: 'Spain',
      },
    },
    ...(opts.poblacion && {
      additionalProperty: [
        ...(opts.poblacion ? [{
          '@type': 'PropertyValue',
          name: 'Population',
          value: opts.poblacion,
        }] : []),
        ...(opts.porcentajeExtranjeros ? [{
          '@type': 'PropertyValue',
          name: 'Foreign population percentage',
          value: `${opts.porcentajeExtranjeros}%`,
        }] : []),
      ],
    }),
  };
}

// ── Service schema with city-level areaServed ───────────────────────────

export function localServiceJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  locale: Locale;
  cityName?: string;
  provincia?: string;
}) {
  const areaServed = opts.cityName
    ? {
        '@type': 'City' as const,
        name: opts.cityName,
        ...(opts.provincia && {
          containedInPlace: {
            '@type': 'AdministrativeArea' as const,
            name: opts.provincia,
            containedInPlace: { '@type': 'Country' as const, name: 'Spain' },
          },
        }),
      }
    : { '@type': 'Country' as const, name: 'Spain' };

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: opts.url.startsWith('http') ? opts.url : `${BASE_URL}${opts.url}`,
    provider: {
      '@type': 'Organization',
      name: 'Health4Spain',
      url: BASE_URL,
    },
    areaServed,
    availableLanguage: ['Spanish', 'English', 'French', 'German', 'Portuguese'],
  };
}

// ── Helper to render JSON-LD as script tag ──────────────────────────────

export function JsonLd({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
