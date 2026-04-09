import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { LandingPage } from '@/lib/types';
import Breadcrumbs from '@/components/Breadcrumbs';
import ServiceIcon from '@/components/ServiceIcon';
import LandingFormEmbed from '@/components/LandingFormEmbed';
import { getLandingBySlug, getActiveLandingSlugs } from '@/lib/data';
import { getDictionary } from '@/lib/dictionaries';
import { ROUTES } from '@/lib/routes';
import type { Locale } from '@/lib/routes';
import { buildDynamicAlternates, buildOpenGraph, buildTwitter, serviceJsonLd, localServiceJsonLd, faqPageJsonLd, JsonLd } from '@/lib/seo';

const LOCALE: Locale = 'en';
const t = getDictionary(LOCALE);
const r = ROUTES[LOCALE];

export const revalidate = 86400;

async function getLanding(slug: string): Promise<LandingPage | null> {
  return getLandingBySlug(slug, LOCALE);
}

const SERVICIOS_DATA: Record<string, {
  titulo: string;
  subtitulo: string;
  descripcion: string;
  beneficios: { titulo: string; descripcion: string }[];
  faqs: { pregunta: string; respuesta: string }[];
  ciudadesPopulares: string[];
}> = {
  'seguros': {
    titulo: 'Health Insurance',
    subtitulo: 'Private health insurance for foreigners and residents in Spain',
    descripcion: 'Find the best private health insurance in Spain as a foreigner. We compare leading insurers to offer you policies with no co-pays, full coverage and accepted for residency paperwork. We connect you with the best options tailored to your situation.',
    beneficios: [
      {
        titulo: 'Accepted for residency paperwork',
        descripcion: 'Policies that meet all immigration requirements: no co-pays, full coverage, accepted by consulates.',
      },
      {
        titulo: 'Immediate coverage',
        descripcion: 'No waiting periods. Access to consultations and emergencies from day one.',
      },
      {
        titulo: 'Extensive medical network',
        descripcion: 'Thousands of professionals and medical centres across Spain at your disposal.',
      },
      {
        titulo: 'Multilingual care',
        descripcion: 'Doctors and medical staff who speak English, German, French and more.',
      },
      {
        titulo: 'Repatriation included',
        descripcion: 'Coverage for transfer to your home country if needed.',
      },
    ],
    faqs: [
      {
        pregunta: 'What type of insurance do I need as a foreigner in Spain?',
        respuesta: 'As a foreigner in Spain you need private health insurance with no co-pays and full coverage. It must be issued by a Spanish insurer and remain valid throughout your stay. We help you compare options and find the right policy.',
      },
      {
        pregunta: 'Do I need private insurance if I have a European Health Card?',
        respuesta: 'The EHIC only covers emergencies and temporary stays. Residents need private insurance or a special agreement with Social Security.',
      },
      {
        pregunta: 'Can I get insurance without a NIE?',
        respuesta: 'Yes, some insurers allow you to sign up with your passport while you process your NIE. This is common for foreigners starting their paperwork from their home country.',
      },
      {
        pregunta: 'Do they cover pre-existing conditions?',
        respuesta: 'It depends on the insurer and policy type. We advise you to find the best option based on your medical history.',
      },
    ],
    ciudadesPopulares: ['madrid', 'barcelona', 'valencia', 'malaga', 'alicante'],
  },
  'abogados': {
    titulo: 'Lawyers',
    subtitulo: 'Experts in all areas: family, civil, labour, immigration',
    descripcion: 'You need a lawyer for divorce, inheritance, employment contracts, visas or any legal matter. We connect you with verified professionals who speak your language and know Spanish law.',
    beneficios: [
      {
        titulo: 'All specialities',
        descripcion: 'Lawyers in family, civil, labour, immigration, criminal law and more. Find the right professional for your case.',
      },
      {
        titulo: 'Full management',
        descripcion: 'We handle all documentation and procedures with the authorities.',
      },
      {
        titulo: 'Personalised follow-up',
        descripcion: 'We keep you informed of the status of your case at all times.',
      },
      {
        titulo: 'Appeals and resources',
        descripcion: 'If there are issues with your application, we prepare administrative and judicial appeals.',
      },
    ],
    faqs: [
      {
        pregunta: 'How long does it take to get a NIE?',
        respuesta: 'The NIE can be obtained in 1-2 weeks with an appointment. The hardest part is getting the appointment, where a lawyer can help.',
      },
      {
        pregunta: 'What visa do I need to live in Spain?',
        respuesta: 'It depends on your nationality and situation. The most common are: non-lucrative visa, work visa, student visa and Golden Visa.',
      },
      {
        pregunta: 'When can I apply for nationality?',
        respuesta: 'Generally after 10 years of legal residence, although there are exceptions (2 years for Latin Americans, 1 year if married to a Spanish citizen).',
      },
    ],
    ciudadesPopulares: ['madrid', 'barcelona', 'valencia', 'sevilla', 'malaga'],
  },
  'inmobiliarias': {
    titulo: 'Real Estate',
    subtitulo: 'Find your ideal home in Spain',
    descripcion: 'Buying or renting in Spain as a foreigner has its particularities. We work with estate agents who understand foreigners\' needs and accompany you throughout the process.',
    beneficios: [
      {
        titulo: 'Personalised search',
        descripcion: 'We define your criteria and search for properties that truly match your needs.',
      },
      {
        titulo: 'Local knowledge',
        descripcion: 'We advise you on the best areas for your profile: families, retirees, professionals.',
      },
      {
        titulo: 'Document management',
        descripcion: 'Help with contracts, NIE, bank account opening and everything needed for the purchase.',
      },
      {
        titulo: 'After-sales support',
        descripcion: 'We help with renovations, utilities, community fees and more.',
      },
    ],
    faqs: [
      {
        pregunta: 'Can I buy a house in Spain without being a resident?',
        respuesta: 'Yes, any foreigner can buy property in Spain. You just need a NIE and a Spanish bank account.',
      },
      {
        pregunta: 'How much does it cost to buy a house in Spain?',
        respuesta: 'In addition to the property price, budget 10-15% extra for taxes (ITP or VAT), notary, registry and mortgage costs.',
      },
      {
        pregunta: 'Is it easy to get a mortgage as a foreigner?',
        respuesta: 'It is possible, although banks usually finance a maximum of 60-70% for non-residents, compared to 80% for residents.',
      },
    ],
    ciudadesPopulares: ['marbella', 'alicante', 'torrevieja', 'palma', 'tenerife'],
  },
  'gestorias': {
    titulo: 'Administrative Services',
    subtitulo: 'Hassle-free administrative procedures',
    descripcion: 'Spanish bureaucracy can be frustrating if you don\'t know the system. An administrative agency saves you time and headaches with all administrative procedures.',
    beneficios: [
      {
        titulo: 'Experience with foreigners',
        descripcion: 'They know the specific procedures that non-Spanish residents need.',
      },
      {
        titulo: 'Time savings',
        descripcion: 'Avoid endless queues and impossible-to-get appointments.',
      },
      {
        titulo: 'All-in-one',
        descripcion: 'NIE, registration, taxes, vehicles, Social Security... a single point of contact.',
      },
      {
        titulo: 'Fixed prices',
        descripcion: 'You know exactly how much you will pay before starting.',
      },
    ],
    faqs: [
      {
        pregunta: 'What procedures can an administrative agency handle?',
        respuesta: 'Practically everything: NIE, registration, tax returns, self-employment registration, vehicle registration, degree validation...',
      },
      {
        pregunta: 'Is it expensive to hire an administrative agency?',
        respuesta: 'Prices vary by procedure. A NIE can cost €50-100, a tax return €50-150. The time savings usually make it worthwhile.',
      },
      {
        pregunta: 'Do I need to be present for the procedures?',
        respuesta: 'For some procedures yes (like the NIE), but many can be done with a power of attorney.',
      },
    ],
    ciudadesPopulares: ['madrid', 'barcelona', 'valencia', 'alicante', 'malaga'],
  },
};

const CIUDADES_NOMBRES: Record<string, string> = {
  'madrid': 'Madrid',
  'barcelona': 'Barcelona',
  'valencia': 'Valencia',
  'malaga': 'Málaga',
  'alicante': 'Alicante',
  'sevilla': 'Seville',
  'marbella': 'Marbella',
  'torrevieja': 'Torrevieja',
  'palma': 'Palma de Mallorca',
  'tenerife': 'Tenerife',
};

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  
  const alternates = buildDynamicAlternates(LOCALE, 'services', slug);
  const url = alternates.canonical;
  
  if (slug.includes('-')) {
    const landing = await getLanding(slug);
    if (landing) {
      return {
        title: landing.meta_title,
        description: landing.meta_description,
        keywords: Array.isArray(landing.meta_keywords) 
          ? landing.meta_keywords.join(', ') 
          : landing.meta_keywords || undefined,
        alternates,
        openGraph: buildOpenGraph(LOCALE, {
          title: landing.meta_title,
          description: landing.meta_description,
          url,
        }),
        twitter: buildTwitter({
          title: landing.meta_title,
          description: landing.meta_description,
        }),
      };
    }
  }
  
  const servicio = SERVICIOS_DATA[slug];
  
  if (!servicio) {
    return { 
      title: t.landingUI.serviceNotFound,
      alternates,
    };
  }
  
  const title = `${servicio.titulo} ${t.landingUI.forExpatsIn} | Health4Spain`;
  const description = servicio.descripcion.slice(0, 155) + '...';
  
  return {
    title,
    description,
    alternates,
    openGraph: buildOpenGraph(LOCALE, { title, description, url }),
    twitter: buildTwitter({ title, description }),
  };
}

export async function generateStaticParams() {
  const staticServices = Object.keys(SERVICIOS_DATA).map((slug) => ({ slug }));
  const landingSlugs = await getActiveLandingSlugs(LOCALE);
  const dynamicSlugs = landingSlugs.filter(s => s.includes('-'));
  return [...staticServices, ...dynamicSlugs.map((slug) => ({ slug }))];
}

export default async function ServicioPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  if (slug.includes('-')) {
    const landing = await getLanding(slug);
    if (landing) {
      return <LandingPageView landing={landing} />;
    }
  }
  
  const servicio = SERVICIOS_DATA[slug];
  
  if (!servicio) {
    notFound();
  }

  const breadcrumbs = [
    { name: t.common.breadcrumbHome, url: `/${LOCALE}` },
    { name: t.nav.services, url: `/${LOCALE}/${r.services}` },
    { name: servicio.titulo, url: `/${LOCALE}/${r.services}/${slug}` },
  ];

  return (
    <>
      <JsonLd data={serviceJsonLd({
        name: servicio.titulo,
        description: servicio.descripcion,
        url: `/${LOCALE}/${r.services}/${slug}`,
        locale: LOCALE,
      })} />
      {servicio.faqs && servicio.faqs.length > 0 && (
        <JsonLd data={faqPageJsonLd(servicio.faqs.map(f => ({ question: f.pregunta, answer: f.respuesta })))} />
      )}
      <section className="section">
        <div className="container-narrow">
          <Breadcrumbs items={[
            { label: t.common.breadcrumbHome, href: `/${LOCALE}` },
            { label: t.nav.services, href: `/${LOCALE}/${r.services}` },
            { label: servicio.titulo }
          ]} />
          <h1 className="mb-8">
            {servicio.titulo}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl">
            {servicio.subtitulo}
          </p>
        </div>
      </section>

      <section className="section-alt">
        <div className="container-narrow">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-16">
              <div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {servicio.descripcion}
                </p>
              </div>

              <div>
                <h2 className="mb-8">
                  Why choose us?
                </h2>
                <ul className="service-list-minimal">
                  {servicio.beneficios.map((beneficio, index) => (
                    <li key={index} className="service-item-minimal">
                      <div className="service-number">0{index + 1}</div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-2">
                          {beneficio.titulo}
                        </h3>
                        <p className="text-base md:text-lg text-gray-600">
                          {beneficio.descripcion}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="mb-8">
                  {t.landingUI.faqs}
                </h2>
                <div className="space-y-6">
                  {servicio.faqs.map((faq, index) => (
                    <div key={index} className="border-t-3 border-gray-300 pt-6">
                      <h3 className="text-xl font-bold mb-3">
                        {faq.pregunta}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {faq.respuesta}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white border-t-3 border-accent p-6 sticky top-20">
                <h3 className="text-xl font-bold mb-4">
                  {t.landingUI.sidebarTitle}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t.landingUI.sidebarDesc}
                </p>
                <Link 
                  href={`/${LOCALE}/${r.request}?servicio=${slug}`}
                  className="block w-full text-center py-4 px-6 bg-[#293f92] text-white font-bold text-base hover:bg-[#1e2d6b] transition-colors rounded-sm mb-4"
                >
                  {t.landingUI.startNow}
                </Link>
                <p className="text-xs text-gray-500 text-center">
                  {t.landingUI.noCommitment} · {t.landingUI.free100}
                </p>
              </div>

              {servicio.ciudadesPopulares.length > 0 && (
                <div className="bg-white border-t-3 border-gray-300 p-6">
                  <h3 className="text-xl font-bold mb-4">
                    Popular cities
                  </h3>
                  <div className="space-y-3">
                    {servicio.ciudadesPopulares.map((ciudadSlug) => (
                      <Link
                        key={ciudadSlug}
                        href={`/${LOCALE}/${r.request}?servicio=${slug}&ciudad=${ciudadSlug}`}
                        className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0 hover:pl-2 transition-all group"
                      >
                        <span className="text-gray-700 font-medium group-hover:text-accent">
                          {CIUDADES_NOMBRES[ciudadSlug]}
                        </span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section text-center">
        <div className="container-narrow">
          <h2 className="mb-8">
            {t.landingUI.readyToStart}
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
            {t.landingUI.connectMsg}
          </p>
          <Link 
            href={`/${LOCALE}/${r.request}?servicio=${slug}`} 
            className="btn-minimal-lg"
          >
            {t.landingUI.requestFreeInfo}
          </Link>
        </div>
      </section>
    </>
  );
}

function LandingPageView({ landing }: { landing: LandingPage }) {
  const breadcrumbs = [
    { name: t.common.breadcrumbHome, url: `/${LOCALE}` },
    { name: t.nav.services, url: `/${LOCALE}/${r.services}` },
    ...(landing.servicio_nombre ? [{ name: landing.servicio_nombre, url: `/${LOCALE}/${r.services}/${landing.servicio_slug}` }] : []),
    { name: landing.hero_title, url: `/${LOCALE}/${r.services}/${landing.slug}` },
  ];
  
  return (
    <>
      <JsonLd data={localServiceJsonLd({
        name: landing.hero_title,
        description: landing.meta_description,
        url: `/${LOCALE}/${r.services}/${landing.slug}`,
        locale: LOCALE,
        cityName: landing.ciudad_nombre || undefined,
        provincia: landing.provincia || undefined,
      })} />
      {landing.faqs && landing.faqs.length > 0 && (
        <JsonLd data={faqPageJsonLd(landing.faqs.map(f => ({ question: f.question, answer: f.answer })))} />
      )}
      <section className="section">
        <div className="container-base">
          <Breadcrumbs items={[
            { label: t.common.breadcrumbHome, href: `/${LOCALE}` },
            { label: t.nav.services, href: `/${LOCALE}/${r.services}` },
            ...(landing.servicio_nombre ? [{ label: landing.servicio_nombre, href: `/${LOCALE}/${r.services}/${landing.servicio_slug}` }] : []),
            { label: landing.hero_title }
          ]} />
          <h1 className="mb-6 md:mb-8 text-2xl sm:text-3xl md:text-[2.5rem] lg:text-[3rem] xl:text-[3.5rem] !leading-[1.5] max-w-4xl">
            {landing.hero_title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 md:mb-8 max-w-2xl leading-relaxed">
            {landing.hero_subtitle}
          </p>
          {landing.hero_bullets && landing.hero_bullets.length > 0 && (
            <div className="flex flex-wrap gap-8 mb-12 pt-8 border-t border-gray-300">
              {landing.hero_bullets.slice(0, 3).map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 font-medium">{bullet}</span>
                </div>
              ))}
            </div>
          )}
          
          {landing.servicio_slug && landing.ciudad_slug ? (
            <div className="max-w-2xl mx-auto">
              <LandingFormEmbed
                servicioSlug={landing.servicio_slug}
                ciudadSlug={landing.ciudad_slug}
                servicioNombre={landing.servicio_nombre || landing.servicio_slug}
                ciudadNombre={landing.ciudad_nombre || landing.ciudad_slug}
                locale={LOCALE}
              />
            </div>
          ) : (
            <Link 
              href={`/${LOCALE}/${r.request}?servicio=${landing.servicio_slug || landing.slug}${landing.ciudad_slug ? `&ciudad=${landing.ciudad_slug}` : ''}`}
              className="btn-minimal-lg"
            >
              {t.landingUI.requestFreeInfo}
            </Link>
          )}
        </div>
      </section>

      <section className="section-alt">
        <div className="container-base">
          <div className="grid lg:grid-cols-3 gap-16">
            
            <div className="lg:col-span-2 space-y-16">
              
              {landing.problem_title && landing.problems && landing.problems.length > 0 && (
                <div>
                  <h2 className="mb-6 md:mb-8 text-xl sm:text-2xl md:text-3xl">
                    {landing.problem_title}
                  </h2>
                  <div className="space-y-4">
                    {landing.problems.map((problem, idx) => (
                      <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
<svg className="w-6 h-6 text-accent mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-gray-700 text-lg">{problem}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {landing.solution_title && landing.solution_text && (
                <div className="bg-white border-t-3 border-accent p-8">
                  <h2 className="mb-6">
                    {landing.solution_title}
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line mb-6">
                    {landing.solution_text}
                  </p>
                  <Link 
                    href={`/${LOCALE}/${r.request}?servicio=${landing.servicio_slug || landing.slug}${landing.ciudad_slug ? `&ciudad=${landing.ciudad_slug}` : ''}`}
                    className="btn-minimal inline-flex items-center gap-2"
                  >
                    {t.landingUI.requestContact} →
                  </Link>
                </div>
              )}

              {landing.services_title && landing.services && landing.services.length > 0 && (
                <div>
                  <h2 className="mb-6 md:mb-8 text-xl sm:text-2xl md:text-3xl">
                    {landing.services_title}
                  </h2>
                  <ul className="service-list-minimal">
                    {landing.services.map((service, idx) => (
                      <li key={idx} className="service-item-minimal">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                          <ServiceIcon title={service.title} />
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
                            {service.title}
                          </h3>
                          <p className="text-sm sm:text-base md:text-lg text-gray-600">{service.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="text-center mt-12 pt-12 border-t border-gray-300">
                    <p className="text-gray-600 mb-6">{t.landingUI.needHelp}</p>
                    <Link 
                      href={`/${LOCALE}/${r.request}?servicio=${landing.servicio_slug || landing.slug}${landing.ciudad_slug ? `&ciudad=${landing.ciudad_slug}` : ''}`}
                      className="btn-minimal-lg"
                    >
                      {t.landingUI.requestFreeInfo}
                    </Link>
                  </div>
                </div>
              )}

              {landing.why_city_title && landing.why_city_text && (
                <div>
                  <h2 className="mb-6 md:mb-8 text-xl sm:text-2xl md:text-3xl">
                    {landing.why_city_title}
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-8 whitespace-pre-line">
                    {landing.why_city_text}
                  </p>
                  {landing.why_city_stats && landing.why_city_stats.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      {landing.why_city_stats.map((stat, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-accent mb-2">
                            {stat.value}
                          </div>
                          <div className="text-sm uppercase tracking-widest text-gray-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-center mt-12">
                    <Link 
                      href={`/${LOCALE}/${r.request}?servicio=${landing.servicio_slug || landing.slug}${landing.ciudad_slug ? `&ciudad=${landing.ciudad_slug}` : ''}`}
                      className="btn-minimal"
                    >
                      {t.landingUI.connectProf} →
                    </Link>
                  </div>
                </div>
              )}

              {landing.faqs && landing.faqs.length > 0 && (
                <div>
                  <h2 className="mb-6 md:mb-8 text-xl sm:text-2xl md:text-3xl">
                    {t.landingUI.faqs}
                  </h2>
                  <div className="space-y-6">
                    {landing.faqs.map((faq, idx) => (
                      <div key={idx} className="border-t-3 border-gray-300 pt-6">
                        <h3 className="text-xl font-bold mb-3">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            <div className="space-y-8">
              <div className="bg-white border-t-3 border-accent p-6 sticky top-20">
                <h3 className="text-xl font-bold mb-4">
                  {t.landingUI.sidebarTitle}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t.landingUI.sidebarDesc}
                </p>
                <Link 
                  href={`/${LOCALE}/${r.request}?servicio=${landing.servicio_slug || landing.slug}${landing.ciudad_slug ? `&ciudad=${landing.ciudad_slug}` : ''}`}
                  className="block w-full text-center py-4 px-6 bg-[#293f92] text-white font-bold text-base hover:bg-[#1e2d6b] transition-colors rounded-sm mb-4"
                >
                  {t.landingUI.startNow}
                </Link>
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t.landingUI.noCommitment}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t.landingUI.free100}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t.landingUI.verifiedProf}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="section text-center">
        <div className="container-base">
          <h2 className="mb-8">
            {landing.cta_title || t.landingUI.readyToStart}
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
            {landing.cta_subtitle || t.landingUI.connectMsg}
          </p>
          <Link 
            href={`/${LOCALE}/${r.request}?servicio=${landing.servicio_slug || landing.slug}${landing.ciudad_slug ? `&ciudad=${landing.ciudad_slug}` : ''}`}
            className="btn-minimal-lg"
          >
            {t.landingUI.requestFreeInfo}
          </Link>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t.landingUI.response24h}
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
