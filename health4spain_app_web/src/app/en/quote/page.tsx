import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'en';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.quote.metaTitle,
  description: t.quote.metaDesc,
  alternates: buildAlternates(locale, '/quote'),
};

export default function QuotePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative py-32 px-[5%] bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-[1200px] mx-auto text-center">
          <h1 className="font-lora text-[5rem] font-bold mb-6 leading-[1.1]">
            A Website That<br/>
            <span className="text-accent">Ranks You on Google</span>
          </h1>
          <p className="text-[1.4rem] text-gray-300 leading-relaxed max-w-[800px] mx-auto mb-12">
            It&apos;s not just a pretty website. It&apos;s a lead generation machine with 76 entry points from Google (4 services × 19 cities).
          </p>
          <div className="flex gap-8 justify-center items-center text-lg">
            <div className="flex items-center gap-2">
              <span className="text-accent text-2xl">✓</span>
              <span>76 SEO Landings</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent text-2xl">✓</span>
              <span>4 Services</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent text-2xl">✓</span>
              <span>19 Cities</span>
            </div>
          </div>
        </div>
      </section>

      {/* THE SECRET: SEO */}
      <section className="py-24 px-[5%] bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-lora text-[3.5rem] font-bold mb-4 text-[#1a1a1a]">
              The Secret: Dominating Google
            </h2>
            <p className="text-xl text-gray-600 max-w-[700px] mx-auto">
              Most websites are invisible on Google. Yours won&apos;t be.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <div className="text-7xl mb-6">🎯</div>
              <h3 className="font-lora text-[2.5rem] font-bold mb-6 text-[#1a1a1a]">
                Why SEO?
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Imagine having an office on the best street, but with no sign. That&apos;s a website without SEO.
              </p>
              <div className="bg-accent/10 border-l-4 border-accent p-6 mb-6">
                <p className="text-gray-900 font-semibold mb-2">Key fact:</p>
                <p className="text-gray-700">
                  <strong>90%</strong> of people searching for insurance, lawyers, real estate or admin services in Spain start on Google. If you&apos;re not on the first page, <strong>you don&apos;t exist.</strong>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-10 rounded-lg">
              <h4 className="font-semibold text-xl mb-6 text-[#1a1a1a]">Our Strategy: Surgical SEO</h4>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <div>
                    <strong className="text-gray-900 block mb-1">Specific services</strong>
                    <p className="text-gray-600 text-sm">Insurance, Lawyers, Real Estate, Admin Services</p>
                  </div>
                </div>
                <div className="text-3xl text-center text-gray-400">×</div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold">19</div>
                  <div>
                    <strong className="text-gray-900 block mb-1">Strategic cities</strong>
                    <p className="text-gray-600 text-sm">Murcia, Alicante, Torrevieja, Cartagena, Lorca...</p>
                  </div>
                </div>
                <div className="border-t-2 border-accent pt-4 mt-6">
                  <div className="flex gap-4 items-center">
                    <div className="flex-shrink-0 w-14 h-14 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center font-bold text-xl">76</div>
                    <div>
                      <strong className="text-[#1a1a1a] text-xl block">Optimised pages</strong>
                      <p className="text-gray-600">Each targeting a specific search on Google</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OBJECTIVES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg text-center">
              <div className="text-5xl mb-4">👁️</div>
              <h4 className="font-bold text-lg mb-2 text-gray-900">Immediate Visibility</h4>
              <p className="text-gray-700 text-sm">From day 1 in hyperlocal searches</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h4 className="font-bold text-lg mb-2 text-gray-900">Qualified Traffic</h4>
              <p className="text-gray-700 text-sm">Visitors ready to hire</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg text-center">
              <div className="text-5xl mb-4">📍</div>
              <h4 className="font-bold text-lg mb-2 text-gray-900">Territorial Dominance</h4>
              <p className="text-gray-700 text-sm">Control your geographic area</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-lg text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h4 className="font-bold text-lg mb-2 text-gray-900">Competitive Advantage</h4>
              <p className="text-gray-700 text-sm">Your competition has 10 pages, you have 76</p>
            </div>
          </div>

          {/* SAVINGS */}
          <div className="bg-gradient-to-br from-accent to-accent/80 text-white p-12 rounded-2xl text-center shadow-2xl">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="font-lora text-[2.5rem] font-bold mb-4">Real Savings</h3>
            <p className="text-xl opacity-95 mb-6 max-w-[800px] mx-auto">
              An SEO campaign to rank 76 specific terms would cost you <strong>€8,000 - €24,000</strong> over 6-12 months, with no guarantees.
            </p>
            <div className="inline-block bg-white/20 backdrop-blur px-8 py-4 rounded-lg">
              <p className="text-2xl font-bold">With this structure, that work is ALREADY done</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT&apos;S INCLUDED */}
      <section className="py-24 px-[5%] bg-gray-50">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-lora text-[3.5rem] font-bold text-center mb-4 text-[#1a1a1a]">
            What Your Website Includes
          </h2>
          <p className="text-center text-xl text-gray-600 mb-16 max-w-[700px] mx-auto">
            Everything you need to generate clients from day one
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl">🎨</div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">FREE</div>
              </div>
              <h3 className="font-lora text-2xl font-bold mb-3 text-[#1a1a1a]">Professional Design</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Unique visual style, mockups until you&apos;re 100% satisfied. Like a graphic designer specialised in websites.
              </p>
              <div className="text-right">
                <span className="text-gray-400 line-through">€360</span>
                <span className="ml-2 text-green-600 font-bold text-xl">€0</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="font-lora text-2xl font-bold mb-3 text-[#1a1a1a]">Custom Development</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Bespoke code, no WordPress. Adapted for mobile, tablet and desktop. Database and navigation included.
              </p>
              <div className="text-right">
                <span className="text-[#1a1a1a] font-bold text-2xl">€320</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
              <div className="mb-4"><svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg></div>
              <h3 className="font-lora text-2xl font-bold mb-3 text-[#1a1a1a]">Premium Home</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Your main showcase. Strategic design with SEO texts and image carousel to make an impact.
              </p>
              <div className="text-right">
                <span className="text-[#1a1a1a] font-bold text-2xl">€180</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
              <div className="mb-4"><svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
              <h3 className="font-lora text-2xl font-bold mb-3 text-[#1a1a1a]">2 Extra Pages</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Two additional pages (Destinations, Services...). Coded for maximum performance. Editable by us during support.
              </p>
              <div className="text-right">
                <span className="text-gray-500 text-sm">€45 × 2</span><br/>
                <span className="text-[#1a1a1a] font-bold text-2xl">€90</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
              <div className="mb-4"><svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></div>
              <h3 className="font-lora text-2xl font-bold mb-3 text-[#1a1a1a]">Blog with CMS</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Publish articles yourself without code. CMS included. Full autonomous management. Key for ongoing SEO.
              </p>
              <div className="text-right">
                <span className="text-[#1a1a1a] font-bold text-2xl">€210</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-accent to-accent/80 text-white p-8 rounded-lg shadow-2xl">
              <div className="mb-4"><svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
              <h3 className="font-lora text-2xl font-bold mb-3">CRM System</h3>
              <p className="text-white/90 mb-4 leading-relaxed">
                Smart forms + CRM. Each lead is automatically classified. Goodbye Excel, hello automation.
              </p>
              <div className="text-right">
                <span className="font-bold text-3xl">€470</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a1a] to-gray-800 text-white p-8 rounded-lg shadow-2xl lg:col-span-2">
              <div className="flex justify-between items-start mb-4">
                <div className="text-5xl">🚀</div>
                <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold">SEO CORE</div>
              </div>
              <h3 className="font-lora text-3xl font-bold mb-3">76 SEO Landing Pages</h3>
              <p className="text-white/90 mb-4 text-lg leading-relaxed">
                The heart of your strategy. A specific page for each service + city combination. &quot;Health insurance in Torrevieja&quot;, &quot;Lawyers Murcia&quot;, &quot;Real estate Alicante&quot;...
              </p>
              <div className="bg-white/10 backdrop-blur p-4 rounded-lg mb-4">
                <p className="text-sm text-white/90">
                  <strong>Why it works:</strong> When someone searches for exactly that on Google, your page appears. Without these pages, you&apos;d be invisible for 90% of specific local searches.
                </p>
              </div>
              <div className="text-right">
                <span className="text-gray-300 text-sm">€3 × 76 pages</span><br/>
                <span className="font-bold text-4xl">€228</span>
              </div>
            </div>

            <div className="bg-white border-4 border-green-500 p-8 rounded-lg shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl">🛟</div>
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">INCLUDED</div>
              </div>
              <h3 className="font-lora text-2xl font-bold mb-3 text-[#1a1a1a]">3 Months Support</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Bug fixes, adjustments, minor changes, questions... All covered during the critical 3 months.
              </p>
              <div className="text-right">
                <span className="text-gray-400 line-through">€600</span>
                <span className="ml-2 text-green-600 font-bold text-xl">FREE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOTAL */}
      <section className="py-16 px-[5%] bg-gradient-to-br from-gray-900 to-[#1a1a1a] text-white">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-accent uppercase tracking-[3px] text-sm font-bold mb-4">TOTAL INVESTMENT</p>
          <div className="text-[6rem] font-bold font-lora leading-none mb-2">€1,498</div>
          <p className="text-gray-400 text-lg">+ VAT | Complete platform with 76 SEO landing pages + 3 months support</p>
        </div>
      </section>

      {/* PERFORMANCE */}
      <section className="py-24 px-[5%] bg-white">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-lora text-[3rem] font-bold text-center mb-16 text-[#1a1a1a]">
            Performance Guarantees
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-32 h-32 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl font-bold text-accent">90+</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">PageSpeed</h3>
              <p className="text-gray-600">Optimised speed. Google rewards fast websites with better ranking.</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl font-bold text-accent">100%</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Responsive</h3>
              <p className="text-gray-600">Perfect on mobile, tablet and desktop. +70% of visits are from mobile.</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl font-bold text-accent">A+</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">SEO Ready</h3>
              <p className="text-gray-600">Technical structure ready for Google. The 76 landings are your base.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT&apos;S NOT INCLUDED */}
      <section className="py-24 px-[5%] bg-gray-50">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-lora text-[3rem] font-bold text-center mb-6 text-[#1a1a1a]">
            What&apos;s NOT Included
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg max-w-[700px] mx-auto">
            Full transparency. These services are contracted separately:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border-l-4 border-gray-300">
              <div className="text-3xl mb-3">🌐</div>
              <h3 className="font-bold mb-2 text-gray-900">Domain</h3>
              <p className="text-gray-600 text-sm mb-2">Your web address (www.health4spain.com)</p>
              <p className="text-accent font-semibold">~€12/year</p>
            </div>
            <div className="bg-white p-6 rounded-lg border-l-4 border-gray-300">
              <div className="text-3xl mb-3">💾</div>
              <h3 className="font-bold mb-2 text-gray-900">Hosting</h3>
              <p className="text-gray-600 text-sm mb-2">Where your website is hosted</p>
              <p className="text-accent font-semibold">€5-20/month</p>
            </div>
            <div className="bg-white p-6 rounded-lg border-l-4 border-gray-300">
              <div className="text-3xl mb-3">✍️</div>
              <h3 className="font-bold mb-2 text-gray-900">Blog Articles</h3>
              <p className="text-gray-600 text-sm mb-2">Content writing for blog</p>
              <p className="text-accent font-semibold">To be quoted</p>
            </div>
            <div className="bg-white p-6 rounded-lg border-l-4 border-gray-300">
              <div className="text-3xl mb-3">📸</div>
              <h3 className="font-bold mb-2 text-gray-900">Photos</h3>
              <p className="text-gray-600 text-sm mb-2">We use stock or your photos</p>
              <p className="text-accent font-semibold">Optional</p>
            </div>
            <div className="bg-white p-6 rounded-lg border-l-4 border-gray-300">
              <div className="text-3xl mb-3">🔧</div>
              <h3 className="font-bold mb-2 text-gray-900">Maintenance</h3>
              <p className="text-gray-600 text-sm mb-2">After 3 months</p>
              <p className="text-accent font-semibold">To be quoted</p>
            </div>
            <div className="bg-white p-6 rounded-lg border-l-4 border-gray-300">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold mb-2 text-gray-900">Marketing</h3>
              <p className="text-gray-600 text-sm mb-2">Google Ads, social media</p>
              <p className="text-accent font-semibold">To be quoted</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-[5%] bg-gradient-to-br from-[#1a1a1a] to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-[800px] mx-auto text-center">
          <h2 className="font-lora text-[3.5rem] font-bold mb-6 leading-tight">
            Ready to Generate Leads
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            An investment that pays for itself. Every client you capture thanks to ranking makes it worthwhile.
          </p>
        </div>
      </section>
    </>
  );
}
