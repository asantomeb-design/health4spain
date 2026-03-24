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

const LOCALE: Locale = 'pt';
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
    titulo: 'Seguro de Saúde',
    subtitulo: 'Cobertura médica completa para estrangeiros em Espanha',
    descripcion: 'O sistema de saúde espanhol é um dos melhores do mundo, mas como estrangeiro precisa de um seguro privado para aceder sem listas de espera. Conectamos com as melhores seguradoras que oferecem apólices adaptadas a residentes internacionais.',
    beneficios: [
      {
        titulo: 'Cobertura imediata',
        descripcion: 'Sem períodos de carência. Acesso a consultas e urgências desde o primeiro dia.',
      },
      {
        titulo: 'Ampla rede médica',
        descripcion: 'Milhares de profissionais e centros médicos em toda a Espanha à sua disposição.',
      },
      {
        titulo: 'Atendimento multilingue',
        descripcion: 'Médicos e pessoal de saúde que falam inglês, alemão, francês e mais.',
      },
      {
        titulo: 'Repatriação incluída',
        descripcion: 'Cobertura de transferência para o seu país de origem em caso de necessidade.',
      },
    ],
    faqs: [
      {
        pregunta: 'Preciso de seguro privado se tenho o Cartão Europeu de Saúde?',
        respuesta: 'O CESD só cobre urgências e estadias temporárias. Os residentes precisam de seguro privado ou de um convénio especial com a Segurança Social.',
      },
      {
        pregunta: 'Posso contratar seguro sem NIE?',
        respuesta: 'Sim, algumas seguradoras permitem a subscrição com passaporte enquanto trata do seu NIE.',
      },
      {
        pregunta: 'Cobrem condições pré-existentes?',
        respuesta: 'Depende da seguradora e do tipo de apólice. Aconselhamos para encontrar a melhor opção com base no seu histórico médico.',
      },
    ],
    ciudadesPopulares: ['madrid', 'barcelona', 'valencia', 'malaga', 'alicante'],
  },
  'abogados': {
    titulo: 'Advogados',
    subtitulo: 'Especialistas em todas as áreas: família, civil, trabalho, imigração',
    descripcion: 'Precisa de um advogado para divórcio, heranças, contratos de trabalho, vistos ou qualquer questão legal. Conectamos com profissionais verificados que falam o seu idioma e conhecem a legislação espanhola.',
    beneficios: [
      {
        titulo: 'Todas as especialidades',
        descripcion: 'Advogados em família, civil, trabalho, imigração, penal e mais. Encontre o profissional certo para o seu caso.',
      },
      {
        titulo: 'Gestão completa',
        descripcion: 'Tratamos de toda a documentação e trâmites junto das autoridades.',
      },
      {
        titulo: 'Acompanhamento personalizado',
        descripcion: 'Mantemos informado sobre o estado do seu processo a todo momento.',
      },
      {
        titulo: 'Recursos e apelações',
        descripcion: 'Se houver problemas com o seu pedido, preparamos recursos administrativos e judiciais.',
      },
    ],
    faqs: [
      {
        pregunta: 'Quanto tempo demora obter o NIE?',
        respuesta: 'O NIE pode ser obtido em 1-2 semanas com marcação. O mais difícil é conseguir a marcação, onde um advogado pode ajudar.',
      },
      {
        pregunta: 'Que visto preciso para viver em Espanha?',
        respuesta: 'Depende da sua nacionalidade e situação. Os mais comuns são: visto não lucrativo, visto de trabalho, visto de estudante e Golden Visa.',
      },
      {
        pregunta: 'Quando posso pedir a nacionalidade?',
        respuesta: 'Geralmente após 10 anos de residência legal, embora haja exceções (2 anos para latino-americanos, 1 ano se casado com espanhol/a).',
      },
    ],
    ciudadesPopulares: ['madrid', 'barcelona', 'valencia', 'sevilla', 'malaga'],
  },
  'inmobiliarias': {
    titulo: 'Imobiliárias',
    subtitulo: 'Encontre o seu lar ideal em Espanha',
    descripcion: 'Comprar ou alugar em Espanha sendo estrangeiro tem as suas particularidades. Trabalhamos com imobiliárias que entendem as necessidades dos estrangeiros e acompanham em todo o processo.',
    beneficios: [
      {
        titulo: 'Pesquisa personalizada',
        descripcion: 'Definimos os seus critérios e procuramos propriedades que realmente se adequem às suas necessidades.',
      },
      {
        titulo: 'Conhecimento local',
        descripcion: 'Aconselhamos sobre as melhores zonas para o seu perfil: famílias, reformados, profissionais.',
      },
      {
        titulo: 'Gestão documental',
        descripcion: 'Ajuda com contratos, NIE, abertura de conta bancária e tudo o necessário para a compra.',
      },
      {
        titulo: 'Pós-venda',
        descripcion: 'Ajudamos com reformas, serviços públicos, condomínio e mais.',
      },
    ],
    faqs: [
      {
        pregunta: 'Posso comprar casa em Espanha sem ser residente?',
        respuesta: 'Sim, qualquer estrangeiro pode comprar propriedade em Espanha. Só precisa de um NIE e uma conta bancária espanhola.',
      },
      {
        pregunta: 'Quanto custa comprar casa em Espanha?',
        respuesta: 'Além do preço do imóvel, calcule 10-15% adicionais para impostos (ITP ou IVA), notário, registo e hipoteca.',
      },
      {
        pregunta: 'É fácil obter hipoteca sendo estrangeiro?',
        respuesta: 'É possível, embora os bancos geralmente financiem no máximo 60-70% para não residentes, contra 80% para residentes.',
      },
    ],
    ciudadesPopulares: ['marbella', 'alicante', 'torrevieja', 'palma', 'tenerife'],
  },
  'gestorias': {
    titulo: 'Assessorias',
    subtitulo: 'Procedimentos administrativos sem complicações',
    descripcion: 'A burocracia espanhola pode ser frustrante se não conhece o sistema. Uma assessoria poupa tempo e dores de cabeça com todos os procedimentos administrativos.',
    beneficios: [
      {
        titulo: 'Experiência com estrangeiros',
        descripcion: 'Conhecem os procedimentos específicos que os não-espanhóis necessitam.',
      },
      {
        titulo: 'Poupança de tempo',
        descripcion: 'Evite filas intermináveis e marcações impossíveis de conseguir.',
      },
      {
        titulo: 'Tudo num só',
        descripcion: 'NIE, registo, impostos, veículos, Segurança Social... um único interlocutor.',
      },
      {
        titulo: 'Preços fixos',
        descripcion: 'Sabe exatamente quanto vai pagar antes de começar.',
      },
    ],
    faqs: [
      {
        pregunta: 'Que procedimentos pode uma assessoria tratar?',
        respuesta: 'Praticamente tudo: NIE, registo, declaração de impostos, registo como autónomo, matrícula de veículos, validação de diplomas...',
      },
      {
        pregunta: 'É caro contratar uma assessoria?',
        respuesta: 'Os preços variam conforme o procedimento. O NIE pode custar 50-100€, a declaração de impostos 50-150€. A poupança de tempo geralmente compensa.',
      },
      {
        pregunta: 'Preciso estar presente para os procedimentos?',
        respuesta: 'Para alguns sim (como o NIE), mas muitos podem ser feitos com procuração.',
      },
    ],
    ciudadesPopulares: ['madrid', 'barcelona', 'valencia', 'alicante', 'malaga'],
  },
};

const CIUDADES_NOMBRES: Record<string, string> = {
  'madrid': 'Madrid',
  'barcelona': 'Barcelona',
  'valencia': 'Valência',
  'malaga': 'Málaga',
  'alicante': 'Alicante',
  'sevilla': 'Sevilha',
  'marbella': 'Marbella',
  'torrevieja': 'Torrevieja',
  'palma': 'Palma de Maiorca',
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
                  Porquê escolher-nos?
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
                    Cidades populares
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
