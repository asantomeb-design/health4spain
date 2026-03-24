import Link from 'next/link';
import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { localePath } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'en';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.professionals.metaTitle,
  description: t.professionals.metaDesc,
  alternates: buildAlternates(locale, '/professionals'),
};

export default function ProfessionalsPage() {
  return (
    <>
      {/* Hero */}
      <section className="section">
        <div className="container-narrow text-center">
          <h1 className="mb-8">{t.professionals.title}</h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Expand your business with international clients. Join our network of verified professionals.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="section-alt">
        <div className="container-narrow">
          <div className="bg-white border-t-3 border-accent p-8">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              If you are a lawyer, insurance broker, real estate agent or administrative manager, Health4Spain can be your best source of qualified clients. You only pay for real results, with no monthly fees or minimum commitment.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Benefits For You</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            What we offer our partners
          </p>
        </div>
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Qualified Leads', desc: 'Only contacts who really need your services and are ready to hire. Pre-qualified by profile, location and specific need.' },
              { title: 'Pay per Conversion', desc: 'No monthly fees. You only pay when there is real conversion: the client hires your service. Zero risk, guaranteed results.' },
              { title: 'Verified Profile', desc: 'We highlight your experience with international clients, languages and specialities. Your verified badge generates immediate trust.' },
              { title: 'Predictable Growth', desc: 'Constant flow of potential clients. You decide how many leads you want to receive per month according to your capacity.' },
            ].map((item, i) => (
              <div key={i} className="profile-card">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{item.title}</h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professionals we seek */}
      <section className="section-blue-light">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Professionals We Seek</h2>
        </div>
        <div className="container-narrow">
          <ul className="service-list-minimal">
            {[
              { title: 'Lawyers', desc: 'Family, civil, labour, immigration and more. All specialities.' },
              { title: 'Insurance', desc: 'Private health insurance brokers valid for visas' },
              { title: 'Real Estate', desc: 'Agencies with experience in international clients' },
              { title: 'Administrative Services', desc: 'Administrative, tax and labour management for foreigners' },
            ].map((item, i) => (
              <li key={i} className="service-item-minimal py-8">
                <div className="service-number">0{i + 1}</div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">{item.title}</h3>
                  <p className="text-base md:text-lg text-gray-600">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Requirements */}
      <section className="section">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Requirements to Become a Partner</h2>
        </div>
        <div className="container-narrow">
          <div className="space-y-6">
            {[
              { title: 'Active Licences and Registration', desc: 'You must be legally registered in Spain with all required professional licences.' },
              { title: 'Experience With Foreigners', desc: 'Minimum 2 years working with international clients. Verifiable references.' },
              { title: 'Languages', desc: 'In addition to Spanish, proficiency in at least English (B2+). German or French is a plus.' },
              { title: 'Response Capacity', desc: 'Commitment to respond to leads in less than 24 hours. Professional follow-up.' },
              { title: 'Professional Liability Insurance', desc: 'Active and valid professional liability policy.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 pb-6 border-b border-gray-300 last:border-0">
                <svg className="w-6 h-6 text-accent mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-alt">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">How It Works</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Four steps to join our network
          </p>
        </div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-12">
          {[
            { num: '1', title: 'Application', desc: 'Complete the form with your professional info and specialities' },
            { num: '2', title: 'Verification', desc: 'We review licences, references and experience (2-5 days)' },
            { num: '3', title: 'Activation', desc: 'You set up your profile and start receiving qualified leads' },
            { num: '4', title: 'Conversion', desc: 'You only pay when the client hires your service' },
          ].map((item, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-number">{item.num}</div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Commissions */}
      <section className="section">
        <div className="container-narrow">
          <h2 className="mb-12 text-center">Commission Model</h2>
          <div className="bg-white border-t-3 border-accent p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-6">Pay Per Conversion</h3>
            <p className="text-gray-600 mb-8">
              You only pay when there is real conversion. Commissions vary by service:
            </p>
            <ul className="space-y-4">
              {[
                { label: 'Health Insurance', value: '15-20% of first year' },
                { label: 'Legal Services', value: '20-25% of service' },
                { label: 'Real Estate Services', value: '15-20% commission' },
                { label: 'Administrative Services', value: '25-30% of service' },
              ].map((item, i) => (
                <li key={i} className="flex justify-between items-center py-4 border-b border-gray-200 last:border-0">
                  <span className="font-medium">{item.label}</span>
                  <span className="font-bold text-accent">{item.value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-600">
              <strong>No monthly fees.</strong> No minimum commitment. No hidden costs. You only pay when we both win.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-blue-dark">
        <div className="container-narrow text-center">
          <h2 className="mb-8" style={{ color: 'white' }}>Ready to Grow Your Business?</h2>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join over 150 professionals who already trust Health4Spain to expand their portfolio of international clients.
          </p>
          <Link href={localePath(locale, 'contact')} className="btn-minimal-white">
            Request Partner Information
          </Link>
        </div>
      </section>
    </>
  );
}
