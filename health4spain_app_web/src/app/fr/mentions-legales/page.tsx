import { Metadata } from 'next';
import LegalNotice, { LEGAL_META } from '@/components/LegalNotice';
import { LOCALES, ROUTES, type Locale } from '@/lib/routes';

const LOCALE: Locale = 'fr';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.health4spain.com';
const url = (l: Locale) => `${BASE_URL}/${l}/${ROUTES[l].legalNotice}`;

export const metadata: Metadata = {
  title: LEGAL_META[LOCALE].title,
  description: LEGAL_META[LOCALE].desc,
  alternates: {
    canonical: url(LOCALE),
    languages: { ...Object.fromEntries(LOCALES.map((l) => [l, url(l)])), 'x-default': url('es') },
  },
};

export default function LegalNoticePage() {
  return <LegalNotice locale={LOCALE} />;
}
