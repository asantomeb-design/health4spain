import { Suspense } from 'react';
import { Metadata } from 'next';
import { getCiudades } from '@/lib/ciudades';
import ContactFormClient from '@/app/es/solicitar/ContactFormClient';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'pt';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.request.metaTitle,
  description: t.request.metaDesc,
  alternates: buildAlternates(locale, '/solicitar'),
};

export default async function RequestPage() {
  const ciudades = await getCiudades();
  const ciudadesOpciones = [
    ...ciudades.map((c) => ({ id: c.slug, label: c.nombre })),
    { id: 'otra', label: t.request.otherCity },
  ];

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">{t.request.loading}</div>}>
      <ContactFormClient ciudades={ciudadesOpciones} locale={locale} />
    </Suspense>
  );
}
