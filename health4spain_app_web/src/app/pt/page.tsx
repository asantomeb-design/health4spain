import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { HERO_IMAGES, LOGO_PATHS } from '@/lib/constants';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { organizationJsonLd, websiteJsonLd, JsonLd, buildAlternates } from '@/lib/seo';

const locale: Locale = 'pt';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.home.metaTitle,
  description: t.home.metaDesc,
  alternates: buildAlternates(locale, ''),
};

const SERVICIOS = [
  { id: 'seguros', number: '01', titleKey: 'insurance' as const, descKey: 'insuranceDesc' as const },
  { id: 'abogados', number: '02', titleKey: 'lawyers' as const, descKey: 'lawyersDesc' as const },
  { id: 'inmobiliarias', number: '03', titleKey: 'realEstate' as const, descKey: 'realEstateDesc' as const },
  { id: 'gestorias', number: '04', titleKey: 'admin' as const, descKey: 'adminDesc' as const },
];

const AUDIENCIAS = [
  { id: 'jubilados', labelKey: 'retirees' as const, descKey: 'retireesDesc' as const },
  { id: 'trabajadores', labelKey: 'workers' as const, descKey: 'workersDesc' as const },
  { id: 'inversores', labelKey: 'investors' as const, descKey: 'investorsDesc' as const },
  { id: 'estudiantes', labelKey: 'students' as const, descKey: 'studentsDesc' as const },
];

const CIUDADES_MURCIA = [
  { slug: 'murcia', nombre: 'Murcia' },
  { slug: 'cartagena', nombre: 'Cartagena' },
  { slug: 'lorca', nombre: 'Lorca' },
  { slug: 'mazarron', nombre: 'Mazarrón' },
  { slug: 'torre-pacheco', nombre: 'Torre Pacheco' },
  { slug: 'san-javier', nombre: 'San Javier' },
  { slug: 'san-pedro-pinatar', nombre: 'San Pedro del Pinatar' },
  { slug: 'molina-de-segura', nombre: 'Molina de Segura' },
  { slug: 'aguilas', nombre: 'Águilas' },
  { slug: 'cieza', nombre: 'Cieza' },
  { slug: 'jumilla', nombre: 'Jumilla' },
  { slug: 'yecla', nombre: 'Yecla' },
];

const CIUDADES_ALICANTE = [
  { slug: 'alicante', nombre: 'Alicante' },
  { slug: 'elche', nombre: 'Elche' },
  { slug: 'torrevieja', nombre: 'Torrevieja' },
  { slug: 'orihuela', nombre: 'Orihuela' },
  { slug: 'rojales', nombre: 'Rojales' },
  { slug: 'benidorm', nombre: 'Benidorm' },
  { slug: 'denia', nombre: 'Denia' },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd(locale)} />
      <section className="hero-with-image">
        <div className="absolute inset-0 z-0">
          <Image src={HERO_IMAGES.home} alt="Health4Spain - Espanha simplificada para estrangeiros" fill priority fetchPriority="high" sizes="100vw" className="object-cover object-center" />
        </div>
        <div className="hero-content-box">
          <Image src={LOGO_PATHS.vertical} alt="Health 4 Spain" height={100} width={150} className="h-20 md:h-24 w-auto mb-5" priority fetchPriority="high" />
          <h1 className="mb-6" style={{ lineHeight: '0.95' }} dangerouslySetInnerHTML={{ __html: t.home.heroTitle.replace('\n', '<br />') }} />
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">{t.home.heroSubtitle}</p>
          <div className="flex gap-6 md:gap-10 mb-8 pt-6 border-t border-gray-300">
            <div><div className="text-3xl md:text-4xl font-bold text-accent mb-2">150+</div><div className="text-xs uppercase tracking-widest text-gray-500">{t.home.professionals}</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-accent mb-2">19</div><div className="text-xs uppercase tracking-widest text-gray-500">{t.home.cities}</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-accent mb-2">0€</div><div className="text-xs uppercase tracking-widest text-gray-500">{t.home.cost}</div></div>
          </div>
          <Link href="/pt/solicitar" className="btn-minimal-lg">{t.home.requestInfo}</Link>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">{t.home.servicesTitle}</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">{t.home.servicesSubtitle}</p>
        </div>
        <div className="container-narrow">
          <div className="service-grid-2x2">
            {SERVICIOS.map((s) => (
              <Link key={s.id} href={`/pt/solicitar?servicio=${s.id}`} className="service-card">
                <div className="service-number">{s.number}</div>
                <h3>{t.services[s.titleKey]}</h3>
                <p>{t.services[s.descKey]}</p>
                <span className="service-arrow">{t.home.request} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-blue-light">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">{t.home.whoAreYou}</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">{t.home.whoAreYouSubtitle}</p>
        </div>
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {AUDIENCIAS.map((a) => (
              <Link key={a.id} href={`/pt/solicitar?perfil=${a.id}`} className="profile-card">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{t.audiences[a.labelKey]}</h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">{t.audiences[a.descKey]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">{t.home.ourDestinations}</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">{t.home.ourDestinationsSubtitle}</p>
        </div>
        <div className="destinos-columnas">
          <div>
            <h3>{t.home.regionMurcia}</h3>
            <div className="destinos-lista">
              {CIUDADES_MURCIA.map((c) => (
                <Link key={c.slug} href={`/pt/solicitar?ciudad=${c.slug}`}>{c.nombre} <span>{t.home.request} →</span></Link>
              ))}
            </div>
          </div>
          <div>
            <h3>{t.home.provinceAlicante}</h3>
            <div className="destinos-lista">
              {CIUDADES_ALICANTE.map((c) => (
                <Link key={c.slug} href={`/pt/solicitar?ciudad=${c.slug}`}>{c.nombre} <span>{t.home.request} →</span></Link>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center mt-12">
          <Link href="/pt/destinos" className="text-lg font-semibold text-black border-b-2 border-accent pb-1 hover:border-b-4 transition-all inline-block">{t.home.viewAllCities} →</Link>
        </div>
      </section>

      <section className="section-alt">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">{t.home.howItWorks}</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">{t.home.howItWorksSubtitle}</p>
        </div>
        <div className="timeline">
          <div className="timeline-item"><div className="timeline-number">1</div><div><h3 className="text-xl md:text-2xl font-bold mb-4">{t.home.step1Title}</h3><p className="text-base md:text-lg text-gray-600 leading-relaxed">{t.home.step1Desc}</p></div></div>
          <div className="timeline-item"><div className="timeline-number">2</div><div><h3 className="text-xl md:text-2xl font-bold mb-4">{t.home.step2Title}</h3><p className="text-base md:text-lg text-gray-600 leading-relaxed">{t.home.step2Desc}</p></div></div>
          <div className="timeline-item"><div className="timeline-number">3</div><div><h3 className="text-xl md:text-2xl font-bold mb-4">{t.home.step3Title}</h3><p className="text-base md:text-lg text-gray-600 leading-relaxed">{t.home.step3Desc}</p></div></div>
        </div>
      </section>

      <section className="section-blue-dark">
        <div className="container-base">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <h2 className="mb-8" style={{ color: 'white' }}>{t.home.whyChooseUs}</h2>
              <p className="text-lg md:text-xl text-gray-200 mb-8">{t.home.whyChooseUsDesc}</p>
              <Link href="/pt/solicitar" className="btn-minimal-white">{t.home.requestContactNow}</Link>
            </div>
            <div className="flex flex-col gap-6">
              {[
                { title: t.home.noCost, desc: t.home.noCostDesc },
                { title: t.home.response24h, desc: t.home.response24hDesc },
                { title: t.home.verifiedProfessionals, desc: t.home.verifiedProfessionalsDesc },
                { title: t.home.yourLanguage, desc: t.home.yourLanguageDesc },
              ].map((b, i) => (
                <div key={i} className="benefit-item">
                  <div className="benefit-icon">✓</div>
                  <div><div className="font-bold text-lg text-white mb-1">{b.title}</div><div className="text-gray-300">{b.desc}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-blue-light text-center">
        <div className="container-base">
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="mb-6">{t.home.ourNetwork}</h2>
            <p className="text-xl md:text-2xl text-gray-600">{t.home.ourNetworkSubtitle}</p>
          </div>
          <div className="trust-grid">
            <div className="trust-item"><div className="trust-number">150+</div><p className="trust-label">{t.home.verifiedProfessionals}</p></div>
            <div className="trust-item"><div className="trust-number">19</div><p className="trust-label">{t.home.spanishCities}</p></div>
            <div className="trust-item"><div className="trust-number">4</div><p className="trust-label">{t.home.essentialServices}</p></div>
            <div className="trust-item"><div className="trust-number">0€</div><p className="trust-label">{t.home.costForYou}</p></div>
            <div className="trust-item"><div className="trust-number">&lt;24h</div><p className="trust-label">{t.home.responseTime}</p></div>
            <div className="trust-item"><div className="trust-number">2</div><p className="trust-label">{t.home.activeRegions}</p></div>
            <div className="trust-item"><div className="trust-number">5+</div><p className="trust-label">{t.home.availableLanguages}</p></div>
            <div className="trust-item"><div className="trust-number">100%</div><p className="trust-label">{t.home.verifiedProfessionals}</p></div>
          </div>
        </div>
      </section>

      <section className="section text-center">
        <div className="container-narrow">
          <h2 className="mb-8">{t.home.readyToStart}</h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">{t.home.readyToStartDesc}</p>
          <Link href="/pt/solicitar" className="btn-minimal-lg">{t.home.requestInfoNow}</Link>
        </div>
      </section>
    </>
  );
}
