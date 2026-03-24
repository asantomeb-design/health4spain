import Link from 'next/link';
import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { localePath } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'de';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.professionals.metaTitle,
  description: t.professionals.metaDesc,
  alternates: buildAlternates(locale, '/fachleute'),
};

export default function FachleutePage() {
  return (
    <>
      <section className="section">
        <div className="container-narrow text-center">
          <h1 className="mb-8">{t.professionals.title}</h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Erweitern Sie Ihr Geschäft mit internationalen Kunden. Treten Sie unserem Netzwerk verifizierter Fachleute bei.
          </p>
        </div>
      </section>

      <section className="section-alt">
        <div className="container-narrow">
          <div className="bg-white border-t-3 border-accent p-8">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Wenn Sie Anwalt, Versicherungsmakler, Immobilienmakler oder Verwaltungsmanager sind, kann Health4Spain Ihre beste Quelle für qualifizierte Kunden sein. Sie zahlen nur für echte Ergebnisse, ohne monatliche Gebühren oder Mindestverpflichtung.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Vorteile Für Sie</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Was wir unseren Partnern bieten
          </p>
        </div>
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Qualifizierte Leads', desc: 'Nur Kontakte, die wirklich Ihre Dienstleistungen benötigen und bereit sind zu beauftragen. Vorqualifiziert nach Profil, Standort und spezifischem Bedarf.' },
              { title: 'Bezahlung bei Conversion', desc: 'Keine monatlichen Gebühren. Sie zahlen nur bei echter Conversion: Der Kunde beauftragt Ihren Service. Null Risiko, garantierte Ergebnisse.' },
              { title: 'Verifiziertes Profil', desc: 'Wir heben Ihre Erfahrung mit internationalen Kunden, Sprachen und Fachgebieten hervor. Ihr verifiziertes Abzeichen erzeugt sofortiges Vertrauen.' },
              { title: 'Vorhersehbares Wachstum', desc: 'Konstanter Strom potenzieller Kunden. Sie entscheiden, wie viele Leads Sie pro Monat je nach Kapazität erhalten möchten.' },
            ].map((item, i) => (
              <div key={i} className="profile-card">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{item.title}</h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-blue-light">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Fachleute, Die Wir Suchen</h2>
        </div>
        <div className="container-narrow">
          <ul className="service-list-minimal">
            {[
              { title: 'Anwälte', desc: 'Familie, Zivil-, Arbeits-, Ausländerrecht und mehr. Alle Fachgebiete.' },
              { title: 'Versicherungen', desc: 'Makler für private Krankenversicherung gültig für Visa' },
              { title: 'Immobilien', desc: 'Agenturen mit Erfahrung bei internationalen Kunden' },
              { title: 'Verwaltungsdienste', desc: 'Administrative, steuerliche und arbeitsrechtliche Beratung für Ausländer' },
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

      <section className="section">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Anforderungen Um Partner Zu Werden</h2>
        </div>
        <div className="container-narrow">
          <div className="space-y-6">
            {[
              { title: 'Aktive Lizenzen und Registrierung', desc: 'Sie müssen legal in Spanien mit allen erforderlichen Berufslizenzen registriert sein.' },
              { title: 'Erfahrung Mit Ausländern', desc: 'Mindestens 2 Jahre Arbeit mit internationalen Kunden. Überprüfbare Referenzen.' },
              { title: 'Sprachen', desc: 'Zusätzlich zu Spanisch Beherrschung von mindestens Englisch (B2+). Deutsch oder Französisch ist ein Plus.' },
              { title: 'Antwortfähigkeit', desc: 'Verpflichtung, Leads in weniger als 24 Stunden zu beantworten. Professionelle Nachverfolgung.' },
              { title: 'Berufshaftpflichtversicherung', desc: 'Aktive und gültige Berufshaftpflichtpolice.' },
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

      <section className="section-alt">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">So Funktioniert Es</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Vier Schritte, um unserem Netzwerk beizutreten
          </p>
        </div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-12">
          {[
            { num: '1', title: 'Bewerbung', desc: 'Füllen Sie das Formular mit Ihren beruflichen Informationen und Fachgebieten aus' },
            { num: '2', title: 'Verifizierung', desc: 'Wir prüfen Lizenzen, Referenzen und Erfahrung (2-5 Tage)' },
            { num: '3', title: 'Aktivierung', desc: 'Sie richten Ihr Profil ein und erhalten qualifizierte Leads' },
            { num: '4', title: 'Conversion', desc: 'Sie zahlen nur, wenn der Kunde Ihren Service beauftragt' },
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

      <section className="section">
        <div className="container-narrow">
          <h2 className="mb-12 text-center">Provisionsmodell</h2>
          <div className="bg-white border-t-3 border-accent p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-6">Bezahlung Bei Conversion</h3>
            <p className="text-gray-600 mb-8">
              Sie zahlen nur bei echter Conversion. Die Provisionen variieren je nach Service:
            </p>
            <ul className="space-y-4">
              {[
                { label: 'Krankenversicherung', value: '15-20% des ersten Jahres' },
                { label: 'Rechtliche Dienstleistungen', value: '20-25% des Services' },
                { label: 'Immobiliendienstleistungen', value: '15-20% Provision' },
                { label: 'Verwaltungsdienstleistungen', value: '25-30% des Services' },
              ].map((item, i) => (
                <li key={i} className="flex justify-between items-center py-4 border-b border-gray-200 last:border-0">
                  <span className="font-medium">{item.label}</span>
                  <span className="font-bold text-accent">{item.value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-600">
              <strong>Keine monatlichen Gebühren.</strong> Keine Mindestverpflichtung. Keine versteckten Kosten. Sie zahlen nur, wenn wir beide gewinnen.
            </p>
          </div>
        </div>
      </section>

      <section className="section-blue-dark">
        <div className="container-narrow text-center">
          <h2 className="mb-8" style={{ color: 'white' }}>Bereit, Ihr Geschäft Zu Erweitern?</h2>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Schließen Sie sich über 150 Fachleuten an, die Health4Spain bereits vertrauen, um ihr Portfolio internationaler Kunden zu erweitern.
          </p>
          <Link href={localePath(locale, 'contact')} className="btn-minimal-white">
            Partner-Informationen Anfordern
          </Link>
        </div>
      </section>
    </>
  );
}
