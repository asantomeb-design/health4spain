'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const LOCALE_MAP: Record<string, string> = {
  es: 'es',
  en: 'en',
  fr: 'fr',
  de: 'de',
  pt: 'pt',
};

export default function HtmlLang() {
  const pathname = usePathname();

  useEffect(() => {
    const segment = pathname.split('/')[1] || 'es';
    const lang = LOCALE_MAP[segment] || 'es';
    document.documentElement.lang = lang;
  }, [pathname]);

  return null;
}
