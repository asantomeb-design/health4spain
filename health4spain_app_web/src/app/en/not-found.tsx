import Link from 'next/link';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';

const locale: Locale = 'en';
const t = getDictionary(locale);

export default function NotFoundEN() {
  return (
    <div className="section min-h-[70vh] flex items-center justify-center">
      <div className="container-narrow text-center">
        <div className="text-[12rem] md:text-[16rem] font-bold text-gray-200 leading-none mb-8">
          404
        </div>
        <h1 className="mb-6">{t.notFound.title}</h1>
        <p className="text-[1.3rem] text-gray-600 leading-relaxed mb-12 max-w-[600px] mx-auto">
          {t.notFound.desc}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/en" className="btn-minimal-lg">
            {t.notFound.backHome}
          </Link>
          <Link href="/en/request" className="inline-block border-2 border-[#293f92] text-[#293f92] py-3 px-8 no-underline font-medium uppercase tracking-wider text-[0.85rem] transition-all hover:bg-[#293f92] hover:text-white">
            {t.notFound.contactUs}
          </Link>
        </div>
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-6">{t.notFound.popularPages}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/en/destinations" className="text-accent hover:underline text-sm uppercase tracking-wider font-medium">{t.nav.destinations}</Link>
            <Link href="/en/services" className="text-accent hover:underline text-sm uppercase tracking-wider font-medium">{t.nav.services}</Link>
            <Link href="/en/blog" className="text-accent hover:underline text-sm uppercase tracking-wider font-medium">{t.nav.blog}</Link>
            <Link href="/en/about-us" className="text-accent hover:underline text-sm uppercase tracking-wider font-medium">{t.nav.about}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
