import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'de';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.privacy.metaTitle,
  description: t.privacy.metaDesc,
  alternates: buildAlternates(locale, '/datenschutz'),
};

export default function DatenschutzPage() {
  return (
    <div className="section">
      <div className="container-narrow">
        <h1 className="mb-12">{t.privacy.title}</h1>

        <p className="text-gray-600 mb-12">
          <strong>{t.privacy.lastUpdate}:</strong> Januar 2026
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="mb-6 text-2xl font-bold">1. Verantwortlicher</h2>
            <p className="text-gray-700 leading-relaxed">
              Health4Spain ist der Verantwortliche für Ihre personenbezogenen Daten. Wir verpflichten uns, Ihre Privatsphäre zu schützen und die sichere Nutzung Ihrer persönlichen Daten zu gewährleisten.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">2. Daten, Die Wir Erheben</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Wenn Sie unser Kontaktformular nutzen, erheben wir:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Vollständiger Name</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer (optional)</li>
              <li>Herkunftsland</li>
              <li>Informationen über Ihre Situation und Bedürfnisse</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">3. Verwendung Ihrer Daten</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Wir verwenden Ihre personenbezogenen Daten für:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Vermittlung mit verifizierten Fachleuten, die Ihnen helfen können</li>
              <li>Beantwortung Ihrer Anfragen</li>
              <li>Zusendung relevanter Informationen über unsere Dienstleistungen</li>
              <li>Verbesserung unserer Dienstleistungen</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">4. Weitergabe von Informationen</h2>
            <p className="text-gray-700 leading-relaxed">
              Wir geben Ihre Informationen nur an die Fachleute weiter, die wir speziell für Ihren Fall auswählen (maximal 2-3 Fachleute). Wir verkaufen Ihre Daten niemals an Dritte zu Marketingzwecken.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">5. Ihre Rechte</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Sie haben das Recht auf:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Zugang zu Ihren personenbezogenen Daten</li>
              <li>Berichtigung falscher Daten</li>
              <li>Löschung Ihrer Daten</li>
              <li>Widerspruch gegen die Verarbeitung Ihrer Daten</li>
              <li>Datenübertragbarkeit</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">6. Sicherheit</h2>
            <p className="text-gray-700 leading-relaxed">
              Wir implementieren technische und organisatorische Sicherheitsmaßnahmen, um Ihre Daten vor unbefugtem Zugriff, Änderung, Offenlegung oder Zerstörung zu schützen.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">7. Kontakt</h2>
            <p className="text-gray-700 leading-relaxed">
              Um Ihre Rechte auszuüben oder Fragen zu unserer Datenschutzrichtlinie zu stellen, kontaktieren Sie uns unter: <a href="mailto:privacidad@health4spain.com" className="text-accent hover:underline font-medium">privacidad@health4spain.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
