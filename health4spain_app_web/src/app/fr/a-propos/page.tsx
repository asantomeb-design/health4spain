import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { HERO_IMAGES } from '@/lib/constants';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'fr';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.about.metaTitle,
  description: t.about.metaDesc,
  alternates: buildAlternates(locale, '/a-propos'),
};

export default function AboutPage() {
  return (
    <>
      <section className="hero-with-image hero-compact">
        <div className="absolute inset-0 z-0"><Image src={HERO_IMAGES.sobreNosotros} alt="À propos de Health4Spain" fill priority fetchPriority="high" sizes="100vw" className="object-cover object-center" /></div>
        <div className="hero-content-box">
          <h1 className="mb-4" style={{ lineHeight: '0.95' }}>{t.about.title}</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl">{t.about.subtitle}</p>
          <div className="flex gap-6 md:gap-8 mb-6 pt-4 border-t border-gray-300">
            <div><div className="text-3xl md:text-4xl font-bold text-accent mb-1">150+</div><div className="text-xs uppercase tracking-widest text-gray-500">{t.home.professionals}</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-accent mb-1">19</div><div className="text-xs uppercase tracking-widest text-gray-500">{t.home.cities}</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-accent mb-1">0€</div><div className="text-xs uppercase tracking-widest text-gray-500">{t.home.cost}</div></div>
          </div>
          <Link href="/fr/demande" className="btn-minimal-lg">{t.home.requestInfo}</Link>
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
          <Link href="/fr/demande" className="btn-minimal-white">{t.about.startNow}</Link>
        </div>
      </section>
    </>
  );
}
