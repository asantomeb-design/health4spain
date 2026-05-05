import { Metadata } from 'next';
import Image from 'next/image';
import { HERO_IMAGES } from '@/lib/constants';
import { buildAlternates } from '@/lib/seo';
import PartnersFormClient from './PartnersFormClient';

const LOCALE = 'es' as const;
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.health4spain.com').replace(
  /\/$/,
  ''
);

export const metadata: Metadata = {
  title: 'Únete a Health4Spain Partners · Modo Implantación 2026',
  description:
    'Captamos extranjeros, los cualificamos con IA y te entregamos la cita con briefing. Tú solo cierras. Únete a la red de partners H4S — fase de implantación con condiciones especiales para los 10 primeros.',
  alternates: buildAlternates(LOCALE, '/partners'),
  openGraph: {
    title: 'Health4Spain Partners · Modo Implantación 2026',
    description:
      'Una red exclusiva de profesionales locales que reciben leads cualificados de extranjeros recién llegados a España. 10 plazas Founding.',
    url: `${SITE_URL}/es/partners`,
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function PartnersAcceso1Page() {
  return (
    <>
      {/* ======== HERO ======== */}
      <section className="hero-with-image">
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_IMAGES.home}
            alt="Health4Spain Partners - Red de profesionales para expatriados"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="hero-content-box">
          <span className="inline-block text-xs uppercase tracking-widest font-bold text-accent mb-4">
            Modo Implantación · Founding Partners 2026
          </span>
          <h1 className="mb-6" style={{ lineHeight: '1.05' }}>
            Capta clientes<br />extranjeros.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
            Health4Spain capta expatriados en 5 idiomas, los cualifica con IA y te entrega la cita
            ya agendada. Tú solo cierras. Cerramos los 10 primeros founding con condiciones
            irrepetibles.
          </p>

          <div className="flex gap-6 md:gap-10 mb-8 pt-6 border-t border-gray-300">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">7,24M</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">Expatriados</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">19</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">Ciudades</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">10</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">Founding</div>
            </div>
          </div>

          <a href="#formulario" className="btn-minimal-lg">
            Solicitar Acceso
          </a>
        </div>
      </section>

      {/* ============== CADENA DE CAPTACIÓN ============== */}
      <section className="section-alt">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">De Google a Tu Agenda</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Una cadena automatizada en 5 pasos. Tú apareces solo al final.
          </p>
        </div>

        <div className="container-narrow">
          <div className="service-grid-2x2 lg:!grid-cols-5">
            {[
              { n: '01', t: 'Captación', d: 'Campañas Meta + Google Ads en 5 idiomas, segmentadas por nacionalidad y zona.' },
              { n: '02', t: 'Landing', d: 'Formulario en idioma del cliente. Convierte en menos de 90 segundos.' },
              { n: '03', t: 'IA Mar-IA', d: 'Bot conversa por WhatsApp, valida la necesidad y descarta lo irrelevante.' },
              { n: '04', t: 'Agenda', d: 'Cita confirmada con briefing: idioma, presupuesto, urgencia.' },
              { n: '05', t: 'Tu Cierre', d: 'El cliente llega informado y con cita. Tú apareces y cierras.' },
            ].map((s) => (
              <div key={s.n} className="service-card text-center">
                <div className="service-number">{s.n}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-gray-500 italic text-sm mt-10 max-w-xl mx-auto">
          <strong className="text-black not-italic">No vendemos leads.</strong> Activamos tu cartera
          digital en tu zona, en tu idioma, con tu marca en el último paso.
        </p>
      </section>

      {/* ============== PLANES (service-card style) ============== */}
      <section className="section">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Cuatro Planes · Acceso por Trayectoria</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Todos entran en el plan de aterrizaje. Los superiores se desbloquean por métricas,
            no se compran. La exclusividad es destino, no entrada.
          </p>
        </div>

        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                name: 'Activa',
                tag: 'Plan de entrada',
                access: 'Directo tras validación',
                bullets: [
                  '15 leads cualificados/mes',
                  'Panel privado del partner',
                  'URL dedicada',
                  'Bot Mar-IA en tu idioma',
                  'Soporte equipo H4S',
                ],
              },
              {
                name: 'Crece',
                tag: 'Tras 3 meses',
                access: '3 meses + métricas',
                bullets: [
                  '25 leads cualificados/mes',
                  'Prioridad media en routing',
                  'Reporting mensual',
                  'Material personalizado',
                  'Campañas estacionales',
                ],
              },
              {
                name: 'Escala',
                tag: 'Tras 9 meses',
                access: '9 meses + KPIs',
                bullets: [
                  '45 leads cualificados/mes',
                  'Prelación alta en routing',
                  'Zona de influencia',
                  'Multi-zona disponible',
                  'Co-marketing local',
                ],
              },
              {
                name: 'Lidera',
                tag: 'Solo por trayectoria',
                access: 'Se desbloquea, no se vende',
                bullets: [
                  'Leads ilimitados',
                  'Exclusividad geográfica',
                  'Bloqueo de verticales',
                  'Voz en roadmap',
                  'Línea directa con dirección',
                ],
                elite: true,
              },
            ].map((p) => (
              <article
                key={p.name}
                className={`service-card flex flex-col ${
                  p.elite ? '!border-t-black ring-1 ring-black' : ''
                }`}
              >
                <div className="service-number mb-1">{p.name}</div>
                <p className="text-xs uppercase tracking-widest font-bold text-accent mb-4">
                  {p.tag}
                </p>
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-md p-3 mb-4 text-sm text-gray-600 italic">
                  <strong className="block text-black not-italic font-semibold mb-1">
                    Tarifa según tier de zona
                  </strong>
                  Disponible tras llamada
                </div>
                <ul className="space-y-2 flex-1">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-accent font-bold">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                  <strong className="text-black">Acceso:</strong> {p.access}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FOUNDING PARTNER (section-blue-dark like home CTA) ============== */}
      <section className="section-blue-dark">
        <div className="container-base">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <h2 className="mb-8" style={{ color: 'white' }}>
                Condiciones Founding Partner
              </h2>
              <p className="text-lg md:text-xl text-gray-200 mb-8">
                Si entras durante la fase de implantación accedes a un paquete que no se replicará.
                Solo para los 10 primeros.
              </p>
              <a href="#formulario" className="btn-minimal-white">
                Solicitar Acceso Founding
              </a>
            </div>

            <div className="flex flex-col gap-6">
              {[
                'Tarifa reducida los primeros 6 meses',
                'Bloqueo de precio de por vida',
                'Setup fee gratuito (300-500€)',
                'Territorio ampliado desde Escala',
                'Primer derecho sobre verticales adyacentes',
                'Co-marketing · tu marca en home H4S',
                'Línea directa con dirección',
                'Comisión por referrals · 10% primer año',
              ].map((item) => (
                <div key={item} className="benefit-item">
                  <div className="benefit-icon">✓</div>
                  <div className="text-gray-200">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============== PROCESO (section-blue-light) ============== */}
      <section className="section-blue-light">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Cómo se Accede</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Sin compromiso hasta firma. Cuatro pasos para validar encaje mutuo.
          </p>
        </div>

        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { n: '1', t: 'Solicitas Acceso', d: 'Rellenas el formulario. 2 min. Sin precios mostrados aún.', when: 'Día 0' },
              { n: '2', t: 'Llamada de Cualificación', d: '20 min con un closer H4S. Validamos trayectoria, zona y capacidad.', when: 'Día 1-2' },
              { n: '3', t: 'Acceso Completo', d: 'Zona privada con calculadora ROI, tarifas y simulador de progresión.', when: 'Día 2-5' },
              { n: '4', t: 'Firma y Arranque', d: 'Contrato, mandato SEPA, config técnica. Operativo en 14-21 días.', when: 'Día 7-21' },
            ].map((s) => (
              <div key={s.n} className="service-card text-center">
                <div className="service-number">{s.n}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
                <span className="text-xs uppercase tracking-widest font-bold text-accent mt-auto pt-4">
                  {s.when}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FORMULARIO ============== */}
      <section className="section" id="formulario">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Cuéntanos Quién Eres</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Estos datos son la base sobre la que decidimos si hay encaje.
            En menos de 24 horas hábiles te llamamos.
          </p>
        </div>

        <div className="container-narrow">
          <div className="profile-card">
            <PartnersFormClient />
          </div>
        </div>
      </section>

      {/* ============== FAQ ============== */}
      <section className="section-alt">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Preguntas Frecuentes</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Lo que más nos preguntan los profesionales antes de solicitar acceso.
          </p>
        </div>

        <div className="container-narrow">
          <div className="space-y-4">
            {[
              {
                q: '¿Por qué no muestran las tarifas en esta página?',
                a: 'Trabajamos con un modelo de plazas por ciudad y servicio. Validamos el encaje antes de hablar de números. En la llamada y en el acceso completo verás todas las tarifas detalladas para tu zona específica.',
              },
              {
                q: '¿Qué quiere decir Modo Implantación y por qué la tarifa es reducida?',
                a: 'Estamos cerrando los primeros 10 partners founding de H4S. Durante esta fase, los partners que entran lo hacen con condiciones mejoradas: tarifa reducida durante 6 meses, bloqueo de precio de por vida, setup fee gratuito y otras ventajas. Una vez cerrada esta fase, las condiciones estándar aplican.',
              },
              {
                q: '¿Tengo exclusividad si firmo con vosotros?',
                a: 'No de día 1. La exclusividad geográfica está reservada al plan Lidera, que se desbloquea por trayectoria (mínimo 21 meses + métricas validadas). Cuando llegas a Lidera, la exclusividad es real y se extiende a tu zona de influencia entera.',
              },
              {
                q: '¿Puedo operar en varias zonas o varias verticales?',
                a: 'Multi-vertical desde día 1 con descuento progresivo. Multi-zona desde plan Escala (mes 9+) con descuento del 50% por cada zona adicional. Detalles concretos en la llamada de cualificación.',
              },
              {
                q: '¿Qué se compromete H4S a entregar?',
                a: 'Volumen mensual de leads cualificados según plan, gestión de campañas Meta Ads, bot Mar-IA en tus idiomas, panel privado y URL dedicada. Si no entregamos el volumen mínimo pactado, el contrato contempla compensación.',
              },
              {
                q: '¿Cuánto tarda en estar operativo desde la firma?',
                a: '14-21 días. Setup técnico en 7-10 días. Activación de campañas en 4-7 días adicionales. Primer lead típicamente entregado entre día 14 y día 21 desde la firma.',
              },
            ].map((item) => (
              <details
                key={item.q}
                className="profile-card !p-5 group cursor-pointer"
              >
                <summary className="font-bold text-base md:text-lg list-none flex items-start gap-3">
                  <span className="text-accent flex-shrink-0">—</span>
                  <span className="flex-1">{item.q}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="text-gray-600 mt-3 text-sm md:text-base leading-relaxed pl-7">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============== CTA FINAL (like home) ============== */}
      <section className="section text-center">
        <div className="container-narrow">
          <h2 className="mb-8">¿Listo para Empezar?</h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Sin coste hasta firma. Sin compromiso. Te llamamos en 24 horas.
          </p>
          <a href="#formulario" className="btn-minimal-lg">
            Solicitar Acceso Ahora
          </a>
        </div>
      </section>
    </>
  );
}
