import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'en';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.privacy.metaTitle,
  description: t.privacy.metaDesc,
  alternates: buildAlternates(locale, '/privacy'),
};

export default function PrivacyPage() {
  return (
    <div className="section">
      <div className="container-narrow">
        <h1 className="mb-12">{t.privacy.title}</h1>

        <p className="text-gray-600 mb-12">
          <strong>{t.privacy.lastUpdate}:</strong> January 2026
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="mb-6 text-2xl font-bold">1. Data Controller</h2>
            <p className="text-gray-700 leading-relaxed">
              Health4Spain is the data controller for your personal data. We are committed to protecting your privacy and ensuring the safe use of your personal information.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">2. Data We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you use our contact form, we collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number (optional)</li>
              <li>Country of origin</li>
              <li>Information about your situation and needs</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">3. Use of Your Data</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use your personal information to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Connect you with verified professionals who can help you</li>
              <li>Respond to your enquiries</li>
              <li>Send you relevant information about our services</li>
              <li>Improve our services</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">4. Sharing Information</h2>
            <p className="text-gray-700 leading-relaxed">
              We share your information only with the professionals we specifically select for your case (2-3 professionals maximum). We never sell your data to third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">5. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Access your personal data</li>
              <li>Rectify incorrect data</li>
              <li>Request deletion of your data</li>
              <li>Object to the processing of your data</li>
              <li>Request data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">6. Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement technical and organisational security measures to protect your data against unauthorised access, alteration, disclosure or destruction.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">7. Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              To exercise your rights or make enquiries about our privacy policy, contact us at: <a href="mailto:privacidad@health4spain.com" className="text-accent hover:underline font-medium">privacidad@health4spain.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
