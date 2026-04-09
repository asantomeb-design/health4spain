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

const LOCALE: Locale = 'fr';
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
    titulo: 'Assurance Santé',
    subtitulo: 'Assurance santé privée pour étrangers et résidents en Espagne',
    descripcion: 'Trouvez la meilleure assurance santé privée en Espagne en tant qu\'étranger. Nous comparons les principaux assureurs pour vous proposer des polices sans franchise, avec couverture complète et acceptées pour les démarches de résidence. Nous vous connectons aux meilleures options adaptées à votre situation.',
    beneficios: [
      {
        titulo: 'Acceptée pour les démarches de résidence',
        descripcion: 'Polices conformes à toutes les exigences d\'immigration : sans franchise, couverture complète, acceptées par les consulats.',
      },
      {
        titulo: 'Couverture immédiate',
        descripcion: 'Pas de délai de carence. Accès aux consultations et urgences dès le premier jour.',
      },
      {
        titulo: 'Large réseau médical',
        descripcion: 'Des milliers de professionnels et centres médicaux dans toute l\'Espagne à votre disposition.',
      },
      {
        titulo: 'Soins multilingues',
        descripcion: 'Médecins et personnel soignant parlant anglais, allemand, français et plus.',
      },
      {
        titulo: 'Rapatriement inclus',
        descripcion: 'Couverture de transfert vers votre pays d\'origine en cas de besoin.',
      },
    ],
    faqs: [
      {
        pregunta: 'Quel type d\'assurance faut-il en tant qu\'étranger en Espagne ?',
        respuesta: 'En tant qu\'étranger en Espagne, vous avez besoin d\'une assurance santé privée sans franchise avec couverture complète. Elle doit être émise par un assureur espagnol et rester valide pendant toute la durée de votre séjour. Nous vous aidons à comparer les options et à trouver la bonne police.',
      },
      {
        pregunta: 'Ai-je besoin d\'une assurance privée si j\'ai la carte européenne d\'assurance maladie ?',
        respuesta: 'La CEAM ne couvre que les urgences et les séjours temporaires. Les résidents ont besoin d\'une assurance privée ou d\'une convention spéciale avec la Sécurité Sociale.',
      },
      {
        pregunta: 'Puis-je souscrire une assurance sans NIE ?',
        respuesta: 'Oui, certains assureurs permettent de souscrire avec un passeport pendant que vous traitez votre NIE. C\'est courant pour les étrangers qui commencent leurs démarches depuis leur pays d\'origine.',
      },
      {
        pregunta: 'Couvrent-ils les conditions préexistantes ?',
        respuesta: 'Cela dépend de l\'assureur et du type de police. Nous vous conseillons pour trouver la meilleure option selon votre historique médical.',
      },
    ],
    ciudadesPopulares: ['madrid', 'barcelona', 'valencia', 'malaga', 'alicante'],
  },
  'abogados': {
    titulo: 'Avocats',
    subtitulo: 'Experts dans tous les domaines : famille, civil, travail, immigration',
    descripcion: 'Vous avez besoin d\'un avocat pour un divorce, un héritage, des contrats de travail, des visas ou toute question juridique. Nous vous mettons en relation avec des professionnels vérifiés qui parlent votre langue et connaissent la législation espagnole.',
    beneficios: [
      {
        titulo: 'Toutes les spécialités',
        descripcion: 'Avocats en droit de la famille, civil, travail, immigration, pénal et plus. Trouvez le bon professionnel pour votre cas.',
      },
      {
        titulo: 'Gestion complète',
        descripcion: 'Nous nous occupons de toute la documentation et des démarches auprès des autorités.',
      },
      {
        titulo: 'Suivi personnalisé',
        descripcion: 'Nous vous tenons informé de l\'état de votre dossier à tout moment.',
      },
      {
        titulo: 'Recours et appels',
        descripcion: 'En cas de problème avec votre demande, nous préparons les recours administratifs et judiciaires.',
      },
    ],
    faqs: [
      {
        pregunta: 'Combien de temps faut-il pour obtenir le NIE ?',
        respuesta: 'Le NIE peut être obtenu en 1-2 semaines avec rendez-vous. Le plus difficile est d\'obtenir le rendez-vous, où un avocat peut vous aider.',
      },
      {
        pregunta: 'Quel visa me faut-il pour vivre en Espagne ?',
        respuesta: 'Cela dépend de votre nationalité et de votre situation. Les plus courants sont : visa non lucratif, visa de travail, visa étudiant et Golden Visa.',
      },
      {
        pregunta: 'Quand puis-je demander la nationalité ?',
        respuesta: 'Généralement après 10 ans de résidence légale, bien qu\'il y ait des exceptions (2 ans pour les Latino-Américains, 1 an si marié à un(e) Espagnol(e)).',
      },
    ],
    ciudadesPopulares: ['madrid', 'barcelona', 'valencia', 'sevilla', 'malaga'],
  },
  'inmobiliarias': {
    titulo: 'Immobilier',
    subtitulo: 'Trouvez votre logement idéal en Espagne',
    descripcion: 'Acheter ou louer en Espagne en tant qu\'étranger a ses particularités. Nous travaillons avec des agences immobilières qui comprennent les besoins des étrangers et vous accompagnent tout au long du processus.',
    beneficios: [
      {
        titulo: 'Recherche personnalisée',
        descripcion: 'Nous définissons vos critères et recherchons des propriétés qui correspondent vraiment à vos besoins.',
      },
      {
        titulo: 'Connaissance locale',
        descripcion: 'Nous vous conseillons sur les meilleurs quartiers selon votre profil : familles, retraités, professionnels.',
      },
      {
        titulo: 'Gestion documentaire',
        descripcion: 'Aide avec les contrats, le NIE, l\'ouverture de compte bancaire et tout le nécessaire pour l\'achat.',
      },
      {
        titulo: 'Service après-vente',
        descripcion: 'Nous vous aidons avec les rénovations, les services publics, les charges de copropriété et plus.',
      },
    ],
    faqs: [
      {
        pregunta: 'Puis-je acheter une maison en Espagne sans être résident ?',
        respuesta: 'Oui, tout étranger peut acheter un bien en Espagne. Vous avez juste besoin d\'un NIE et d\'un compte bancaire espagnol.',
      },
      {
        pregunta: 'Combien coûte l\'achat d\'une maison en Espagne ?',
        respuesta: 'En plus du prix du bien, prévoyez 10-15% supplémentaires pour les taxes (ITP ou TVA), le notaire, le registre et l\'hypothèque.',
      },
      {
        pregunta: 'Est-il facile d\'obtenir un prêt hypothécaire en tant qu\'étranger ?',
        respuesta: 'C\'est possible, bien que les banques financent généralement un maximum de 60-70% pour les non-résidents, contre 80% pour les résidents.',
      },
    ],
    ciudadesPopulares: ['marbella', 'alicante', 'torrevieja', 'palma', 'tenerife'],
  },
  'gestorias': {
    titulo: 'Services Administratifs',
    subtitulo: 'Démarches administratives sans complications',
    descripcion: 'La bureaucratie espagnole peut être frustrante si vous ne connaissez pas le système. Un cabinet de gestion vous fait gagner du temps et vous épargne des tracas avec toutes les démarches administratives.',
    beneficios: [
      {
        titulo: 'Expérience avec les étrangers',
        descripcion: 'Ils connaissent les démarches spécifiques dont ont besoin les non-Espagnols.',
      },
      {
        titulo: 'Gain de temps',
        descripcion: 'Évitez les files d\'attente interminables et les rendez-vous impossibles à obtenir.',
      },
      {
        titulo: 'Tout-en-un',
        descripcion: 'NIE, inscription, impôts, véhicules, Sécurité Sociale... un seul interlocuteur.',
      },
      {
        titulo: 'Prix fixes',
        descripcion: 'Vous savez exactement combien vous allez payer avant de commencer.',
      },
    ],
    faqs: [
      {
        pregunta: 'Quelles démarches un cabinet de gestion peut-il effectuer ?',
        respuesta: 'Pratiquement tout : NIE, inscription, déclaration d\'impôts, inscription en tant qu\'auto-entrepreneur, immatriculation de véhicules, validation de diplômes...',
      },
      {
        pregunta: 'Est-ce cher d\'engager un cabinet de gestion ?',
        respuesta: 'Les prix varient selon la démarche. Le NIE peut coûter 50-100€, la déclaration d\'impôts 50-150€. Le gain de temps compense généralement.',
      },
      {
        pregunta: 'Dois-je être présent pour les démarches ?',
        respuesta: 'Pour certaines oui (comme le NIE), mais beaucoup peuvent être effectuées avec une procuration.',
      },
    ],
    ciudadesPopulares: ['madrid', 'barcelona', 'valencia', 'alicante', 'malaga'],
  },
};

const CIUDADES_NOMBRES: Record<string, string> = {
  'madrid': 'Madrid',
  'barcelona': 'Barcelone',
  'valencia': 'Valence',
  'malaga': 'Malaga',
  'alicante': 'Alicante',
  'sevilla': 'Séville',
  'marbella': 'Marbella',
  'torrevieja': 'Torrevieja',
  'palma': 'Palma de Majorque',
  'tenerife': 'Ténérife',
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
                  Pourquoi nous choisir ?
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
                    Villes populaires
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
