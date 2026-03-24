'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ROUTES, type Locale } from '@/lib/routes';

export default function ContactoPageMarker() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = (pathname.split('/')[1] || 'es') as Locale;
    const contactPath = `/${locale}/${ROUTES[locale]?.contact ?? 'contacto'}`;
    if (pathname === contactPath) {
      document.body.classList.add('contacto-page');
      return () => document.body.classList.remove('contacto-page');
    }
  }, [pathname]);

  return null;
}
