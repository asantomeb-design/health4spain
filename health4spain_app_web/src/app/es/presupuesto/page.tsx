import { Metadata } from 'next';
import PresupuestoContent from '@/components/PresupuestoContent';
import { buildAlternates } from '@/lib/seo';
import type { Locale } from '@/lib/routes';

const LOCALE: Locale = 'es';

export const metadata: Metadata = {
  title: 'Presupuesto - Web Generadora de Leads | Health4Spain',
  description: 'Sistema de generación de leads con 76 landings SEO: 4 servicios × 19 ciudades. Posicionamiento en Google para profesionales que sirven a extranjeros.',
  alternates: buildAlternates(LOCALE, '/presupuesto'),
};

export default function PresupuestoPage() {
  return <PresupuestoContent />;
}
