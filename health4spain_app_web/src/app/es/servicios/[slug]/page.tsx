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
import { buildDynamicAlternates, buildOpenGraph, buildTwitter, serviceJsonLd, faqPageJsonLd, JsonLd } from '@/lib/seo';

const LOCALE: Locale = 'es';
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
    titulo: 'Seguros de Salud',
    subtitulo: 'Cobertura médica completa para extranjeros en España',
    descripcion: 'El sistema sanitario español es de los mejores del mundo, pero como extranjero necesitas un seguro privado para acceder a él sin esperas. Te conectamos con las mejores aseguradoras que ofrecen pólizas adaptadas a residentes internacionales.',
    beneficios: [
      {
        titulo: 'Cobertura inmediata',
        descripcion: 'Sin períodos de carencia. Acceso a consultas y urgencias desde el primer día.',
      },
      {
        titulo: 'Cuadro médico amplio',
        descripcion: 'Miles de profesionales y centros médicos en toda España a tu disposición.',
      },
      {
        titulo: 'Atención multilingüe',
        descripcion: 'Médicos y personal sanitario que hablan inglés, alemán, francés y más.',
      },
      {
        titulo: 'Repatriación incluida',
        descripcion: 'Cobertura de traslado a tu país de origen en caso de necesidad.',
      },
    ],
    faqs: [
      {
        pregunta: '¿Necesito seguro privado si tengo tarjeta sanitaria europea?',
        respuesta: 'La TSE solo cubre urgencias y situaciones temporales. Para residentes es imprescindible un seguro privado o el convenio especial con la Seguridad Social.',
      },
      {
        pregunta: '¿Puedo contratar seguro sin NIE?',
        respuesta: 'Sí, algunas aseguradoras permiten contratar con pasaporte mientras tramitas tu NIE.',
      },
      {
        pregunta: '¿Cubren preexistencias?',
        respuesta: 'Depende de la aseguradora y el tipo de póliza. Te asesoramos para encontrar la mejor opción según tu historial médico.',
      },
    ],
    ciudadesPopulares: ['madrid', 'barcelona', 'valencia', 'malaga', 'alicante'],
  },
  'abogados': {
    titulo: 'Abogados',
    subtitulo: 'Expertos en todas las materias: familia, civil, laboral, extranjería',
    descripcion: 'Necesitas un abogado para divorcio, herencias, contratos laborales, visados o cualquier asunto legal. Te conectamos con profesionales verificados que hablan tu idioma y conocen la legislación española.',
    beneficios: [
      {
        titulo: 'Todas las especialidades',
        descripcion: 'Abogados en familia, civil, laboral, extranjería, penal y más. Encuentra el profesional adecuado para tu caso.',
      },
      {
        titulo: 'Gestión completa',
        descripcion: 'Nos encargamos de toda la documentación y trámites ante las autoridades.',
      },
      {
        titulo: 'Seguimiento personalizado',
        descripcion: 'Te mantenemos informado del estado de tu expediente en todo momento.',
      },
      {
        titulo: 'Recursos y apelaciones',
        descripcion: 'Si hay problemas con tu solicitud, preparamos recursos administrativos y judiciales.',
      },
    ],
    faqs: [
      {
        pregunta: '¿Cuánto tarda obtener el NIE?',
        respuesta: 'El NIE se puede obtener en 1-2 semanas si se tiene cita. Lo más difícil es conseguir cita previa, donde un abogado puede ayudarte.',
      },
      {
        pregunta: '¿Qué visado necesito para vivir en España?',
        respuesta: 'Depende de tu nacionalidad y situación. Los más comunes son: visa no lucrativa, visa de trabajo, visa de estudiante y Golden Visa.',
      },
      {
        pregunta: '¿Cuándo puedo solicitar la nacionalidad?',
        respuesta: 'Generalmente tras 10 años de residencia legal, aunque hay excepciones (2 años para iberoamericanos, 1 año si estás casado con español/a).',
      },
    ],
    ciudadesPopulares: ['madrid', 'barcelona', 'valencia', 'sevilla', 'malaga'],
  },
  'inmobiliarias': {
    titulo: 'Inmobiliarias',
    subtitulo: 'Encuentra tu hogar ideal en España',
    descripcion: 'Comprar o alquilar en España siendo extranjero tiene sus particularidades. Trabajamos con inmobiliarias que entienden las necesidades de los extranjeros y te acompañan en todo el proceso.',
    beneficios: [
      {
        titulo: 'Búsqueda personalizada',
        descripcion: 'Definimos tus criterios y buscamos propiedades que realmente se ajusten a lo que necesitas.',
      },
      {
        titulo: 'Conocimiento local',
        descripcion: 'Te asesoramos sobre las mejores zonas según tu perfil: familias, jubilados, profesionales.',
      },
      {
        titulo: 'Gestión documental',
        descripcion: 'Ayuda con contratos, NIE, apertura de cuenta bancaria y todo lo necesario para la compra.',
      },
      {
        titulo: 'Postventa',
        descripcion: 'Te ayudamos con reformas, suministros, comunidad de vecinos y más.',
      },
    ],
    faqs: [
      {
        pregunta: '¿Puedo comprar una casa en España sin ser residente?',
        respuesta: 'Sí, cualquier extranjero puede comprar propiedad en España. Solo necesitas un NIE y una cuenta bancaria española.',
      },
      {
        pregunta: '¿Cuánto cuesta comprar una casa en España?',
        respuesta: 'Además del precio de la vivienda, calcula un 10-15% adicional para impuestos (ITP o IVA), notaría, registro e hipoteca.',
      },
      {
        pregunta: '¿Es fácil obtener una hipoteca siendo extranjero?',
        respuesta: 'Es posible, aunque los bancos suelen financiar un máximo del 60-70% para no residentes, frente al 80% para residentes.',
      },
    ],
    ciudadesPopulares: ['marbella', 'alicante', 'torrevieja', 'palma', 'tenerife'],
  },
  'gestorias': {
    titulo: 'Gestorías',
    subtitulo: 'Trámites administrativos sin complicaciones',
    descripcion: 'La burocracia española puede ser frustrante si no conoces el sistema. Una gestoría te ahorra tiempo y quebraderos de cabeza con todos los trámites administrativos.',
    beneficios: [
      {
        titulo: 'Experiencia con extranjeros',
        descripcion: 'Conocen los trámites específicos que necesitan los no españoles.',
      },
      {
        titulo: 'Ahorro de tiempo',
        descripcion: 'Evita colas interminables y citas imposibles de conseguir.',
      },
      {
        titulo: 'Todo en uno',
        descripcion: 'NIE, empadronamiento, impuestos, vehículos, Seguridad Social... un solo interlocutor.',
      },
      {
        titulo: 'Precios cerrados',
        descripcion: 'Sabes exactamente cuánto vas a pagar antes de empezar.',
      },
    ],
    faqs: [
      {
        pregunta: '¿Qué trámites puede hacer una gestoría?',
        respuesta: 'Prácticamente todo: NIE, empadronamiento, declaración de la renta, alta en autónomos, matriculación de vehículos, homologación de títulos...',
      },
      {
        pregunta: '¿Es caro contratar una gestoría?',
        respuesta: 'Los precios varían según el trámite. El NIE puede costar 50-100€, la declaración de la renta 50-150€. El ahorro de tiempo suele compensar.',
      },
      {
        pregunta: '¿Necesito estar presente para los trámites?',
        respuesta: 'Para algunos trámites sí (como el NIE), pero muchos se pueden hacer con un poder notarial.',
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
  'sevilla': 'Sevilla',
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
                  ¿Por qué elegirnos?
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
                    Ciudades populares
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
