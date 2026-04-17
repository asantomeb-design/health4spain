import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { HERO_IMAGES } from '@/lib/constants';
import Breadcrumbs from '@/components/Breadcrumbs';
import ContactoPageMarker from '@/app/es/contacto/ContactoPageMarker';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'fr';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.contact.metaTitle,
  description: t.contact.metaDesc,
  alternates: buildAlternates(locale, '/contact'),
};

const CONTACT_INFO = {
  email: 'contacto@health4spain.com',
};

export default function ContactPage() {
  return (
    <>
      <ContactoPageMarker />
      <section className="hero-with-image hero-compact">
        <div className="absolute inset-0 z-0">
          <Image src={HERO_IMAGES.contacto} alt="Contact Health4Spain" fill priority fetchPriority="high" sizes="100vw" className="object-cover object-center" />
        </div>
        <div className="hero-content-box">
          <h1 className="mb-4" style={{ lineHeight: '0.95' }}>{t.contact.heroTitle}</h1>
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
          <Breadcrumbs items={[{ label: t.common.breadcrumbHome, href: '/fr' }, { label: t.contact.title }]} />
          <div className="bg-white border-t-3 border-accent p-8 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t.contact.howContact}</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">{t.contact.howContactDesc}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <a href={`mailto:${CONTACT_INFO.email}`} className="profile-card group hover:border-accent transition-all">
              <div className="mb-4"><svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
              <h3 className="text-xl font-bold mb-2">{t.contact.email}</h3>
              <p className="text-accent text-lg mb-3">{CONTACT_INFO.email}</p>
              <p className="text-sm text-gray-600">{t.contact.emailDesc}</p>
              <div className="mt-4 text-sm text-accent group-hover:translate-x-2 transition-transform inline-flex items-center gap-1">{t.contact.sendEmail} →</div>
            </a>
            <Link href="/fr/demande" className="profile-card group hover:border-accent transition-all">
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
          <Link href="/fr/demande" className="btn-minimal-white">{t.contact.fillForm}</Link>
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
