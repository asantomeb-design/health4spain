import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getCiudades } from '@/lib/ciudades';
import { HERO_IMAGES } from '@/lib/constants';
import Breadcrumbs from '@/components/Breadcrumbs';
import DestinosDropdown from '@/components/DestinosDropdown';
import { getDictionary } from '@/lib/dictionaries';
import { ROUTES, type Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const LOCALE: Locale = 'es';
const t = getDictionary(LOCALE);
const r = ROUTES[LOCALE];

const PROVINCIA_LABELS: Record<string, (t: ReturnType<typeof getDictionary>) => string> = {
  Murcia: (t) => t.home.regionMurcia,
  Alicante: (t) => t.home.provinceAlicante,
};

export const metadata: Metadata = {
  title: t.destinations.metaTitle,
  description: t.destinations.metaDesc,
  alternates: buildAlternates(LOCALE, '/destinos'),
};

export default async function DestinosPage() {
  const ciudades = await getCiudades();

  // Agrupar por región/provincia: Región de Murcia y Provincia de Alicante
  const porRegion = ciudades.reduce<Record<string, { nombre: string; slug: string; porcentaje_extranjeros?: number }[]>>(
    (acc, c) => {
      const prov = c.provincia || 'Otras';
      const label = PROVINCIA_LABELS[prov]?.(t) ?? prov;
      if (!acc[label]) acc[label] = [];
      acc[label].push({ nombre: c.nombre, slug: c.slug, porcentaje_extranjeros: c.porcentaje_extranjeros });
      return acc;
    },
    {}
  );

  const ordenLabels = [t.home.regionMurcia, t.home.provinceAlicante];
  const regiones = ordenLabels
    .filter((label) => porRegion[label]?.length)
    .map((label) => ({ label, ciudades: porRegion[label] }))
    .concat(
      Object.entries(porRegion)
        .filter(([label]) => !ordenLabels.includes(label))
        .map(([label, ciudades]) => ({ label, ciudades }))
    );

  return (
    <>
      {/* Hero - Image optimizada para LCP y WebP */}
      <section className="hero-with-image hero-compact">
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_IMAGES.destinos}
            alt="Destinos en España para extranjeros"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="hero-content-box">
          <h1 className="mb-4" style={{ lineHeight: '0.95' }}>
            {t.destinations.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl">
            {ciudades.length} ciudades españolas. Profesionales verificados en cada una.
            Elige tu destino ideal.
          </p>
          <div className="flex gap-6 md:gap-8 mb-6 pt-4 border-t border-gray-300">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-1">{ciudades.length}</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">{t.destinations.cityCount}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-1">150+</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">{t.destinations.professionals}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-1">4</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">{t.destinations.servicesCount}</div>
            </div>
          </div>
          <Link href={`/${LOCALE}/${r.request}`} className="btn-minimal-lg">
            {t.home.requestInfo}
          </Link>
        </div>
      </section>

      {/* Desplegable de Destinos por Región/Provincia */}
      <section className="section-alt">
        <div className="container-narrow space-y-8">
          <Breadcrumbs items={[
            { label: t.common.breadcrumbHome, href: `/${LOCALE}` },
            { label: t.destinations.title }
          ]} />
          <div className="space-y-6">
            <DestinosDropdown
              regiones={regiones}
              requestUrl={`/${LOCALE}/${r.request}`}
              selectPlaceholder={t.destinations.selectPlaceholder}
              foreignPopLabel={t.destinations.foreignPop}
            />
            <div className="text-center">
              <p className="text-gray-600 mb-4 text-sm">{t.destinations.cantFindCity}</p>
              <Link href={`/${LOCALE}/${r.request}`} className="btn-minimal">
                {t.home.requestInfo} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section text-center">
        <div className="container-narrow">
          <h2 className="mb-4">{t.about.readyCta}</h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t.landingUI.dontDoAlone}
          </p>
          <Link href={`/${LOCALE}/${r.request}`} className="btn-minimal-lg">
            {t.home.requestInfoNow}
          </Link>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs md:text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t.landingUI.verifiedProf}
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t.landingUI.inYourLang}
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t.landingUI.noCommitment}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
