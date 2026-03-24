import Link from 'next/link';
import { Metadata } from 'next';
import { buildAlternates } from '@/lib/seo';
import type { Locale } from '@/lib/routes';

const LOCALE: Locale = 'es';

export const metadata: Metadata = {
  title: 'Hazte Partner - Profesionales Verificados | Health4Spain',
  description: 'Únete a la red de Health4Spain. Abogados, corredores de seguros, inmobiliarias y gestorías: recibe leads cualificados de extranjeros. Pago por conversión.',
  alternates: buildAlternates(LOCALE, '/profesionales'),
};

export default function ProfesionalesPage() {
  return (
    <>
      {/* Hero */}
      <section className="section">
        <div className="container-narrow text-center">
          <h1 className="mb-8">
            Hazte Partner
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Expande tu negocio con clientes internacionales. Únete a nuestra red de profesionales verificados.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="section-alt">
        <div className="container-narrow">
          <div className="bg-white border-t-3 border-accent p-8">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Si eres abogado, corredor de seguros, agente inmobiliario o gestor administrativo, 
              Health4Spain puede ser tu mejor fuente de clientes cualificados. Solo pagas por resultados reales, 
              sin cuotas mensuales ni compromisos de permanencia.
            </p>
          </div>
        </div>
      </section>

      {/* Beneficios - Grid como profile cards */}
      <section className="section">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Beneficios Para Ti</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Lo que ofrecemos a nuestros partners
          </p>
        </div>
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Leads Cualificados',
                desc: 'Solo contactos que realmente necesitan tus servicios y están listos para contratar. Pre-cualificados por perfil, ubicación y necesidad específica.',
              },
              {
                title: 'Pago por Conversión',
                desc: 'Sin cuotas mensuales. Solo pagas cuando hay conversión real: el cliente contrata tu servicio. Riesgo cero, resultados garantizados.',
              },
              {
                title: 'Perfil Verificado',
                desc: 'Destacamos tu experiencia con clientes internacionales, idiomas y especialidades. Tu badge verificado genera confianza inmediata.',
              },
              {
                title: 'Crecimiento Predecible',
                desc: 'Flujo constante de clientes potenciales. Tú decides cuántos leads quieres recibir por mes según tu capacidad.',
              },
            ].map((item, i) => (
              <div key={i} className="profile-card">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{item.title}</h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profesionales que buscamos */}
      <section className="section-blue-light">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Profesionales Que Buscamos</h2>
        </div>
        <div className="container-narrow">
          <ul className="service-list-minimal">
            {[
              { title: 'Abogados', desc: 'Familia, civil, laboral, extranjería y más. Todas las especialidades.' },
              { title: 'Seguros', desc: 'Corredores de seguros de salud privados válidos para visados' },
              { title: 'Inmobiliarias', desc: 'Agencias con experiencia en clientes internacionales' },
              { title: 'Gestorías', desc: 'Gestión administrativa, fiscal y laboral para extranjeros' },
            ].map((item, i) => (
              <li key={i} className="service-item-minimal py-8">
                <div className="service-number">0{i + 1}</div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">{item.title}</h3>
                  <p className="text-base md:text-lg text-gray-600">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Requisitos */}
      <section className="section">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Requisitos Para Ser Partner</h2>
        </div>
        <div className="container-narrow">
          <div className="space-y-6">
            {[
              { title: 'Licencias y Colegiación Activa', desc: 'Debes estar dado de alta legalmente en España con todas las licencias profesionales requeridas.' },
              { title: 'Experiencia Con Extranjeros', desc: 'Mínimo 2 años trabajando con clientes internacionales. Referencias verificables.' },
              { title: 'Idiomas', desc: 'Además de español, dominio de al menos inglés (B2+). Alemán o francés es un plus.' },
              { title: 'Capacidad de Respuesta', desc: 'Compromiso de responder leads en menos de 24 horas. Seguimiento profesional.' },
              { title: 'Seguro de Responsabilidad Civil', desc: 'Póliza de RC profesional activa y vigente.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 pb-6 border-b border-gray-300 last:border-0">
                <svg className="w-6 h-6 text-accent mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo Funciona - Timeline como home */}
      <section className="section-alt">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Cómo Funciona</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Cuatro pasos para unirte a nuestra red
          </p>
        </div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-12">
          {[
            { num: '1', title: 'Solicitud', desc: 'Completa el formulario con tu info profesional y especialidades' },
            { num: '2', title: 'Verificación', desc: 'Revisamos licencias, referencias y experiencia (2-5 días)' },
            { num: '3', title: 'Activación', desc: 'Configuras tu perfil y empiezas a recibir leads cualificados' },
            { num: '4', title: 'Conversión', desc: 'Solo pagas cuando el cliente contrata tu servicio' },
          ].map((item, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-number">{item.num}</div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comisiones */}
      <section className="section">
        <div className="container-narrow">
          <h2 className="mb-12 text-center">Modelo de Comisiones</h2>
          <div className="bg-white border-t-3 border-accent p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-6">Pago Por Conversión</h3>
            <p className="text-gray-600 mb-8">
              Solo pagas cuando hay conversión real. Las comisiones varían según el servicio:
            </p>
            <ul className="space-y-4">
              {[
                { label: 'Seguros de Salud', value: '15-20% del primer año' },
                { label: 'Servicios Legales', value: '20-25% del servicio' },
                { label: 'Servicios Inmobiliarios', value: '15-20% de comisión' },
                { label: 'Servicios Administrativos', value: '25-30% del servicio' },
              ].map((item, i) => (
                <li key={i} className="flex justify-between items-center py-4 border-b border-gray-200 last:border-0">
                  <span className="font-medium">{item.label}</span>
                  <span className="font-bold text-accent">{item.value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-600">
              <strong>Sin cuotas mensuales.</strong> Sin permanencia mínima. Sin costes ocultos. Pagas solo cuando ganamos ambos.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final - Banner como home */}
      <section className="section-blue-dark">
        <div className="container-narrow text-center">
          <h2 className="mb-8" style={{ color: 'white' }}>¿Listo Para Crecer Tu Negocio?</h2>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Únete a más de 150 profesionales que ya confían en Health4Spain para expandir su cartera de clientes internacionales.
          </p>
          <Link href="/es/contacto" className="btn-minimal-white">
            Solicitar Información Partner
          </Link>
        </div>
      </section>
    </>
  );
}
