import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'de';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.cookies.metaTitle,
  description: t.cookies.metaDesc,
  alternates: buildAlternates(locale, '/cookies'),
};

export default function CookiesPage() {
  return (
    <div className="section">
      <div className="container-narrow">
        <h1 className="mb-12">{t.cookies.title}</h1>

        <p className="text-gray-600 mb-12">
          <strong>{t.cookies.lastUpdate}:</strong> Januar 2026
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="mb-6 text-2xl font-bold">Was sind Cookies?</h2>
            <p className="text-gray-700 leading-relaxed">
              Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie unsere Website besuchen. Sie helfen uns, Ihre Erfahrung zu verbessern und zu verstehen, wie Sie unsere Website nutzen.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Cookies, die wir verwenden</h2>

            <div className="mb-8">
              <h3 className="font-semibold text-xl mb-3">Essenzielle Cookies</h3>
              <p className="text-gray-700 leading-relaxed">
                Diese Cookies sind für die grundlegende Funktionalität der Website erforderlich. Sie können nicht deaktiviert werden.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
                <li>Sitzungs-Cookies</li>
                <li>Spracheinstellungs-Cookies</li>
                <li>Sicherheits-Cookies</li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-xl mb-3">Analyse-Cookies</h3>
              <p className="text-gray-700 leading-relaxed">
                Wir verwenden diese Cookies, um zu verstehen, wie Besucher mit unserer Website interagieren.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
                <li>Google Analytics (falls aktiviert)</li>
                <li>Performance-Tracking-Cookies</li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-xl mb-3">Marketing-Cookies</h3>
              <p className="text-gray-700 leading-relaxed">
                Diese Cookies helfen uns, relevante Inhalte anzuzeigen und die Wirksamkeit unserer Kampagnen zu messen.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Cookie-Verwaltung</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Sie können Ihre Einwilligung jederzeit über den Link &quot;Cookie-Einwilligung ändern&quot; in der Fußzeile unserer Website ändern.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Sie können Cookies auch nach Belieben kontrollieren und/oder löschen. Sie können alle bereits auf Ihrem Gerät vorhandenen Cookies löschen und die meisten Browser so einstellen, dass sie blockiert werden.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Bitte beachten Sie, dass Sie möglicherweise nicht alle Funktionen unserer Website nutzen können, wenn Sie Cookies löschen oder Cookies von Drittanbietern nicht akzeptieren.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Cookies von Drittanbietern</h2>
            <p className="text-gray-700 leading-relaxed">
              Wir verwenden Dienste von Drittanbietern, die Cookies auf Ihrem Gerät setzen können:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Google Analytics für Webanalyse</li>
              <li>Social-Media-Plattformen zum Teilen von Inhalten</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Aktualisierungen dieser Richtlinie</h2>
            <p className="text-gray-700 leading-relaxed">
              Wir können diese Cookie-Richtlinie regelmäßig aktualisieren. Wir empfehlen, sie regelmäßig zu überprüfen, um über unsere Cookie-Nutzung informiert zu bleiben.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Kontakt</h2>
            <p className="text-gray-700 leading-relaxed">
              Bei Fragen zu unserer Cookie-Richtlinie kontaktieren Sie uns unter: <a href="mailto:info@health4spain.com" className="text-accent hover:underline font-medium ml-1">info@health4spain.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
