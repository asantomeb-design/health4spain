import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'en';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.terms.metaTitle,
  description: t.terms.metaDesc,
  alternates: buildAlternates(locale, '/terms'),
};

export default function TermsPage() {
  return (
    <div className="section">
      <div className="container-narrow">
        <h1 className="mb-12">{t.terms.title}</h1>

        <p className="text-gray-600 mb-12">
          <strong>{t.terms.lastUpdate}:</strong> January 2026
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="mb-6 text-2xl font-bold">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By using Health4Spain, you accept these terms and conditions. If you disagree with any part of these terms, you must not use our services.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed">
              Health4Spain is a connection platform that puts people who wish to settle in Spain in touch with verified professionals (lawyers, insurance brokers, real estate agents and administrative managers).
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">3. For Users</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Free Service:</strong> The use of Health4Spain is completely free for end users.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>No Commitment:</strong> You are not obliged to hire any of the professionals we present to you.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Liability:</strong> Health4Spain acts solely as an intermediary. We are not responsible for the services provided by professionals.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">4. For Professionals</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Verification:</strong> All professionals must pass our verification process before receiving leads.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Commissions:</strong> Professionals pay a commission only when there is conversion (the user hires the service).
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Professional Conduct:</strong> Professionals must maintain ethical standards and provide accurate information.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">5. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on Health4Spain, including texts, images, logos and design, is protected by intellectual property rights.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">6. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              Health4Spain is not responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>The quality of services provided by professionals</li>
              <li>Disputes between users and professionals</li>
              <li>Errors or omissions in the information provided</li>
              <li>Indirect or consequential damages</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">7. Modifications</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will take effect immediately after publication on the website.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">8. Applicable Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These terms are governed by Spanish law. Any dispute shall be resolved in the courts of Spain.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">9. Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these terms, contact us at: <a href="mailto:legal@health4spain.com" className="text-accent hover:underline font-medium ml-1">legal@health4spain.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
