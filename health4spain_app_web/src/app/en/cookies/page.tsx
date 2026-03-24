import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'en';
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
          <strong>{t.cookies.lastUpdate}:</strong> January 2026
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="mb-6 text-2xl font-bold">What are cookies?</h2>
            <p className="text-gray-700 leading-relaxed">
              Cookies are small text files that are stored on your device when you visit our website. They help us improve your experience and understand how you use our site.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Cookies we use</h2>

            <div className="mb-8">
              <h3 className="font-semibold text-xl mb-3">Essential Cookies</h3>
              <p className="text-gray-700 leading-relaxed">
                These cookies are necessary for the basic functioning of the website. They cannot be disabled.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
                <li>Session cookies</li>
                <li>Language preference cookies</li>
                <li>Security cookies</li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-xl mb-3">Analytics Cookies</h3>
              <p className="text-gray-700 leading-relaxed">
                We use these cookies to understand how visitors interact with our site.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
                <li>Google Analytics (if enabled)</li>
                <li>Performance tracking cookies</li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-xl mb-3">Marketing Cookies</h3>
              <p className="text-gray-700 leading-relaxed">
                These cookies help us show relevant content and measure the effectiveness of our campaigns.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Managing cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You can modify your consent at any time using the &quot;Modify cookie consent&quot; link in the footer of our website.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              You can also control and/or delete cookies as you wish. You can delete all cookies already on your device and configure most browsers to block them.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Please note that if you delete cookies or do not accept third-party cookies, you may not be able to use all the features of our website.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Third-party cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              We use third-party services that may set cookies on your device:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Google Analytics for web analytics</li>
              <li>Social media platforms for content sharing</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Updates to this policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this cookie policy periodically. We recommend that you review it regularly to stay informed about how we use cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about our cookie policy, contact us at: <a href="mailto:info@health4spain.com" className="text-accent hover:underline font-medium ml-1">info@health4spain.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
