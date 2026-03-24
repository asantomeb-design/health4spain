/**
 * Generates locale page files for en, fr, de, pt based on the Spanish (/es/) pages.
 * Each page is adapted with the correct locale, translated routes, and dictionary references.
 */
const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '..', 'src', 'app');

const ROUTES = {
  es: { home: '', destinations: 'destinos', services: 'servicios', about: 'sobre-nosotros', contact: 'contacto', request: 'solicitar', blog: 'blog', professionals: 'profesionales', quote: 'presupuesto', privacy: 'privacidad', terms: 'terminos', cookies: 'cookies', sitemap: 'sitemap-html' },
  en: { home: '', destinations: 'destinations', services: 'services', about: 'about-us', contact: 'contact', request: 'request', blog: 'blog', professionals: 'professionals', quote: 'quote', privacy: 'privacy', terms: 'terms', cookies: 'cookies', sitemap: 'sitemap' },
  fr: { home: '', destinations: 'destinations', services: 'services', about: 'a-propos', contact: 'contact', request: 'demande', blog: 'blog', professionals: 'professionnels', quote: 'devis', privacy: 'confidentialite', terms: 'conditions', cookies: 'cookies', sitemap: 'plan-du-site' },
  de: { home: '', destinations: 'reiseziele', services: 'dienstleistungen', about: 'ueber-uns', contact: 'kontakt', request: 'anfrage', blog: 'blog', professionals: 'fachleute', quote: 'angebot', privacy: 'datenschutz', terms: 'agb', cookies: 'cookies', sitemap: 'seitenplan' },
  pt: { home: '', destinations: 'destinos', services: 'servicos', about: 'sobre-nos', contact: 'contacto', request: 'solicitar', blog: 'blog', professionals: 'profissionais', quote: 'orcamento', privacy: 'privacidade', terms: 'termos', cookies: 'cookies', sitemap: 'mapa-do-site' },
};

const LOCALES = ['en', 'fr', 'de', 'pt'];

function mkdirp(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  mkdirp(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  Created: ${path.relative(APP_DIR, filePath)}`);
}

// ── Layout for each locale ──────────────────────────────────────────────
function generateLayout(locale) {
  return `import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import BackToTop from "@/components/BackToTop";
import CookieConsent from "@/components/CookieConsent";

export default function Layout${locale.toUpperCase()}({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer locale="${locale}" />
      <StickyCTA />
      <BackToTop />
      <CookieConsent lang="${locale}" />
    </>
  );
}
`;
}

// ── not-found for each locale ────────────────────────────────────────────
function generateNotFound(locale) {
  const r = ROUTES[locale];
  return `import Link from 'next/link';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';

const locale: Locale = '${locale}';
const t = getDictionary(locale);

export default function NotFound${locale.toUpperCase()}() {
  return (
    <div className="section min-h-[70vh] flex items-center justify-center">
      <div className="container-narrow text-center">
        <div className="text-[12rem] md:text-[16rem] font-bold text-gray-200 leading-none mb-8">
          404
        </div>
        <h1 className="mb-6">{t.notFound.title}</h1>
        <p className="text-[1.3rem] text-gray-600 leading-relaxed mb-12 max-w-[600px] mx-auto">
          {t.notFound.desc}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/${locale}" className="btn-minimal-lg">
            {t.notFound.backHome}
          </Link>
          <Link href="/${locale}/${r.request}" className="inline-block border-2 border-[#293f92] text-[#293f92] py-3 px-8 no-underline font-medium uppercase tracking-wider text-[0.85rem] transition-all hover:bg-[#293f92] hover:text-white">
            {t.notFound.contactUs}
          </Link>
        </div>
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-6">{t.notFound.popularPages}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/${locale}/${r.destinations}" className="text-accent hover:underline text-sm uppercase tracking-wider font-medium">{t.nav.destinations}</Link>
            <Link href="/${locale}/${r.services}" className="text-accent hover:underline text-sm uppercase tracking-wider font-medium">{t.nav.services}</Link>
            <Link href="/${locale}/${r.blog}" className="text-accent hover:underline text-sm uppercase tracking-wider font-medium">{t.nav.blog}</Link>
            <Link href="/${locale}/${r.about}" className="text-accent hover:underline text-sm uppercase tracking-wider font-medium">{t.nav.about}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
`;
}

// ── Home page ────────────────────────────────────────────────────────────
function generateHomePage(locale) {
  const r = ROUTES[locale];
  return `import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { HERO_IMAGES, LOGO_PATHS } from '@/lib/constants';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';

const locale: Locale = '${locale}';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.home.metaTitle,
  description: t.home.metaDesc,
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
      <section className="hero-with-image">
        <div className="absolute inset-0 z-0">
          <Image src={HERO_IMAGES.home} alt="" fill priority fetchPriority="high" sizes="100vw" className="object-cover object-center" />
        </div>
        <div className="hero-content-box">
          <Image src={LOGO_PATHS.vertical} alt="Health 4 Spain" height={100} width={150} className="h-20 md:h-24 w-auto mb-5" priority fetchPriority="high" />
          <h1 className="mb-6" style={{ lineHeight: '0.95' }} dangerouslySetInnerHTML={{ __html: t.home.heroTitle.replace('\\n', '<br />') }} />
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">{t.home.heroSubtitle}</p>
          <div className="flex gap-6 md:gap-10 mb-8 pt-6 border-t border-gray-300">
            <div><div className="text-3xl md:text-4xl font-bold text-accent mb-2">150+</div><div className="text-xs uppercase tracking-widest text-gray-500">{t.home.professionals}</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-accent mb-2">19</div><div className="text-xs uppercase tracking-widest text-gray-500">{t.home.cities}</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-accent mb-2">0€</div><div className="text-xs uppercase tracking-widest text-gray-500">{t.home.cost}</div></div>
          </div>
          <Link href="/${locale}/${r.request}" className="btn-minimal-lg">{t.home.requestInfo}</Link>
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
              <Link key={s.id} href={\`/${locale}/${r.request}?servicio=\${s.id}\`} className="service-card">
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
              <Link key={a.id} href={\`/${locale}/${r.request}?perfil=\${a.id}\`} className="profile-card">
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
                <Link key={c.slug} href={\`/${locale}/${r.request}?ciudad=\${c.slug}\`}>{c.nombre} <span>{t.home.request} →</span></Link>
              ))}
            </div>
          </div>
          <div>
            <h3>{t.home.provinceAlicante}</h3>
            <div className="destinos-lista">
              {CIUDADES_ALICANTE.map((c) => (
                <Link key={c.slug} href={\`/${locale}/${r.request}?ciudad=\${c.slug}\`}>{c.nombre} <span>{t.home.request} →</span></Link>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center mt-12">
          <Link href="/${locale}/${r.destinations}" className="text-lg font-semibold text-black border-b-2 border-accent pb-1 hover:border-b-4 transition-all inline-block">{t.home.viewAllCities} →</Link>
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
              <Link href="/${locale}/${r.request}" className="btn-minimal-white">{t.home.requestContactNow}</Link>
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
          <Link href="/${locale}/${r.request}" className="btn-minimal-lg">{t.home.requestInfoNow}</Link>
        </div>
      </section>
    </>
  );
}
`;
}

// ── Contact page ──────────────────────────────────────────────────────────
function generateContactPage(locale) {
  const r = ROUTES[locale];
  return `import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { HERO_IMAGES } from '@/lib/constants';
import Breadcrumbs from '@/components/Breadcrumbs';
import ContactoPageMarker from '@/app/es/contacto/ContactoPageMarker';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';

const locale: Locale = '${locale}';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.contact.metaTitle,
  description: t.contact.metaDesc,
};

const CONTACT_INFO = {
  email: 'contacto@health4spain.com',
  phone: '+34 912 345 678',
  phoneDisplay: '912 345 678',
  whatsapp: '34912345678',
};

export default function ContactPage() {
  return (
    <>
      <ContactoPageMarker />
      <section className="hero-with-image hero-compact">
        <div className="absolute inset-0 z-0">
          <Image src={HERO_IMAGES.contacto} alt="" fill priority fetchPriority="high" sizes="100vw" className="object-cover object-center" />
        </div>
        <div className="hero-content-box">
          <h1 className="mb-4" style={{ lineHeight: '0.95' }}>{t.contact.title}</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl">{t.contact.subtitle}</p>
          <div className="flex gap-6 md:gap-8 mb-6 pt-4 border-t border-gray-300">
            <div><div className="text-3xl md:text-4xl font-bold text-accent mb-1">24h</div><div className="text-xs uppercase tracking-widest text-gray-500">{t.contact.response}</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-accent mb-1">0€</div><div className="text-xs uppercase tracking-widest text-gray-500">{t.home.cost}</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-accent mb-1">100%</div><div className="text-xs uppercase tracking-widest text-gray-500">{t.contact.verified}</div></div>
          </div>
        </div>
      </section>

      <section className="section-alt">
        <div className="container-narrow">
          <Breadcrumbs items={[{ label: t.common.breadcrumbHome, href: '/${locale}' }, { label: t.contact.title }]} />
          <div className="bg-white border-t-3 border-accent p-8 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t.contact.howContact}</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">{t.contact.howContactDesc}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <a href={\`mailto:\${CONTACT_INFO.email}\`} className="profile-card group hover:border-accent transition-all">
              <div className="mb-4"><svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
              <h3 className="text-xl font-bold mb-2">{t.contact.email}</h3>
              <p className="text-accent text-lg mb-3">{CONTACT_INFO.email}</p>
              <p className="text-sm text-gray-600">{t.contact.emailDesc}</p>
              <div className="mt-4 text-sm text-accent group-hover:translate-x-2 transition-transform inline-flex items-center gap-1">{t.contact.sendEmail} →</div>
            </a>
            <a href={\`tel:\${CONTACT_INFO.phone}\`} className="profile-card group hover:border-accent transition-all">
              <div className="mb-4"><svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></div>
              <h3 className="text-xl font-bold mb-2">{t.contact.phone}</h3>
              <p className="text-accent text-lg mb-3">{CONTACT_INFO.phoneDisplay}</p>
              <p className="text-sm text-gray-600">{t.contact.phoneDesc}</p>
              <div className="mt-4 text-sm text-accent group-hover:translate-x-2 transition-transform inline-flex items-center gap-1">{t.contact.callNow} →</div>
            </a>
            <a href={\`https://wa.me/\${CONTACT_INFO.whatsapp}\`} target="_blank" rel="noopener noreferrer" className="profile-card group hover:border-accent transition-all">
              <div className="mb-4"><svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg></div>
              <h3 className="text-xl font-bold mb-2">{t.contact.whatsapp}</h3>
              <p className="text-accent text-lg mb-3">{CONTACT_INFO.phoneDisplay}</p>
              <p className="text-sm text-gray-600">{t.contact.whatsappDesc}</p>
              <div className="mt-4 text-sm text-accent group-hover:translate-x-2 transition-transform inline-flex items-center gap-1">{t.contact.openChat} →</div>
            </a>
            <Link href="/${locale}/${r.request}" className="profile-card group hover:border-accent transition-all">
              <div className="mb-4"><svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
              <h3 className="text-xl font-bold mb-2">{t.contact.onlineForm}</h3>
              <p className="text-accent text-lg mb-3">{t.contact.structuredRequest}</p>
              <p className="text-sm text-gray-600">{t.contact.onlineFormDesc}</p>
              <div className="mt-4 text-sm text-accent group-hover:translate-x-2 transition-transform inline-flex items-center gap-1">{t.contact.goToForm} →</div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow">
          <div className="text-center mb-16">
            <h2 className="mb-4">{t.contact.whatHappens}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.contact.whatHappensSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-8">{t.contact.ifClient}</h3>
              <div className="space-y-6">
                {t.contact.clientSteps.map((step: any) => (
                  <div key={step.num} className="flex items-start gap-4">
                    <div className="text-3xl font-bold text-[#293f92] shrink-0" style={{ lineHeight: '1' }}>{step.num}</div>
                    <div><h4 className="font-bold mb-1">{step.title}</h4><p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-8">{t.contact.ifProfessional}</h3>
              <div className="space-y-6">
                {t.contact.professionalSteps.map((step: any) => (
                  <div key={step.num} className="flex items-start gap-4">
                    <div className="text-3xl font-bold text-[#293f92] shrink-0" style={{ lineHeight: '1' }}>{step.num}</div>
                    <div><h4 className="font-bold mb-1">{step.title}</h4><p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow text-center mb-12">
          <h2 className="mb-4">{t.contact.guarantees}</h2>
        </div>
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: t.contact.free100, desc: t.contact.free100Desc },
              { title: t.contact.response24h, desc: t.contact.response24hDesc },
              { title: t.contact.verifiedProf, desc: t.contact.verifiedProfDesc },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-blue-dark pb-0">
        <div className="container-narrow pb-8 md:pb-12 text-center">
          <h2 className="mb-6" style={{ color: 'white' }}>{t.contact.needHelp}</h2>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">{t.contact.needHelpDesc}</p>
          <Link href="/${locale}/${r.request}" className="btn-minimal-white">{t.contact.fillForm}</Link>
        </div>
      </section>

      <section className="section-alt pt-0">
        <div className="container-narrow py-8 md:py-12 text-center">
          <h3 className="text-2xl font-bold mb-4">{t.contact.areProfessional}</h3>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">{t.contact.areProfessionalDesc}</p>
          <a href="mailto:contacto@health4spain.com?subject=Partner" className="inline-flex items-center justify-center px-8 py-3 bg-[#293f92] text-white border-2 border-[#293f92] hover:bg-[#1e2d6b] hover:border-[#1e2d6b] transition-all text-sm uppercase tracking-widest font-semibold">{t.contact.requestPartnerInfo}</a>
        </div>
      </section>
    </>
  );
}
`;
}

// ── Request/solicitar page ───────────────────────────────────────────────
function generateRequestPage(locale) {
  return `import { Suspense } from 'react';
import { Metadata } from 'next';
import { getCiudades } from '@/lib/ciudades';
import ContactFormClient from '@/app/es/solicitar/ContactFormClient';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';

const locale: Locale = '${locale}';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.request.metaTitle,
  description: t.request.metaDesc,
};

export default async function RequestPage() {
  const ciudades = await getCiudades();
  const ciudadesOpciones = [
    ...ciudades.map((c) => ({ id: c.slug, label: c.nombre })),
    { id: 'otra', label: 'Other' },
  ];

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ContactFormClient ciudades={ciudadesOpciones} />
    </Suspense>
  );
}
`;
}

// ── About page ───────────────────────────────────────────────────────────
function generateAboutPage(locale) {
  const r = ROUTES[locale];
  return `import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { HERO_IMAGES } from '@/lib/constants';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';

const locale: Locale = '${locale}';
const t = getDictionary(locale);

export const metadata: Metadata = { title: t.about.metaTitle, description: t.about.metaDesc };

export default function AboutPage() {
  return (
    <>
      <section className="hero-with-image hero-compact">
        <div className="absolute inset-0 z-0"><Image src={HERO_IMAGES.sobreNosotros} alt="" fill priority fetchPriority="high" sizes="100vw" className="object-cover object-center" /></div>
        <div className="hero-content-box">
          <h1 className="mb-4" style={{ lineHeight: '0.95' }}>{t.about.title}</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl">{t.about.subtitle}</p>
          <div className="flex gap-6 md:gap-8 mb-6 pt-4 border-t border-gray-300">
            <div><div className="text-3xl md:text-4xl font-bold text-accent mb-1">150+</div><div className="text-xs uppercase tracking-widest text-gray-500">{t.home.professionals}</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-accent mb-1">19</div><div className="text-xs uppercase tracking-widest text-gray-500">{t.home.cities}</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-accent mb-1">0€</div><div className="text-xs uppercase tracking-widest text-gray-500">{t.home.cost}</div></div>
          </div>
          <Link href="/${locale}/${r.request}" className="btn-minimal-lg">{t.home.requestInfo}</Link>
        </div>
      </section>

      <section className="section-alt">
        <div className="container-narrow">
          <div className="bg-white border-t-3 border-accent p-8 mb-16"><p className="text-lg md:text-xl text-gray-700 leading-relaxed">{t.about.intro}</p></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{ title: t.about.mission, desc: t.about.missionDesc }, { title: t.about.vision, desc: t.about.visionDesc }, { title: t.about.values, desc: t.about.valuesDesc }].map((item, i) => (
              <div key={i} className="profile-card text-center"><h3 className="text-2xl font-bold mb-4">{item.title}</h3><p className="text-gray-600 leading-relaxed">{item.desc}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow text-center mb-16"><h2 className="mb-6">{t.about.howWeWork}</h2><p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">{t.about.howWeWorkSubtitle}</p></div>
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="profile-card"><h3 className="text-2xl font-bold mb-6">{t.about.forYou}</h3><ul className="space-y-4">{t.about.forYouItems.map((item: string, i: number) => (<li key={i} className="flex items-start gap-3"><svg className="w-6 h-6 text-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-gray-700">{item}</span></li>))}</ul></div>
            <div className="profile-card"><h3 className="text-2xl font-bold mb-6">{t.about.forProfessionals}</h3><ul className="space-y-4">{t.about.forProfessionalItems.map((item: string, i: number) => (<li key={i} className="flex items-start gap-3"><svg className="w-6 h-6 text-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-gray-700">{item}</span></li>))}</ul></div>
          </div>
        </div>
      </section>

      <section className="section-blue-light">
        <div className="container-narrow text-center mb-16"><h2 className="mb-6">{t.about.inNumbers}</h2></div>
        <div className="container-narrow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[{ value: '150+', label: t.home.verifiedProfessionals }, { value: '19', label: t.home.spanishCities }, { value: '5+', label: t.home.availableLanguages }, { value: '0€', label: t.home.costForYou }].map((item, i) => (
              <div key={i} className="text-center"><div className="text-5xl md:text-6xl font-bold text-accent mb-2">{item.value}</div><div className="text-sm uppercase tracking-widest text-gray-500">{item.label}</div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow text-center mb-16"><h2 className="mb-6">{t.about.whyTrust}</h2></div>
        <div className="container-narrow space-y-8">
          {t.about.trustItems.map((item: any, i: number) => (
            <div key={i} className="bg-white border-t-3 border-accent p-8"><h3 className="text-xl font-bold mb-4">{item.title}</h3><p className="text-gray-600 leading-relaxed">{item.desc}</p></div>
          ))}
        </div>
      </section>

      <section className="section-blue-dark">
        <div className="container-narrow text-center">
          <h2 className="mb-8" style={{ color: 'white' }}>{t.about.readyCta}</h2>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">{t.about.readyCtaDesc}</p>
          <Link href="/${locale}/${r.request}" className="btn-minimal-white">{t.about.startNow}</Link>
        </div>
      </section>
    </>
  );
}
`;
}

// ── Simple legal pages (privacy, terms, cookies) ─────────────────────────
function generateLegalPage(locale, type) {
  const r = ROUTES[locale];
  const tKey = type; // 'privacy' | 'terms' | 'cookies'
  
  // We re-use the same Spanish content structure, only changing metadata from dictionary
  return `import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';

const locale: Locale = '${locale}';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.${tKey}.metaTitle,
  description: t.${tKey}.metaDesc,
};

export { default } from '@/app/es/${ROUTES.es[type]}/page';
`;
}

// ── Destinations page ────────────────────────────────────────────────────
function generateDestinationsPage(locale) {
  const r = ROUTES[locale];
  return `import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getCiudades } from '@/lib/ciudades';
import { HERO_IMAGES } from '@/lib/constants';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';

const locale: Locale = '${locale}';
const t = getDictionary(locale);

export const metadata: Metadata = { title: t.destinations.metaTitle, description: t.destinations.metaDesc };

export default async function DestinationsPage() {
  const ciudades = await getCiudades();
  const porComunidad = ciudades.reduce<Record<string, { nombre: string; slug: string; provincia: string; porcentaje_extranjeros?: number }[]>>((acc, c) => {
    const zona = c.comunidad || 'Otras';
    if (!acc[zona]) acc[zona] = [];
    acc[zona].push({ nombre: c.nombre, slug: c.slug, provincia: c.provincia || '', porcentaje_extranjeros: c.porcentaje_extranjeros });
    return acc;
  }, {});
  const regiones = Object.entries(porComunidad);

  return (
    <>
      <section className="hero-with-image hero-compact">
        <div className="absolute inset-0 z-0"><Image src={HERO_IMAGES.destinos} alt="" fill priority fetchPriority="high" sizes="100vw" className="object-cover object-center" /></div>
        <div className="hero-content-box">
          <h1 className="mb-4" style={{ lineHeight: '0.95' }}>{t.destinations.title}</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl">{ciudades.length} cities</p>
          <Link href="/${locale}/${r.request}" className="btn-minimal-lg">{t.home.requestInfo}</Link>
        </div>
      </section>

      <section className="section-alt">
        <div className="container-narrow space-y-12">
          <Breadcrumbs items={[{ label: t.common.breadcrumbHome, href: '/${locale}' }, { label: t.destinations.title }]} />
          {regiones.map(([zona, ciudadesZona], regionIndex) => (
            <div key={zona}>
              <h2 className="mb-4 pb-3 border-b-2 border-accent inline-block">{zona}</h2>
              <div className="mt-6 space-y-0">
                {ciudadesZona.map((ciudad) => (
                  <Link key={ciudad.slug} href={\`/${locale}/${r.request}?ciudad=\${ciudad.slug}\`} className="group flex justify-between items-center py-4 border-b border-gray-300 hover:bg-white hover:pl-3 transition-all">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold mb-0.5">{ciudad.nombre}</h3>
                      {ciudad.porcentaje_extranjeros && <p className="text-xs md:text-sm text-gray-500">{ciudad.porcentaje_extranjeros}%</p>}
                    </div>
                    <span className="service-arrow group-hover:translate-x-2 transition-transform text-sm">{t.home.request} →</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section text-center">
        <div className="container-narrow">
          <h2 className="mb-4">{t.home.readyToStart}</h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{t.home.readyToStartDesc}</p>
          <Link href="/${locale}/${r.request}" className="btn-minimal-lg">{t.home.requestInfoNow}</Link>
        </div>
      </section>
    </>
  );
}
`;
}

// ── Services page ────────────────────────────────────────────────────────
function generateServicesPage(locale) {
  const r = ROUTES[locale];
  return `import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getServicios } from '@/lib/services';
import { HERO_IMAGES } from '@/lib/constants';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';

const locale: Locale = '${locale}';
const t = getDictionary(locale);

export const metadata: Metadata = { title: t.servicesPage.metaTitle, description: t.servicesPage.metaDesc };

export default async function ServicesPage() {
  const servicios = await getServicios();
  return (
    <>
      <section className="hero-with-image hero-compact">
        <div className="absolute inset-0 z-0"><Image src={HERO_IMAGES.servicios} alt="" fill priority fetchPriority="high" sizes="100vw" className="object-cover object-center" /></div>
        <div className="hero-content-box">
          <h1 className="mb-4" style={{ lineHeight: '0.95' }}>{t.servicesPage.title}</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl">{t.home.servicesSubtitle}</p>
          <Link href="/${locale}/${r.request}" className="btn-minimal-lg">{t.home.requestInfo}</Link>
        </div>
      </section>

      <section className="section-alt">
        <div className="container-narrow">
          <Breadcrumbs items={[{ label: t.common.breadcrumbHome, href: '/${locale}' }, { label: t.servicesPage.title }]} />
          <ul className="service-list-minimal">
            {servicios.map((servicio, index) => {
              const numero = String(index + 1).padStart(2, '0');
              return (
                <li key={servicio.slug}>
                  <Link href={\`/${locale}/${r.request}?servicio=\${servicio.slug}\`} className="service-item-minimal block w-full hover:bg-white hover:pl-4 transition-all group">
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
          <Link href="/${locale}/${r.request}" className="btn-minimal-lg">{t.home.requestInfoNow}</Link>
        </div>
      </section>
    </>
  );
}
`;
}

// ── Blog page ────────────────────────────────────────────────────────────
function generateBlogPage(locale) {
  return `import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';

const locale: Locale = '${locale}';
const t = getDictionary(locale);

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: t.blog.metaTitle, description: t.blog.metaDesc };

const categoryImages: Record<string, string> = {
  'guias-ciudad': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1200&q=80',
  'procedimientos': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80',
  'salud': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
  'finanzas': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
  'vida-espana': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
};

interface BlogPost { slug: string; title: string; excerpt: string; category: string; published_at: string; featured_image?: string; views?: number; }

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase.from('blog_posts').select('slug, title, excerpt, category, published_at, featured_image, views').eq('status', 'published').eq('lang', '${locale}').order('published_at', { ascending: false });
    if (error) { console.error('Error fetching blog posts:', error); return []; }
    return data || [];
  } catch { return []; }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const categories = Array.from(new Set(posts.map(p => p.category)));

  return (
    <>
      <section className="section-blue-dark">
        <div className="container-base">
          <h1 className="text-white mb-4">{t.blog.title}</h1>
          <p className="text-xl text-white/90 max-w-2xl">{t.blog.subtitle}</p>
        </div>
      </section>

      <section className="section-alt">
        <div className="container-base">
          {posts.length === 0 ? (
            <div className="text-center py-16"><p className="text-gray-500 text-lg">{t.blog.noArticles}</p></div>
          ) : (
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 max-w-6xl mx-auto">{t.blog.allArticles}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {posts.map((post) => {
                    const imageUrl = post.featured_image || categoryImages[post.category] || categoryImages['vida-espana'];
                    const categoryLabel = t.blog.categoryLabels[post.category] || post.category;
                    return (
                      <article key={post.slug} className="group bg-white border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors">
                        <div className="relative h-40 overflow-hidden">
                          <Image src={imageUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                          <span className="absolute top-3 left-3 bg-accent text-white px-2 py-1 text-xs uppercase tracking-wider font-semibold">{categoryLabel}</span>
                        </div>
                        <div className="p-4">
                          <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-accent transition-colors line-clamp-2">
                            <Link href={\`/${locale}/blog/\${post.slug}\`}>{post.title}</Link>
                          </h2>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{post.excerpt}</p>
                          <Link href={\`/${locale}/blog/\${post.slug}\`} className="inline-flex items-center gap-1 text-sm text-accent font-medium hover:gap-2 transition-all border-b-2 border-accent">{t.blog.readMore}</Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
`;
}

// ── Blog [slug] page ─────────────────────────────────────────────────────
function generateBlogSlugPage(locale) {
  const r = ROUTES[locale];
  return `import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';

const locale: Locale = '${locale}';
const t = getDictionary(locale);

export const dynamic = 'force-dynamic';

async function getBlogPost(slug: string) {
  const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).eq('status', 'published').eq('lang', '${locale}').single();
  if (error || !data) return null;
  await supabase.from('blog_posts').update({ views: (data.views || 0) + 1 }).eq('slug', slug);
  return data;
}

async function getRelatedPosts(category: string, currentSlug: string) {
  const { data } = await supabase.from('blog_posts').select('slug, title, category, featured_image').eq('status', 'published').eq('lang', '${locale}').eq('category', category).neq('slug', currentSlug).limit(2);
  return data || [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabase.from('blog_posts').select('title, excerpt').eq('slug', slug).eq('status', 'published').eq('lang', '${locale}').single();
  if (!data) return { title: t.blog.articleNotFound };
  return { title: \`\${data.title} | Health4Spain Blog\`, description: data.excerpt?.slice(0, 155) };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(post.category, post.slug);
  const categoryLabel = t.blog.categoryLabels[post.category] || post.category;

  return (
    <article className="section">
      <div className="container-narrow">
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/${locale}" className="hover:text-accent">{t.common.home}</Link><span>/</span>
          <Link href="/${locale}/blog" className="hover:text-accent">{t.blog.title}</Link><span>/</span>
          <span className="text-gray-900">{categoryLabel}</span>
        </nav>
        <div className="flex items-center gap-4 mb-6">
          <span className="uppercase text-[0.8rem] text-accent tracking-wider font-semibold">{categoryLabel}</span>
          <span className="text-gray-400">•</span>
          <span className="text-[0.9rem] text-gray-500">{post.views || 0} {t.blog.views}</span>
        </div>
        <h1 className="leading-[1.2] mb-6">{post.title}</h1>
        <p className="text-[1.3rem] text-gray-600 leading-relaxed mb-8 border-l-4 border-accent pl-6">{post.excerpt}</p>
        <div className="flex items-center gap-4 mb-12 pb-8 border-b border-gray-200">
          <div className="w-12 h-12 bg-[#293f92] flex items-center justify-center text-white font-bold">H4S</div>
          <div><div className="font-semibold">{post.author_name || 'Health4Spain Team'}</div><div className="text-sm text-gray-500">{t.blog.editorialTeam}</div></div>
        </div>
      </div>
      <div className="container-narrow">
        <div className="prose prose-lg max-w-none prose-headings:text-[#293f92] prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-accent" dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="mt-16 p-10 bg-gray-50 border-l-4 border-accent">
          <h3 className="text-2xl font-bold mb-4">{t.blog.needHelp}</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{t.blog.needHelpDesc}</p>
          <Link href="/${locale}/${r.request}" className="btn-minimal-lg">{t.blog.talkToExpert}</Link>
        </div>
        {relatedPosts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-200">
            <h3 className="text-2xl font-bold mb-8">{t.blog.relatedArticles}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((rp: any) => (
                <Link key={rp.slug} href={\`/${locale}/blog/\${rp.slug}\`} className="group">
                  <div className="text-xs uppercase text-accent font-semibold mb-2">{t.blog.categoryLabels[rp.category] || rp.category}</div>
                  <h4 className="text-lg font-semibold group-hover:text-accent transition-colors">{rp.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
`;
}

// ── Professionals page ───────────────────────────────────────────────────
function generateProfessionalsPage(locale) {
  const r = ROUTES[locale];
  return `import Link from 'next/link';
import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';

const locale: Locale = '${locale}';
const t = getDictionary(locale);

export const metadata: Metadata = { title: t.professionals.metaTitle, description: t.professionals.metaDesc };

export { default } from '@/app/es/profesionales/page';
`;
}

// ── Quote page ───────────────────────────────────────────────────────────
function generateQuotePage(locale) {
  return `import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';

const locale: Locale = '${locale}';
const t = getDictionary(locale);

export const metadata: Metadata = { title: t.quote.metaTitle, description: t.quote.metaDesc };

export { default } from '@/app/es/presupuesto/page';
`;
}

// ── Destinations [slug] page ─────────────────────────────────────────────
function generateDestinationsSlugPage(locale) {
  return `export { default, generateMetadata, generateStaticParams } from '@/app/es/destinos/[slug]/page';
export { revalidate } from '@/app/es/destinos/[slug]/page';
`;
}

// ── Services [slug] page ─────────────────────────────────────────────────
function generateServicesSlugPage(locale) {
  return `export { default, generateMetadata, generateStaticParams } from '@/app/es/servicios/[slug]/page';
export { revalidate } from '@/app/es/servicios/[slug]/page';
`;
}

// ── Sitemap HTML page ────────────────────────────────────────────────────
function generateSitemapPage(locale) {
  return `export { default } from '@/app/es/sitemap-html/page';
export { metadata } from '@/app/es/sitemap-html/page';
`;
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN GENERATOR
// ══════════════════════════════════════════════════════════════════════════
function generate() {
  for (const locale of LOCALES) {
    const r = ROUTES[locale];
    const base = path.join(APP_DIR, locale);
    console.log(`\n=== Generating ${locale.toUpperCase()} ===`);

    // Layout
    writeFile(path.join(base, 'layout.tsx'), generateLayout(locale));

    // not-found
    writeFile(path.join(base, 'not-found.tsx'), generateNotFound(locale));

    // Home
    writeFile(path.join(base, 'page.tsx'), generateHomePage(locale));

    // Contact
    writeFile(path.join(base, r.contact, 'page.tsx'), generateContactPage(locale));

    // Request / solicitar
    writeFile(path.join(base, r.request, 'page.tsx'), generateRequestPage(locale));

    // About
    writeFile(path.join(base, r.about, 'page.tsx'), generateAboutPage(locale));

    // Destinations
    writeFile(path.join(base, r.destinations, 'page.tsx'), generateDestinationsPage(locale));
    writeFile(path.join(base, r.destinations, '[slug]', 'page.tsx'), generateDestinationsSlugPage(locale));

    // Services
    writeFile(path.join(base, r.services, 'page.tsx'), generateServicesPage(locale));
    writeFile(path.join(base, r.services, '[slug]', 'page.tsx'), generateServicesSlugPage(locale));

    // Blog
    writeFile(path.join(base, r.blog, 'page.tsx'), generateBlogPage(locale));
    writeFile(path.join(base, r.blog, '[slug]', 'page.tsx'), generateBlogSlugPage(locale));

    // Professionals
    writeFile(path.join(base, r.professionals, 'page.tsx'), generateProfessionalsPage(locale));

    // Quote
    writeFile(path.join(base, r.quote, 'page.tsx'), generateQuotePage(locale));

    // Legal pages
    writeFile(path.join(base, r.privacy, 'page.tsx'), generateLegalPage(locale, 'privacy'));
    writeFile(path.join(base, r.terms, 'page.tsx'), generateLegalPage(locale, 'terms'));
    writeFile(path.join(base, r.cookies, 'page.tsx'), generateLegalPage(locale, 'cookies'));

    // Sitemap HTML
    writeFile(path.join(base, r.sitemap, 'page.tsx'), generateSitemapPage(locale));
  }

  console.log('\n✅ All locale pages generated successfully!');
}

generate();
