import Link from 'next/link';
import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import { ROUTES, type Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';
import { getBlogPosts, getLandingPagesForSitemap } from '@/lib/data';
import { getServicios } from '@/lib/services';
import { getCiudades } from '@/lib/ciudades';

const LOCALE: Locale = 'es';
const t = getDictionary(LOCALE);
const routes = ROUTES[LOCALE];

export const metadata: Metadata = {
  title: t.sitemap.metaTitle,
  description: t.sitemap.metaDesc,
  alternates: buildAlternates(LOCALE, '/sitemap-html'),
  robots: {
    index: true,
    follow: true,
  },
};

const staticRoutes = [
  { key: 'home', desc: 'Página principal' },
  { key: 'destinations', desc: 'Guía de destinos en España' },
  { key: 'services', desc: 'Servicios para extranjeros' },
  { key: 'blog', desc: 'Artículos y guías' },
  { key: 'professionals', desc: 'Directorio de profesionales' },
  { key: 'about', desc: 'Quiénes somos' },
  { key: 'contact', desc: 'Formulario de contacto' },
  { key: 'quote', desc: 'Solicitar presupuesto' },
  { key: 'privacy', desc: 'Protección de datos' },
  { key: 'terms', desc: 'Términos de uso' },
  { key: 'cookies', desc: 'Uso de cookies' },
];

export default async function SitemapHtmlPage() {
  const [blogPosts, servicios, ciudades, landingPages] = await Promise.all([
    getBlogPosts(LOCALE),
    getServicios(LOCALE),
    getCiudades(),
    getLandingPagesForSitemap(LOCALE),
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.health4spain.com';
  const localePrefix = `/${LOCALE}`;

  const rutasEstaticas = staticRoutes.map((r) => {
    const segment = routes[r.key as keyof typeof routes] ?? r.key;
    const url = segment ? `${localePrefix}/${segment}` : localePrefix;
    const titulo = r.key === 'home' ? 'Inicio' : r.key === 'destinations' ? 'Destinos' : r.key === 'services' ? 'Servicios' : r.key === 'blog' ? 'Blog' : r.key === 'professionals' ? 'Profesionales' : r.key === 'about' ? 'Sobre Nosotros' : r.key === 'contact' ? 'Contacto' : r.key === 'quote' ? 'Presupuesto' : r.key === 'privacy' ? 'Política de Privacidad' : r.key === 'terms' ? 'Términos y Condiciones' : r.key === 'cookies' ? 'Política de Cookies' : r.key;
    return { url, titulo, descripcion: r.desc };
  });

  // Obtener todos los destinos desde BD
  const allDestinos = ciudades.map((ciudad) => ({
    url: `${localePrefix}/${routes.destinations}/${ciudad.slug}`,
    titulo: ciudad.nombre,
    provincia: ciudad.provincia,
  }));

  // Obtener todos los servicios desde BD
  const allServicios = servicios.map((servicio) => ({
    url: `${localePrefix}/${routes.services}/${servicio.slug}`,
    titulo: servicio.nombre_plural || servicio.nombre,
  }));

  // Obtener landing pages (servicio×ciudad)
  const allLandingPages = landingPages.map((landing: { slug: string; servicio_nombre: string; ciudad_nombre: string }) => ({
    url: `${localePrefix}/${routes.services}/${landing.slug}`,
    titulo: `${landing.servicio_nombre} en ${landing.ciudad_nombre}`,
    servicio: landing.servicio_nombre,
    ciudad: landing.ciudad_nombre,
  }));

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-secondary text-white py-12 md:py-16">
        <div className="container-base">
          <div className="max-w-3xl">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">
              {t.sitemap.title}
            </h1>
            <p className="text-lg text-white/90">
              Navega por todas las páginas disponibles en Health4Spain.
              Encuentra destinos, servicios, artículos del blog y más.
            </p>
          </div>
        </div>
      </section>

      {/* Contenido del Sitemap */}
      <section className="py-10 md:py-14">
        <div className="container-base">
          <div className="max-w-4xl mx-auto space-y-12">

            {/* Páginas Principales */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Páginas Principales
              </h2>
              <ul className="space-y-2">
                {rutasEstaticas.map((ruta) => (
                  <li key={ruta.url} className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <div className="flex-1">
                      <Link
                        href={ruta.url}
                        className="text-primary hover:text-primary-dark font-medium hover:underline"
                      >
                        {ruta.titulo}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">{ruta.descripcion}</p>
                      <code className="text-xs text-gray-400 block mt-1">{baseUrl}{ruta.url}</code>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Destinos */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Destinos ({allDestinos.length} ciudades)
              </h2>
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {allDestinos.map((destino) => (
                  <li key={destino.url}>
                    <Link
                      href={destino.url}
                      className="text-primary hover:text-primary-dark hover:underline text-sm"
                    >
                      {destino.titulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Servicios */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Servicios ({allServicios.length} servicios)
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allServicios.map((servicio) => (
                  <li key={servicio.url} className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <Link
                      href={servicio.url}
                      className="text-primary hover:text-primary-dark hover:underline"
                    >
                      {servicio.titulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Landing Pages (servicio×ciudad) */}
            {allLandingPages.length > 0 && (
              <div>
                <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Páginas Servicio × Ciudad ({allLandingPages.length} páginas)
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Páginas especializadas por servicio y ubicación
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {allLandingPages.map((landing: { url: string; titulo: string }) => (
                    <li key={landing.url} className="flex items-start gap-2">
                      <span className="text-primary mt-1 text-xs">•</span>
                      <Link
                        href={landing.url}
                        className="text-primary hover:text-primary-dark hover:underline text-sm"
                      >
                        {landing.titulo}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Blog Posts */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Artículos del Blog ({blogPosts.length} artículos)
              </h2>
              {blogPosts.length > 0 ? (
                <ul className="space-y-3">
                  {blogPosts.map((post: { slug: string; title: string; excerpt?: string; published_at?: string }) => (
                    <li key={post.slug} className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <div className="flex-1">
                        <Link
                          href={`/${LOCALE}/blog/${post.slug}`}
                          className="text-primary hover:text-primary-dark font-medium hover:underline block"
                        >
                          {post.title}
                        </Link>
                        {post.excerpt && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        {post.published_at && (
                          <time className="text-xs text-gray-400 block mt-1">
                            {new Date(post.published_at).toLocaleDateString('es-ES', {
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
                <p className="text-gray-600 text-sm">
                  No hay artículos publicados aún.
                </p>
              )}
            </div>

            {/* Información adicional */}
            <div className="bg-gray-50 rounded-lg p-6 mt-8">
              <h3 className="font-semibold text-gray-900 mb-2">
                Información del Sitemap
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Total de páginas: {rutasEstaticas.length + allDestinos.length + allServicios.length + allLandingPages.length + blogPosts.length}</li>
                <li>• Última actualización: {new Date().toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</li>
                <li>• Los artículos del blog se actualizan automáticamente</li>
              </ul>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
