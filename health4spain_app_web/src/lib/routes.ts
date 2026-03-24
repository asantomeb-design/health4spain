export type Locale = 'es' | 'en' | 'fr' | 'de' | 'pt';

export const LOCALES: Locale[] = ['es', 'en', 'fr', 'de', 'pt'];

export const ROUTES: Record<Locale, Record<string, string>> = {
  es: {
    home: '',
    destinations: 'destinos',
    services: 'servicios',
    about: 'sobre-nosotros',
    contact: 'contacto',
    request: 'solicitar',
    blog: 'blog',
    professionals: 'profesionales',
    quote: 'presupuesto',
    privacy: 'privacidad',
    terms: 'terminos',
    cookies: 'cookies',
    sitemap: 'sitemap-html',
  },
  en: {
    home: '',
    destinations: 'destinations',
    services: 'services',
    about: 'about-us',
    contact: 'contact',
    request: 'request',
    blog: 'blog',
    professionals: 'professionals',
    quote: 'quote',
    privacy: 'privacy',
    terms: 'terms',
    cookies: 'cookies',
    sitemap: 'sitemap',
  },
  fr: {
    home: '',
    destinations: 'destinations',
    services: 'services',
    about: 'a-propos',
    contact: 'contact',
    request: 'demande',
    blog: 'blog',
    professionals: 'professionnels',
    quote: 'devis',
    privacy: 'confidentialite',
    terms: 'conditions',
    cookies: 'cookies',
    sitemap: 'plan-du-site',
  },
  de: {
    home: '',
    destinations: 'reiseziele',
    services: 'dienstleistungen',
    about: 'ueber-uns',
    contact: 'kontakt',
    request: 'anfrage',
    blog: 'blog',
    professionals: 'fachleute',
    quote: 'angebot',
    privacy: 'datenschutz',
    terms: 'agb',
    cookies: 'cookies',
    sitemap: 'seitenplan',
  },
  pt: {
    home: '',
    destinations: 'destinos',
    services: 'servicos',
    about: 'sobre-nos',
    contact: 'contacto',
    request: 'solicitar',
    blog: 'blog',
    professionals: 'profissionais',
    quote: 'orcamento',
    privacy: 'privacidade',
    terms: 'termos',
    cookies: 'cookies',
    sitemap: 'mapa-do-site',
  },
};

/** Build a path like /en/services or /es/servicios */
export function localePath(locale: Locale, routeKey: string, slug?: string): string {
  const segment = ROUTES[locale]?.[routeKey] ?? routeKey;
  const base = segment ? `/${locale}/${segment}` : `/${locale}`;
  return slug ? `${base}/${slug}` : base;
}

/** Given a full pathname and source locale, produce the equivalent path in target locale */
export function switchLocalePath(pathname: string, fromLocale: Locale, toLocale: Locale): string {
  const fromRoutes = ROUTES[fromLocale];
  const toRoutes = ROUTES[toLocale];

  let rest = pathname.replace(`/${fromLocale}`, '') || '/';
  if (rest.startsWith('/')) rest = rest.slice(1);

  const segments = rest.split('/');
  const firstSegment = segments[0] || '';

  const routeKey = Object.entries(fromRoutes).find(([, v]) => v === firstSegment)?.[0];
  if (routeKey && toRoutes[routeKey] !== undefined) {
    segments[0] = toRoutes[routeKey];
  }

  const newPath = segments.filter(Boolean).join('/');
  return newPath ? `/${toLocale}/${newPath}` : `/${toLocale}`;
}

/** Lang column name differs between tables */
export function langColumnValue(locale: Locale): string {
  return locale;
}
