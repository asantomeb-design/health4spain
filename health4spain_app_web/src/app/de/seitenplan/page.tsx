import Link from 'next/link';
import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { ROUTES } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';
import { getBlogPosts, getLandingPagesForSitemap } from '@/lib/data';
import { getServicios } from '@/lib/services';
import { getCiudades } from '@/lib/ciudades';

const locale: Locale = 'de';
const t = getDictionary(locale);
const routes = ROUTES[locale];

export const metadata: Metadata = {
  title: t.sitemap.metaTitle,
  description: t.sitemap.metaDesc,
  alternates: buildAlternates(locale, '/seitenplan'),
  robots: { index: true, follow: true },
};

const staticRoutes = [
  { key: 'home', desc: 'Startseite' },
  { key: 'destinations', desc: 'Reiseziele-Guide' },
  { key: 'services', desc: 'Dienstleistungen für Ausländer' },
  { key: 'blog', desc: 'Artikel und Leitfäden' },
  { key: 'professionals', desc: 'Fachleute-Verzeichnis' },
  { key: 'about', desc: 'Über uns' },
  { key: 'contact', desc: 'Kontaktformular' },
  { key: 'quote', desc: 'Angebot anfordern' },
  { key: 'privacy', desc: 'Datenschutz' },
  { key: 'terms', desc: 'Nutzungsbedingungen' },
  { key: 'cookies', desc: 'Cookie-Nutzung' },
];

export default async function SeitenplanPage() {
  const [blogPosts, servicios, ciudades, landingPages] = await Promise.all([
    getBlogPosts(locale),
    getServicios(locale),
    getCiudades(),
    getLandingPagesForSitemap(locale),
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.health4spain.com';
  const localePrefix = `/${locale}`;

  const rutasEstaticas = staticRoutes.map((r) => {
    const segment = routes[r.key as keyof typeof routes] ?? r.key;
    const url = segment ? `${localePrefix}/${segment}` : localePrefix;
    const titulo = r.key.charAt(0).toUpperCase() + r.key.slice(1);
    return { url, titulo, descripcion: r.desc };
  });

  const allDestinos = ciudades.map((ciudad) => ({
    url: `${localePrefix}/${routes.destinations}/${ciudad.slug}`,
    titulo: ciudad.nombre,
  }));

  const allServicios = servicios.map((servicio) => ({
    url: `${localePrefix}/${routes.services}/${servicio.slug}`,
    titulo: servicio.nombre_plural || servicio.nombre,
  }));

  const allLandingPages = landingPages.map((landing: { slug: string; servicio_nombre: string; ciudad_nombre: string }) => ({
    url: `${localePrefix}/${routes.services}/${landing.slug}`,
    titulo: `${landing.servicio_nombre} in ${landing.ciudad_nombre}`,
  }));

  return (
    <>
      <section className="bg-gradient-secondary text-white py-12 md:py-16">
        <div className="container-base">
          <div className="max-w-3xl">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">{t.sitemap.title}</h1>
            <p className="text-lg text-white/90">
              Durchsuchen Sie alle verfügbaren Seiten auf Health4Spain. Finden Sie Reiseziele, Dienstleistungen, Blog-Artikel und mehr.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container-base">
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Hauptseiten
              </h2>
              <ul className="space-y-2">
                {rutasEstaticas.map((ruta) => (
                  <li key={ruta.url} className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <div className="flex-1">
                      <Link href={ruta.url} className="text-primary hover:text-primary-dark font-medium hover:underline">
                        {ruta.titulo}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">{ruta.descripcion}</p>
                      <code className="text-xs text-gray-400 block mt-1">{baseUrl}{ruta.url}</code>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Reiseziele ({allDestinos.length} Städte)
              </h2>
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {allDestinos.map((destino) => (
                  <li key={destino.url}>
                    <Link href={destino.url} className="text-primary hover:text-primary-dark hover:underline text-sm">
                      {destino.titulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Dienstleistungen ({allServicios.length} Dienste)
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allServicios.map((servicio) => (
                  <li key={servicio.url} className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <Link href={servicio.url} className="text-primary hover:text-primary-dark hover:underline">
                      {servicio.titulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {allLandingPages.length > 0 && (
              <div>
                <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Service × Stadt Seiten ({allLandingPages.length} Seiten)
                </h2>
                <p className="text-sm text-gray-600 mb-4">Spezialisierte Seiten nach Service und Standort</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {allLandingPages.map((landing: { url: string; titulo: string }) => (
                    <li key={landing.url} className="flex items-start gap-2">
                      <span className="text-primary mt-1 text-xs">•</span>
                      <Link href={landing.url} className="text-primary hover:text-primary-dark hover:underline text-sm">
                        {landing.titulo}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Blog-Artikel ({blogPosts.length} Artikel)
              </h2>
              {blogPosts.length > 0 ? (
                <ul className="space-y-3">
                  {blogPosts.map((post: { slug: string; title: string; excerpt?: string; published_at?: string }) => (
                    <li key={post.slug} className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <div className="flex-1">
                        <Link
                          href={`/${locale}/blog/${post.slug}`}
                          className="text-primary hover:text-primary-dark font-medium hover:underline block"
                        >
                          {post.title}
                        </Link>
                        {post.excerpt && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>}
                        {post.published_at && (
                          <time className="text-xs text-gray-400 block mt-1">
                            {new Date(post.published_at).toLocaleDateString('de-DE', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </time>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-sm">Noch keine Artikel veröffentlicht.</p>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mt-8">
              <h3 className="font-semibold text-gray-900 mb-2">Seitenplan-Informationen</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Gesamtseiten: {rutasEstaticas.length + allDestinos.length + allServicios.length + allLandingPages.length + blogPosts.length}</li>
                <li>• Letzte Aktualisierung: {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</li>
                <li>• Blog-Artikel werden automatisch aktualisiert</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
