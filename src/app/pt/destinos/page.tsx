import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getCiudades } from '@/lib/ciudades';
import { HERO_IMAGES } from '@/lib/constants';
import Breadcrumbs from '@/components/Breadcrumbs';
import DestinosDropdown from '@/components/DestinosDropdown';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'pt';
const t = getDictionary(locale);

const PROVINCIA_LABELS: Record<string, (t: ReturnType<typeof getDictionary>) => string> = {
  Murcia: (t) => t.home.regionMurcia,
  Alicante: (t) => t.home.provinceAlicante,
};

export const metadata: Metadata = {
  title: t.destinations.metaTitle,
  description: t.destinations.metaDesc,
  alternates: buildAlternates(locale, '/destinos'),
};

export default async function DestinationsPage() {
  const ciudades = await getCiudades();
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
      <section className="hero-with-image hero-compact">
        <div className="absolute inset-0 z-0"><Image src={HERO_IMAGES.destinos} alt="Destinos em Espanha para estrangeiros" fill priority fetchPriority="high" sizes="100vw" className="object-cover object-center" /></div>
        <div className="hero-content-box">
          <h1 className="mb-4" style={{ lineHeight: '0.95' }}>{t.destinations.title}</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl">{ciudades.length} cities</p>
          <Link href="/pt/solicitar" className="btn-minimal-lg">{t.home.requestInfo}</Link>
        </div>
      </section>

      <section className="section-alt">
        <div className="container-narrow">
          <Breadcrumbs items={[{ label: t.common.breadcrumbHome, href: '/pt' }, { label: t.destinations.title }]} />
          <DestinosDropdown
            regiones={regiones}
            requestUrl="/pt/solicitar"
            selectPlaceholder={t.destinations.selectPlaceholder}
            foreignPopLabel={t.destinations.foreignPop}
            requestLabel={t.home.request}
          />
          <div className="text-center mt-10 pt-10 border-t border-gray-300">
            <p className="text-gray-600 mb-4 text-sm">{t.destinations.cantFindCity}</p>
            <Link href="/pt/solicitar" className="btn-minimal">
              {t.home.requestInfo} →
            </Link>
          </div>
        </div>
      </section>

      <section className="section text-center">
        <div className="container-narrow">
          <h2 className="mb-4">{t.home.readyToStart}</h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{t.home.readyToStartDesc}</p>
          <Link href="/pt/solicitar" className="btn-minimal-lg">{t.home.requestInfoNow}</Link>
        </div>
      </section>
    </>
  );
}
