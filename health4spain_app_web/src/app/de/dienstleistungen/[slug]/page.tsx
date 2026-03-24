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

const LOCALE: Locale = 'de';
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
    titulo: 'Krankenversicherung',
    subtitulo: 'Umfassender medizinischer Schutz für Ausländer in Spanien',
    descripcion: 'Das spanische Gesundheitssystem gehört zu den besten der Welt, aber als Ausländer benötigen Sie eine private Versicherung, um ohne Wartezeiten darauf zugreifen zu können. Wir verbinden Sie mit den besten Versicherern, die auf internationale Einwohner zugeschnittene Policen anbieten.',
    beneficios: [
      {
        titulo: 'Sofortiger Schutz',
        descripcion: 'Keine Wartezeiten. Zugang zu Arztbesuchen und Notfällen ab dem ersten Tag.',
      },
      {
        titulo: 'Umfangreiches Ärzte-Netzwerk',
        descripcion: 'Tausende von Fachleuten und medizinischen Zentren in ganz Spanien stehen Ihnen zur Verfügung.',
      },
      {
        titulo: 'Mehrsprachige Betreuung',
        descripcion: 'Ärzte und medizinisches Personal, die Englisch, Deutsch, Französisch und mehr sprechen.',
      },
      {
        titulo: 'Rückführung inklusive',
        descripcion: 'Deckung für den Transport in Ihr Heimatland bei Bedarf.',
      },
    ],
    faqs: [
      {
        pregunta: 'Brauche ich eine private Versicherung, wenn ich eine Europäische Krankenversicherungskarte habe?',
        respuesta: 'Die EHIC deckt nur Notfälle und vorübergehende Aufenthalte ab. Einwohner benötigen eine private Versicherung oder eine Sondervereinbarung mit der Sozialversicherung.',
      },
      {
        pregunta: 'Kann ich eine Versicherung ohne NIE abschließen?',
        respuesta: 'Ja, einige Versicherer erlauben den Abschluss mit Reisepass, während Sie Ihre NIE bearbeiten.',
      },
      {
        pregunta: 'Werden Vorerkrankungen abgedeckt?',
        respuesta: 'Das hängt vom Versicherer und der Art der Police ab. Wir beraten Sie, um die beste Option basierend auf Ihrer Krankengeschichte zu finden.',
      },
    ],
    ciudadesPopulares: ['madrid', 'barcelona', 'valencia', 'malaga', 'alicante'],
  },
  'abogados': {
    titulo: 'Anwälte',
    subtitulo: 'Experten in allen Bereichen: Familie, Zivil-, Arbeits- und Ausländerrecht',
    descripcion: 'Sie brauchen einen Anwalt für Scheidung, Erbschaft, Arbeitsverträge, Visa oder jede andere Rechtsangelegenheit. Wir verbinden Sie mit verifizierten Fachleuten, die Ihre Sprache sprechen und das spanische Recht kennen.',
    beneficios: [
      {
        titulo: 'Alle Fachgebiete',
        descripcion: 'Anwälte für Familien-, Zivil-, Arbeits-, Ausländer- und Strafrecht und mehr. Finden Sie den richtigen Fachmann für Ihren Fall.',
      },
      {
        titulo: 'Komplette Verwaltung',
        descripcion: 'Wir kümmern uns um alle Dokumente und Verfahren bei den Behörden.',
      },
      {
        titulo: 'Persönliche Betreuung',
        descripcion: 'Wir halten Sie jederzeit über den Stand Ihres Falls auf dem Laufenden.',
      },
      {
        titulo: 'Einsprüche und Berufungen',
        descripcion: 'Bei Problemen mit Ihrem Antrag bereiten wir verwaltungsrechtliche und gerichtliche Einsprüche vor.',
      },
    ],
    faqs: [
      {
        pregunta: 'Wie lange dauert es, eine NIE zu bekommen?',
        respuesta: 'Die NIE kann in 1-2 Wochen mit Termin erhalten werden. Das Schwierigste ist, den Termin zu bekommen, wobei ein Anwalt helfen kann.',
      },
      {
        pregunta: 'Welches Visum brauche ich, um in Spanien zu leben?',
        respuesta: 'Das hängt von Ihrer Nationalität und Situation ab. Die häufigsten sind: nicht-lukratives Visum, Arbeitsvisum, Studentenvisum und Golden Visa.',
      },
      {
        pregunta: 'Wann kann ich die Staatsbürgerschaft beantragen?',
        respuesta: 'Generell nach 10 Jahren legalem Aufenthalt, obwohl es Ausnahmen gibt (2 Jahre für Lateinamerikaner, 1 Jahr bei Ehe mit einem/einer Spanier/in).',
      },
    ],
    ciudadesPopulares: ['madrid', 'barcelona', 'valencia', 'sevilla', 'malaga'],
  },
  'inmobiliarias': {
    titulo: 'Immobilien',
    subtitulo: 'Finden Sie Ihr ideales Zuhause in Spanien',
    descripcion: 'Kaufen oder Mieten in Spanien als Ausländer hat seine Besonderheiten. Wir arbeiten mit Immobilienmaklern zusammen, die die Bedürfnisse von Ausländern verstehen und Sie durch den gesamten Prozess begleiten.',
    beneficios: [
      {
        titulo: 'Personalisierte Suche',
        descripcion: 'Wir definieren Ihre Kriterien und suchen Immobilien, die wirklich zu Ihren Bedürfnissen passen.',
      },
      {
        titulo: 'Lokale Kenntnisse',
        descripcion: 'Wir beraten Sie über die besten Gegenden für Ihr Profil: Familien, Rentner, Berufstätige.',
      },
      {
        titulo: 'Dokumentenverwaltung',
        descripcion: 'Hilfe bei Verträgen, NIE, Bankkontoeröffnung und allem, was für den Kauf nötig ist.',
      },
      {
        titulo: 'Nachverkaufsservice',
        descripcion: 'Wir helfen bei Renovierungen, Versorgungsunternehmen, Eigentümergemeinschaft und mehr.',
      },
    ],
    faqs: [
      {
        pregunta: 'Kann ich ein Haus in Spanien kaufen, ohne Einwohner zu sein?',
        respuesta: 'Ja, jeder Ausländer kann Eigentum in Spanien erwerben. Sie brauchen nur eine NIE und ein spanisches Bankkonto.',
      },
      {
        pregunta: 'Was kostet es, ein Haus in Spanien zu kaufen?',
        respuesta: 'Zusätzlich zum Immobilienpreis rechnen Sie mit 10-15% für Steuern (ITP oder MwSt.), Notar, Register und Hypothekenkosten.',
      },
      {
        pregunta: 'Ist es einfach, als Ausländer eine Hypothek zu bekommen?',
        respuesta: 'Es ist möglich, obwohl Banken in der Regel maximal 60-70% für Nicht-Einwohner finanzieren, im Vergleich zu 80% für Einwohner.',
      },
    ],
    ciudadesPopulares: ['marbella', 'alicante', 'torrevieja', 'palma', 'tenerife'],
  },
  'gestorias': {
    titulo: 'Verwaltungsdienste',
    subtitulo: 'Verwaltungsverfahren ohne Komplikationen',
    descripcion: 'Die spanische Bürokratie kann frustrierend sein, wenn Sie das System nicht kennen. Ein Verwaltungsbüro spart Ihnen Zeit und Kopfschmerzen bei allen administrativen Verfahren.',
    beneficios: [
      {
        titulo: 'Erfahrung mit Ausländern',
        descripcion: 'Sie kennen die spezifischen Verfahren, die Nicht-Spanier benötigen.',
      },
      {
        titulo: 'Zeitersparnis',
        descripcion: 'Vermeiden Sie endlose Warteschlangen und unmögliche Termine.',
      },
      {
        titulo: 'Alles aus einer Hand',
        descripcion: 'NIE, Anmeldung, Steuern, Fahrzeuge, Sozialversicherung... ein einziger Ansprechpartner.',
      },
      {
        titulo: 'Festpreise',
        descripcion: 'Sie wissen genau, wie viel Sie bezahlen, bevor Sie beginnen.',
      },
    ],
    faqs: [
      {
        pregunta: 'Welche Verfahren kann ein Verwaltungsbüro durchführen?',
        respuesta: 'Praktisch alles: NIE, Anmeldung, Steuererklärung, Selbstständigenanmeldung, Fahrzeugzulassung, Titelanerkennung...',
      },
      {
        pregunta: 'Ist es teuer, ein Verwaltungsbüro zu beauftragen?',
        respuesta: 'Die Preise variieren je nach Verfahren. Eine NIE kann 50-100€ kosten, eine Steuererklärung 50-150€. Die Zeitersparnis lohnt sich meist.',
      },
      {
        pregunta: 'Muss ich bei den Verfahren anwesend sein?',
        respuesta: 'Für einige Verfahren ja (wie die NIE), aber viele können mit einer Vollmacht durchgeführt werden.',
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
  'tenerife': 'Teneriffa',
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
                  Warum uns wählen?
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
                    Beliebte Städte
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
