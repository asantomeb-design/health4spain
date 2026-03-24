import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'de';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.terms.metaTitle,
  description: t.terms.metaDesc,
  alternates: buildAlternates(locale, '/agb'),
};

export default function AgbPage() {
  return (
    <div className="section">
      <div className="container-narrow">
        <h1 className="mb-12">{t.terms.title}</h1>

        <p className="text-gray-600 mb-12">
          <strong>{t.terms.lastUpdate}:</strong> Januar 2026
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="mb-6 text-2xl font-bold">1. Annahme der Bedingungen</h2>
            <p className="text-gray-700 leading-relaxed">
              Durch die Nutzung von Health4Spain akzeptieren Sie diese Allgemeinen Geschäftsbedingungen. Wenn Sie mit einem Teil dieser Bedingungen nicht einverstanden sind, dürfen Sie unsere Dienstleistungen nicht nutzen.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">2. Beschreibung des Dienstes</h2>
            <p className="text-gray-700 leading-relaxed">
              Health4Spain ist eine Vermittlungsplattform, die Menschen, die sich in Spanien niederlassen möchten, mit verifizierten Fachleuten (Anwälte, Versicherungsmakler, Immobilienmakler und Verwaltungsmanager) verbindet.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">3. Für Nutzer</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Kostenloser Service:</strong> Die Nutzung von Health4Spain ist für Endnutzer völlig kostenlos.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Keine Verpflichtung:</strong> Sie sind nicht verpflichtet, einen der von uns vorgestellten Fachleute zu beauftragen.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Haftung:</strong> Health4Spain handelt ausschließlich als Vermittler. Wir sind nicht verantwortlich für die von Fachleuten erbrachten Dienstleistungen.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">4. Für Fachleute</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Verifizierung:</strong> Alle Fachleute müssen unseren Verifizierungsprozess bestehen, bevor sie Leads erhalten.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Provisionen:</strong> Fachleute zahlen eine Provision nur bei Conversion (der Nutzer beauftragt den Service).
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Berufliches Verhalten:</strong> Fachleute müssen ethische Standards einhalten und genaue Informationen liefern.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">5. Geistiges Eigentum</h2>
            <p className="text-gray-700 leading-relaxed">
              Alle Inhalte von Health4Spain, einschließlich Texte, Bilder, Logos und Design, sind durch Rechte des geistigen Eigentums geschützt.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">6. Haftungsbeschränkung</h2>
            <p className="text-gray-700 leading-relaxed">
              Health4Spain ist nicht verantwortlich für:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Die Qualität der von Fachleuten erbrachten Dienstleistungen</li>
              <li>Streitigkeiten zwischen Nutzern und Fachleuten</li>
              <li>Fehler oder Auslassungen in den bereitgestellten Informationen</li>
              <li>Indirekte oder Folgeschäden</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">7. Änderungen</h2>
            <p className="text-gray-700 leading-relaxed">
              Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu ändern. Änderungen treten unmittelbar nach der Veröffentlichung auf der Website in Kraft.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">8. Anwendbares Recht</h2>
            <p className="text-gray-700 leading-relaxed">
              Diese Bedingungen unterliegen spanischem Recht. Alle Streitigkeiten werden vor den Gerichten Spaniens beigelegt.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">9. Kontakt</h2>
            <p className="text-gray-700 leading-relaxed">
              Bei Fragen zu diesen Bedingungen kontaktieren Sie uns unter: <a href="mailto:legal@health4spain.com" className="text-accent hover:underline font-medium ml-1">legal@health4spain.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
