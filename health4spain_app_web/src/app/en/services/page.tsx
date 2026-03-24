import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getServicios } from '@/lib/services';
import { HERO_IMAGES } from '@/lib/constants';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'en';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.servicesPage.metaTitle,
  description: t.servicesPage.metaDesc,
  alternates: buildAlternates(locale, '/services'),
};

export default async function ServicesPage() {
  const servicios = await getServicios();
  return (
    <>
      <section className="hero-with-image hero-compact">
        <div className="absolute inset-0 z-0"><Image src={HERO_IMAGES.servicios} alt="Services for foreigners in Spain" fill priority fetchPriority="high" sizes="100vw" className="object-cover object-center" /></div>
        <div className="hero-content-box">
          <h1 className="mb-4" style={{ lineHeight: '0.95' }}>{t.servicesPage.title}</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl">{t.home.servicesSubtitle}</p>
          <Link href="/en/request" className="btn-minimal-lg">{t.home.requestInfo}</Link>
        </div>
      </section>

      <section className="section-alt">
        <div className="container-narrow">
          <Breadcrumbs items={[{ label: t.common.breadcrumbHome, href: '/en' }, { label: t.servicesPage.title }]} />
          <ul className="service-list-minimal">
            {servicios.map((servicio, index) => {
              const numero = String(index + 1).padStart(2, '0');
              return (
                <li key={servicio.slug}>
                  <Link href={`/en/request?servicio=${servicio.slug}`} className="service-item-minimal block w-full hover:bg-white hover:pl-4 transition-all group">
                    <div className="service-number">{numero}</div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold mb-2">{servicio.nombre_plural || servicio.nombre}</h2>
                      <p className="text-sm md:text-base text-gray-600 mb-4">{servicio.descripcion_corta}</p>
                    </div>
                    <span className="service-arrow group-hover:translate-x-2 transition-transform">{t.home.request} →</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section text-center">
        <div className="container-narrow">
          <h2 className="mb-4">{t.home.readyToStart}</h2>
          <Link href="/en/request" className="btn-minimal-lg">{t.home.requestInfoNow}</Link>
        </div>
      </section>
    </>
  );
}
