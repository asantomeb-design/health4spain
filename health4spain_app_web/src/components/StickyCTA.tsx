'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES, type Locale } from '@/lib/routes';
import { getDictionary } from '@/lib/dictionaries';

export default function StickyCTA() {
  const pathname = usePathname();
  const locale = (pathname.split('/')[1] || 'es') as Locale;
  const r = ROUTES[locale] ?? ROUTES.es;
  const t = getDictionary(locale);

  const contactPath = `/${locale}/${r.contact}`;
  if (pathname === contactPath) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-3 border-[#293f92] z-40 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] md:hidden">
      <Link 
        href={`/${locale}/${r.request}`}
        className="block w-full bg-[#293f92] text-white font-bold text-base py-5 px-6 text-center hover:bg-[#1e2d6b] active:bg-[#1e2d6b] transition-colors rounded-sm"
      >
        {t.stickyCta.text}
      </Link>
      <p className="text-xs text-gray-500 text-center mt-2">
        {t.stickyCta.subtext}
      </p>
    </div>
  );
}
