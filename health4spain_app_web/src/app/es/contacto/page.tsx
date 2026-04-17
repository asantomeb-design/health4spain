import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { HERO_IMAGES } from '@/lib/constants';
import Breadcrumbs from '@/components/Breadcrumbs';
import ContactoPageMarker from './ContactoPageMarker';
import { buildAlternates } from '@/lib/seo';
import type { Locale } from '@/lib/routes';

const LOCALE: Locale = 'es';

export const metadata: Metadata = {
  title: 'Contacto | Health4Spain',
  description: 'Contacta con Health4Spain. Te ayudamos a conectar con abogados, seguros, inmobiliarias y gestorías verificados. Respuesta en 24h. Sin coste para ti.',
  keywords: 'contacto health4spain, servicios extranjeros españa, abogados españa, seguros salud españa, inmobiliarias españa',
  alternates: buildAlternates(LOCALE, '/contacto'),
};

// 📧 DATOS DE CONTACTO - TEMPORALES (cambiar después)
const CONTACT_INFO = {
  email: 'contacto@health4spain.com',
};

export default function ContactoPage() {
  return (
    <>
      <ContactoPageMarker />
      {/* Hero - Estilo minimalista como las demás páginas */}
      <section className="hero-with-image hero-compact">
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_IMAGES.contacto}
            alt="Contacto Health4Spain"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="hero-content-box">
          <h1 className="mb-4" style={{ lineHeight: '0.95' }}>
            Contacta con Health4Spain
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl">
            Estamos aquí para ayudarte. Cuéntanos qué necesitas y te conectamos 
            con los profesionales adecuados.
          </p>
          <div className="flex gap-6 md:gap-8 mb-6 pt-4 border-t border-gray-300">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-1">24h</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">Respuesta</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-1">0€</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">Coste</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-1">100%</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">Verificados</div>
            </div>
          </div>
        </div>
      </section>

      {/* Métodos de Contacto - Estilo minimalista */}
      <section className="section-alt">
        <div className="container-narrow">
          <Breadcrumbs items={[
            { label: 'Inicio', href: '/es' },
            { label: 'Contacto' }
          ]} />

          <div className="bg-white border-t-3 border-accent p-8 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Cómo Prefieres Contactarnos?</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              Elige el método que mejor se adapte a tus necesidades. Te responderemos en menos de 24 horas.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span><strong>Clientes:</strong> Dudas sobre servicios, trámites, profesionales</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span><strong>Partners:</strong> Únete a nuestro directorio de profesionales</span>
              </div>
            </div>
          </div>

          {/* Grid de contacto - 2 columnas en desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email */}
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="profile-card group hover:border-accent transition-all"
            >
              <div className="mb-4">
                <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="text-accent text-lg mb-3">{CONTACT_INFO.email}</p>
              <p className="text-sm text-gray-600">
                Escríbenos directamente. Perfecto si quieres adjuntar documentos o explicar tu caso con detalle.
              </p>
              <div className="mt-4 text-sm text-accent group-hover:translate-x-2 transition-transform inline-flex items-center gap-1">
                Enviar email →
              </div>
            </a>

            {/* Formulario */}
            <Link
              href="/es/solicitar"
              className="profile-card group hover:border-accent transition-all"
            >
              <div className="mb-4">
                <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Formulario Online</h3>
              <p className="text-accent text-lg mb-3">Solicitud estructurada</p>
              <p className="text-sm text-gray-600">
                Completa el formulario con tus necesidades y te conectamos con 2-3 profesionales adecuados.
              </p>
              <div className="mt-4 text-sm text-accent group-hover:translate-x-2 transition-transform inline-flex items-center gap-1">
                Ir al formulario →
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Qué esperar - Dividido por tipo de usuario */}
      <section className="section">
        <div className="container-narrow">
          <div className="text-center mb-16">
            <h2 className="mb-4">¿Qué Ocurre Después de Contactar?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Proceso adaptado según tus necesidades
            </p>
          </div>

          {/* Grid 2 columnas: Clientes y Partners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Para Clientes */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <svg className="w-12 h-12 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="text-2xl font-bold">Si Eres Cliente</h3>
              </div>
              <div className="space-y-6">
                {[
                  {
                    num: '01',
                    title: 'Recibimos Tu Consulta',
                    desc: 'En menos de 24 horas revisamos tu solicitud y analizamos qué profesionales se ajustan mejor a tu caso.'
                  },
                  {
                    num: '02',
                    title: 'Te Presentamos Opciones',
                    desc: 'Te conectamos con 2-3 profesionales verificados que pueden ayudarte específicamente.'
                  },
                  {
                    num: '03',
                    title: 'Tú Decides',
                    desc: 'Compara propuestas y elige libremente. Si ninguno te convence, buscamos más opciones. Gratis.'
                  },
                  {
                    num: '04',
                    title: 'Seguimiento',
                    desc: 'Hacemos seguimiento para asegurarnos de que estás recibiendo un servicio excepcional.'
                  }
                ].map((step) => (
                  <div key={step.num} className="flex items-start gap-4">
                    <div className="text-3xl font-bold text-[#293f92] shrink-0" style={{ lineHeight: '1' }}>
                      {step.num}
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{step.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Para Partners */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <svg className="w-12 h-12 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-2xl font-bold">Si Eres Profesional</h3>
              </div>
              <div className="space-y-6">
                {[
                  {
                    num: '01',
                    title: 'Revisamos Tu Perfil',
                    desc: 'Analizamos tu especialidad, experiencia con clientes internacionales y servicios que ofreces.'
                  },
                  {
                    num: '02',
                    title: 'Proceso de Verificación',
                    desc: 'Verificamos licencias profesionales, referencias y capacidad de trabajar con extranjeros.'
                  },
                  {
                    num: '03',
                    title: 'Alta en el Directorio',
                    desc: 'Una vez aprobado, te damos de alta y empezamos a enviarte leads cualificados de tu zona.'
                  },
                  {
                    num: '04',
                    title: 'Pago por Éxito',
                    desc: 'Solo pagas cuando hay conversión real. Sin cuotas mensuales, sin permanencia.'
                  }
                ].map((step) => (
                  <div key={step.num} className="flex items-start gap-4">
                    <div className="text-3xl font-bold text-[#293f92] shrink-0" style={{ lineHeight: '1' }}>
                      {step.num}
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{step.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Garantías */}
      <section className="section">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="mb-4">Nuestras Garantías</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: '100% Gratis',
                desc: 'Nunca pagas por nuestro servicio de conexión'
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Respuesta en 24h',
                desc: 'Te contactamos en menos de un día hábil'
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Profesionales Verificados',
                desc: 'Todos han pasado nuestro proceso de verificación'
              }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center mb-4 text-accent">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Clientes - Azul oscuro */}
      <section className="section-blue-dark pb-0">
        <div className="container-narrow pb-8 md:pb-12">
          <div className="text-center">
            <h2 className="mb-6" style={{ color: 'white' }}>¿Necesitas Ayuda Para Vivir en España?</h2>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Da el primer paso. Te conectamos con profesionales verificados. Sin compromiso, sin coste.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/es/solicitar"
                className="btn-minimal-white"
              >
                Completar Formulario
              </Link>
              <a 
                href={`mailto:${CONTACT_INFO.email}`}
                className="inline-flex items-center justify-center px-8 py-3 text-white border border-white/30 hover:bg-white/10 transition-all text-sm uppercase tracking-widest"
              >
                Enviar Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Profesionales - Fondo gris para contraste */}
      <section className="section-alt pt-0">
        <div className="container-narrow py-8 md:py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">¿Eres Profesional?</h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Únete a nuestro directorio verificado. Recibe leads cualificados de tu especialidad y zona.
            </p>
            <a 
              href={`mailto:${CONTACT_INFO.email}?subject=Quiero ser Partner - Health4Spain`}
              className="inline-flex items-center justify-center px-8 py-3 bg-[#293f92] text-white border-2 border-[#293f92] hover:bg-[#1e2d6b] hover:border-[#1e2d6b] transition-all text-sm uppercase tracking-widest font-semibold"
            >
              Solicitar Información Partners
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
