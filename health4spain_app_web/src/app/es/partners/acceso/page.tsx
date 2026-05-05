import { Metadata } from 'next';
import { Suspense } from 'react';
import PartnerAccessClient from './PartnerAccessClient';

export const metadata: Metadata = {
  title: 'Acceso Partner · Health4Spain',
  description: 'Panel privado del partner cualificado. Tarifas, calculadora ROI y solicitud de contrato.',
  robots: { index: false, follow: false, nocache: true },
};

export default function PartnersAccesoPage() {
  return (
    <Suspense
      fallback={
        <section className="section">
          <div className="container-narrow text-center">
            <p className="text-gray-500">Validando acceso…</p>
          </div>
        </section>
      }
    >
      <PartnerAccessClient />
    </Suspense>
  );
}
