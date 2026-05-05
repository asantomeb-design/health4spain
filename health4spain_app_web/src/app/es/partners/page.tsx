import { Metadata } from 'next';
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
  // Esta página sí queremos indexarla.
  robots: { index: true, follow: true },
};

export default function PartnersAcceso1Page() {
  return (
    <>
      {/* ============== HERO ============== */}
      <section className="bg-black text-white relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-32 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(59,189,218,0.18) 0%, transparent 60%)',
          }}
        />
        <div className="container-narrow py-16 md:py-24 relative">
          <span className="inline-block text-xs uppercase tracking-widest font-bold text-accent border border-accent/40 bg-accent/10 px-3 py-1 rounded-full mb-6">
            Modo Implantación · Founding Partners 2026
          </span>
          <h1 className="mb-6 text-white" style={{ lineHeight: '1.05' }}>
            Únete a la red que <span className="text-accent">capta clientes extranjeros</span>{' '}
            mientras tú te dedicas a cerrarlos.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
            Health4Spain capta expatriados con campañas digitales en 5 idiomas, los cualifica con
            IA y entrega la cita ya agendada al partner local correspondiente. Estamos cerrando los
            primeros 10 founding con condiciones especiales que no se repetirán.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-8 border-t border-white/15">
            {[
              { value: '7,24M', label: 'Expatriados en España' },
              { value: '+6,3%', label: 'Crecimiento anual' },
              { value: '5', label: 'Plazas en negociación' },
              { value: '10', label: 'Founding totales' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl md:text-4xl font-bold text-accent">{s.value}</div>
                <div className="text-xs uppercase tracking-widest text-gray-400 mt-2">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== IMPLANTACIÓN BANNER ============== */}
      <section
        className="py-8 md:py-10 text-white text-center"
        style={{ background: 'var(--color-accent)' }}
      >
        <div className="container-narrow">
          <p className="text-base md:text-lg font-bold mb-2">
            Modo Implantación · Coste reducido para los primeros 10 partners
          </p>
          <p className="text-sm md:text-base text-white/90 max-w-3xl mx-auto leading-relaxed">
            Si entras durante esta fase, accedes a tarifa reducida los primeros 6 meses, bloqueo de
            precio de por vida, setup gratuito y prelación en verticales adyacentes. Las condiciones
            Founding no se replican una vez cerrada esta fase.
          </p>
        </div>
      </section>

      {/* ============== 01 · CADENA DE CAPTACIÓN ============== */}
      <section className="section">
        <div className="container-narrow">
          <p className="text-xs uppercase tracking-widest font-bold text-accent mb-3">
            01 · Cómo lo hacemos
          </p>
          <h2 className="mb-4">Cinco pasos · de Google a tu agenda</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl">
            Una cadena automatizada que convierte una búsqueda en Google en una cita en tu agenda.
            Tú apareces solo en el último paso.
          </p>

          <ol className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
            {[
              {
                n: '01',
                t: 'Captación',
                d: 'Campañas Meta + Google Ads en 5 idiomas, segmentadas por nacionalidad y zona.',
              },
              {
                n: '02',
                t: 'Landing',
                d: 'Formulario en idioma del cliente. Convierte en menos de 90 segundos.',
              },
              {
                n: '03',
                t: 'IA Mar-IA',
                d: 'El bot conversa por WhatsApp, valida la necesidad y descarta lo no relevante.',
              },
              {
                n: '04',
                t: 'Agenda',
                d: 'Cita confirmada con briefing del cliente: idioma, presupuesto, urgencia.',
              },
              {
                n: '05',
                t: 'Tu cierre',
                d: 'El cliente llega informado y con cita confirmada. Tú apareces y cierras.',
              },
            ].map((s) => (
              <li
                key={s.n}
                className="bg-white border-t-3 border-accent p-6 flex flex-col gap-2"
              >
                <span className="text-xs font-bold tracking-widest text-accent uppercase">
                  Paso {s.n}
                </span>
                <h3 className="text-xl font-bold">{s.t}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.d}</p>
              </li>
            ))}
          </ol>

          <p className="text-center text-gray-500 italic text-sm mt-10">
            <strong className="text-black not-italic">No vendemos leads.</strong> Activamos tu
            cartera digital en tu zona, en tu idioma, con tu marca personal en el último paso.
          </p>
        </div>
      </section>

      {/* ============== 02 · 4 PLANES (sin precios) ============== */}
      <section className="section section-alt">
        <div className="container-narrow">
          <p className="text-xs uppercase tracking-widest font-bold text-accent mb-3">
            02 · Niveles de partner
          </p>
          <h2 className="mb-4">Cuatro planes · acceso por trayectoria</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl">
            Todos los partners entran en el plan de aterrizaje. Los planes superiores se desbloquean
            por tiempo activo y métricas verificables, no se contratan directamente. La{' '}
            <strong>exclusividad geográfica</strong> es destino, no entrada.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                name: 'Activa',
                tag: 'Plan de entrada',
                access: 'Directo tras llamada de validación',
                bullets: [
                  '15 leads cualificados/mes',
                  'Panel privado del partner',
                  'URL dedicada en partners.health4spain.com',
                  'Bot Mar-IA en tu idioma',
                  'Soporte equipo H4S',
                ],
              },
              {
                name: 'Crece',
                tag: 'Por trayectoria · 3 meses',
                access: 'Tras 3 meses + métricas',
                bullets: [
                  '25 leads cualificados/mes',
                  'Prioridad media en routing',
                  'Reporting mensual de métricas',
                  'Material de venta personalizado',
                  'Acceso a campañas estacionales',
                ],
              },
              {
                name: 'Escala',
                tag: 'Por trayectoria · 9 meses',
                access: '9 meses + KPIs cumplidos',
                bullets: [
                  '45 leads cualificados/mes',
                  'Prelación alta en routing',
                  'Ampliación a zona de influencia',
                  'Multi-zona disponible',
                  'Co-marketing local opcional',
                ],
              },
              {
                name: 'Lidera',
                tag: 'Solo por trayectoria',
                access: 'Solo se desbloquea, nunca se vende',
                bullets: [
                  'Leads ilimitados en tu zona',
                  'Exclusividad geográfica de zona entera',
                  'Bloqueo de servicios adyacentes',
                  'Voz en roadmap de producto',
                  'Línea directa con dirección',
                ],
                elite: true,
              },
            ].map((p) => (
              <article
                key={p.name}
                className={`bg-white p-6 flex flex-col border-t-3 ${
                  p.elite ? 'border-black ring-1 ring-black' : 'border-accent'
                }`}
              >
                <h3 className="text-2xl font-bold mb-1">{p.name}</h3>
                <p className="text-xs uppercase tracking-widest font-bold text-accent mb-4">
                  {p.tag}
                </p>
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-md p-3 mb-4 text-sm text-gray-600 italic">
                  <strong className="block text-black not-italic font-semibold mb-1">
                    Tarifa según tier de zona
                  </strong>
                  Disponible al solicitar acceso completo
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

          <div className="mt-10 p-6 text-center bg-white border border-accent rounded-md">
            <p className="text-base font-medium text-gray-700">
              💡 Las tarifas concretas según tu zona se desbloquean en el{' '}
              <strong className="text-black">acceso completo</strong>, tras llamada de cualificación.
              Solicítalo en el formulario más abajo.
            </p>
          </div>
        </div>
      </section>

      {/* ============== 03 · FOUNDING PARTNER ============== */}
      <section className="section">
        <div className="container-narrow">
          <div className="bg-black text-white rounded-md p-8 md:p-12 relative overflow-hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 -right-16 w-[400px] h-[400px] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(59,189,218,0.2) 0%, transparent 60%)',
              }}
            />
            <div className="relative">
              <span className="inline-block text-xs uppercase tracking-widest font-bold text-black bg-accent px-3 py-1 rounded-full mb-4">
                Solo durante implantación
              </span>
              <h2 className="text-white mb-4">
                Condiciones <span className="text-accent">Founding Partner</span> · los primeros 10
              </h2>
              <p className="text-gray-300 text-base md:text-lg max-w-3xl mb-8 leading-relaxed">
                Si entras durante la fase de implantación, no solo accedes a tarifa reducida durante
                el arranque — accedes a un paquete de ventajas que no se replicará una vez cerrada
                esta fase.
              </p>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-x-10">
                {[
                  'Tarifa de implantación reducida los primeros 6 meses',
                  'Bloqueo de precio de por vida · cuando subamos tarifas, tú te quedas',
                  'Setup fee gratuito (ahorro de 300-500€ de entrada)',
                  'Territorio ampliado desde Escala en lugar de Lidera',
                  'Primer derecho sobre verticales adyacentes en tu ciudad',
                  'Co-marketing destacado · tu marca en home de health4spain.com',
                  'Línea directa con dirección · feedback de producto',
                  'Comisión por referrals · 10% sobre primer año',
                ].map((p) => (
                  <li key={p} className="flex gap-3 text-gray-200 text-sm md:text-base">
                    <span className="text-accent font-bold flex-shrink-0">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============== 04 · PROCESO DE 4 PASOS ============== */}
      <section className="section section-alt">
        <div className="container-narrow">
          <p className="text-xs uppercase tracking-widest font-bold text-accent mb-3">
            04 · Cómo se accede
          </p>
          <h2 className="mb-4">Cuatro pasos · sin compromiso hasta firma</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl">
            Un proceso diseñado para validar encaje en ambas direcciones.
          </p>

          <ol className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              {
                n: '1',
                t: 'Solicitas acceso',
                d: 'Rellenas el formulario al final de esta página. 2 minutos. Sin precios mostrados aún — esto es para validar encaje.',
                when: 'Día 0',
              },
              {
                n: '2',
                t: 'Llamada de cualificación',
                d: 'Llamada de 20 minutos con un closer H4S. Validamos tu trayectoria, zona y capacidad operativa.',
                when: 'Día 1-2',
              },
              {
                n: '3',
                t: 'Acceso completo',
                d: 'Recibes acceso a la zona privada con calculadora ROI, tarifas detalladas y simulador de progresión.',
                when: 'Día 2-5',
              },
              {
                n: '4',
                t: 'Firma y arranque',
                d: 'Si decides avanzar: contrato, mandato SEPA, configuración técnica. Operativo en 14-21 días.',
                when: 'Día 7-21',
              },
            ].map((s) => (
              <li key={s.n} className="bg-white p-6 border-t-3 border-accent">
                <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-bold mb-4">
                  {s.n}
                </div>
                <h3 className="text-lg font-bold mb-2">{s.t}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{s.d}</p>
                <p className="text-xs uppercase tracking-widest font-bold text-accent">{s.when}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============== 05 · FORMULARIO ============== */}
      <section className="section" id="formulario">
        <div className="container-narrow">
          <p className="text-xs uppercase tracking-widest font-bold text-accent mb-3">
            05 · Solicita acceso
          </p>
          <h2 className="mb-4">Cuéntanos quién eres</h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl">
            Antes de avanzar queremos conocernos los dos. Estos datos son la base sobre la que
            decidimos si hay encaje. En menos de 24 horas hábiles te llamamos.
          </p>

          <div className="bg-white border-t-3 border-accent p-6 md:p-10 shadow-sm">
            <PartnersFormClient />
          </div>
        </div>
      </section>

      {/* ============== 06 · FAQ ============== */}
      <section className="section section-alt">
        <div className="container-narrow">
          <p className="text-xs uppercase tracking-widest font-bold text-accent mb-3">
            06 · Preguntas frecuentes
          </p>
          <h2 className="mb-10">Lo que más nos preguntan</h2>

          <div className="space-y-4">
            {[
              {
                q: '¿Por qué no muestran las tarifas en esta página?',
                a: 'Trabajamos con un modelo de plazas por ciudad y servicio. Validamos el encaje antes de hablar de números. La cualificación inicial nos asegura que solo dedicamos tiempo a profesionales que cumplen los mínimos. En la llamada y en el acceso completo verás todas las tarifas detalladas para tu zona específica.',
              },
              {
                q: '¿Qué quiere decir Modo Implantación y por qué la tarifa es reducida?',
                a: 'Estamos cerrando los primeros 10 partners founding de H4S. Durante esta fase, los partners que entran lo hacen con condiciones mejoradas: tarifa reducida durante 6 meses, bloqueo de precio de por vida, setup fee gratuito y otras ventajas. Una vez cerrada esta fase, las condiciones estándar aplican y los Founding mantienen las suyas.',
              },
              {
                q: '¿Tengo exclusividad si firmo con vosotros?',
                a: 'No de día 1. La exclusividad geográfica está reservada al plan Lidera, que se desbloquea por trayectoria (mínimo 21 meses + métricas validadas). Esto protege la marca H4S y al cliente final: no bloqueamos zonas con partners que no han demostrado rendimiento. Cuando llegas a Lidera, la exclusividad es real y se extiende a tu zona de influencia entera.',
              },
              {
                q: '¿Puedo operar en varias zonas o varias verticales?',
                a: 'Multi-vertical desde día 1 con descuento progresivo (si eres abogado y ofreces seguros, contratas las dos). Multi-zona desde plan Escala (mes 9+) con descuento del 50% por cada zona adicional. Los detalles concretos los discutimos en la llamada de cualificación.',
              },
              {
                q: '¿Qué se compromete H4S a entregar?',
                a: 'Volumen mensual de leads cualificados según el plan, gestión de campañas Meta Ads en tu zona, configuración del bot Mar-IA en los idiomas que atiendes, panel privado y URL dedicada. Si no entregamos el volumen mínimo pactado, el contrato contempla compensación o devolución parcial. Esos detalles los verás en el acceso completo.',
              },
              {
                q: '¿Cuánto tarda en estar operativo desde la firma?',
                a: '14-21 días. Setup técnico (URL dedicada, panel, bot Mar-IA, integración CRM) en 7-10 días. Activación de campañas Meta Ads en 4-7 días adicionales. Primer lead típicamente entregado entre día 14 y día 21 desde la firma.',
              },
            ].map((item) => (
              <details
                key={item.q}
                className="bg-white border border-gray-200 rounded-md p-5 group"
              >
                <summary className="cursor-pointer font-bold text-base md:text-lg list-none flex items-start gap-3">
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
    </>
  );
}
