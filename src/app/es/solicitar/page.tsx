import { Suspense } from 'react';
import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { getCiudades } from '@/lib/ciudades';
import { buildAlternates } from '@/lib/seo';
import ContactFormClient from './ContactFormClient';

const LOCALE: Locale = 'es';
const t = getDictionary(LOCALE);

export const metadata: Metadata = {
  title: t.request.metaTitle,
  description: t.request.metaDesc,
  alternates: buildAlternates(LOCALE, '/solicitar'),
};

export default async function SolicitarPage() {
  const ciudades = await getCiudades();

  const ciudadesOpciones = [
    ...ciudades.map((c) => ({ id: c.slug, label: c.nombre })),
    { id: 'otra', label: t.request.otherCity },
  ];

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">{t.request.loading}</div>}>
      <ContactFormClient ciudades={ciudadesOpciones} locale={LOCALE} />
    </Suspense>
  );
}
