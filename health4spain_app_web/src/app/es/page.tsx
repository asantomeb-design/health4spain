import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { HERO_IMAGES, LOGO_PATHS } from '@/lib/constants';
import { organizationJsonLd, websiteJsonLd, JsonLd, buildAlternates } from '@/lib/seo';

const LOCALE = 'es' as const;

export const metadata: Metadata = {
  title: 'Health4Spain - España Simplificado para Extranjeros',
  description: 'Conectamos extranjeros con profesionales verificados: abogados, seguros, inmobiliarias y gestorías. 150+ profesionales en 19 ciudades. Sin coste para ti.',
  alternates: buildAlternates(LOCALE, ''),
};

// Datos - 4 PERFILES CORRECTOS
const AUDIENCIAS = [
  { 
    id: 'jubilados', 
    label: 'Jubilados', 
    desc: 'Retiro en Costa Blanca/Sol. Visado no lucrativo, seguro médico.'
  },
  { 
    id: 'trabajadores', 
    label: 'Trabajadores', 
    desc: 'Empleo en agro/industria. Arraigo laboral y reagrupación.'
  },
  { 
    id: 'inversores', 
    label: 'Inversores', 
    desc: 'Golden Visa. Inversión inmobiliaria en zonas premium.'
  },
  { 
    id: 'estudiantes', 
    label: 'Estudiantes', 
    desc: 'Visado estudiante. Homologación de títulos.'
  },
];

// 4 SERVICIOS ESENCIALES
const SERVICIOS = [
  {
    id: 'seguros',
    number: '01',
    title: 'Seguros de Salud',
    description: 'Pólizas obligatorias para visados y permisos de residencia',
  },
  {
    id: 'abogados',
    number: '02',
    title: 'Abogados',
    description: 'Familia, civil, laboral, extranjería y más',
  },
  {
    id: 'inmobiliarias',
    number: '03',
    title: 'Inmobiliarias',
    description: 'Agentes especializados en extranjeros',
  },
  {
    id: 'gestorias',
    number: '04',
    title: 'Gestorías',
    description: 'Empadronamiento y gestión administrativa',
  },
];

// CIUDADES - REGIÓN DE MURCIA (12)
const CIUDADES_MURCIA = [
  { slug: 'murcia', nombre: 'Murcia' },
  { slug: 'cartagena', nombre: 'Cartagena' },
  { slug: 'lorca', nombre: 'Lorca' },
  { slug: 'mazarron', nombre: 'Mazarrón' },
  { slug: 'torre-pacheco', nombre: 'Torre Pacheco' },
  { slug: 'san-javier', nombre: 'San Javier' },
  { slug: 'san-pedro-pinatar', nombre: 'San Pedro del Pinatar' },
  { slug: 'molina-de-segura', nombre: 'Molina de Segura' },
  { slug: 'aguilas', nombre: 'Águilas' },
  { slug: 'cieza', nombre: 'Cieza' },
  { slug: 'jumilla', nombre: 'Jumilla' },
  { slug: 'yecla', nombre: 'Yecla' },
];

// CIUDADES - PROVINCIA DE ALICANTE (7)
const CIUDADES_ALICANTE = [
  { slug: 'alicante', nombre: 'Alicante' },
  { slug: 'elche', nombre: 'Elche' },
  { slug: 'torrevieja', nombre: 'Torrevieja' },
  { slug: 'orihuela', nombre: 'Orihuela' },
  { slug: 'rojales', nombre: 'Rojales' },
  { slug: 'benidorm', nombre: 'Benidorm' },
  { slug: 'denia', nombre: 'Denia' },
];

// ICONOS SVG
const TrustIcons = {
  Users: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Check: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 11L12 14L22 4M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Money: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Clock: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  User: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Message: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Verified: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999M22 4L12 14.01L9 11.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd(LOCALE)} />
      <section className="hero-with-image">
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_IMAGES.home}
            alt="Health4Spain - España simplificado para extranjeros"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="hero-content-box">
          <Image
            src={LOGO_PATHS.vertical}
            alt="Health 4 Spain"
            height={100}
            width={150}
            className="h-20 md:h-24 w-auto mb-5"
            priority
            fetchPriority="high"
          />
          <h1 className="mb-6" style={{ lineHeight: '0.95' }}>
            España.<br />Simplificado.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
            Conexiones directas con profesionales verificados para extranjeros. 
            Seguros, abogados, inmobiliarias, gestorías. Sin complicaciones.
          </p>
          
          <div className="flex gap-6 md:gap-10 mb-8 pt-6 border-t border-gray-300">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">150+</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">Profesionales</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">19</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">Ciudades</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">0€</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">Coste</div>
            </div>
          </div>

          <Link href="/es/solicitar" className="btn-minimal-lg">
            Solicitar Información
          </Link>
        </div>
      </section>

      {/* Servicios - Grid 2x2 */}
      <section className="section">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Servicios</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Cuatro servicios esenciales. Todo lo que necesitas para vivir legalmente en España.
          </p>
        </div>
        <div className="container-narrow">
          <div className="service-grid-2x2">
            {SERVICIOS.map((servicio) => (
              <Link
                key={servicio.id}
                href={`/es/solicitar?servicio=${servicio.id}`}
                className="service-card"
              >
                <div className="service-number">{servicio.number}</div>
                <h3>{servicio.title}</h3>
                <p>{servicio.description}</p>
                <span className="service-arrow">Solicitar →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Perfiles - Cards con hover mejorado */}
      <section className="section-blue-light">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">¿Quién Eres?</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Identifica tu perfil y descubre cómo podemos ayudarte
          </p>
        </div>
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {AUDIENCIAS.map((audiencia) => (
              <Link
                key={audiencia.id}
                href={`/es/solicitar?perfil=${audiencia.id}`}
                className="profile-card"
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  {audiencia.label}
                </h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  {audiencia.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Destinos - Dos columnas con listas */}
      <section className="section">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Nuestros Destinos</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Profesionales verificados en cada ciudad.
          </p>
        </div>

        <div className="destinos-columnas">
          {/* Columna Murcia */}
          <div>
            <h3>Región de Murcia</h3>
            <div className="destinos-lista">
              {CIUDADES_MURCIA.map((ciudad) => (
                <Link key={ciudad.slug} href={`/es/solicitar?ciudad=${ciudad.slug}`}>
                  {ciudad.nombre} <span>Solicitar →</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Columna Alicante */}
          <div>
            <h3>Provincia de Alicante</h3>
            <div className="destinos-lista">
              {CIUDADES_ALICANTE.map((ciudad) => (
                <Link key={ciudad.slug} href={`/es/solicitar?ciudad=${ciudad.slug}`}>
                  {ciudad.nombre} <span>Solicitar →</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/es/destinos" 
            className="text-lg font-semibold text-black border-b-2 border-accent pb-1 hover:border-b-4 transition-all inline-block"
          >
            Ver todas las ciudades →
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-alt">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Cómo Funciona</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Simple y rápido. Sin complicaciones.
          </p>
        </div>

        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-number">1</div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">Cuéntanos</h3>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Tu situación, tus necesidades, tu perfil. Sin compromiso.
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-number">2</div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">Te Conectamos</h3>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Con profesionales verificados en tu ciudad que hablan tu idioma.
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-number">3</div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">Tú Decides</h3>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Recibes asesoramiento en 24h. Sin presión. Contratas solo si quieres.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner CTA con beneficios */}
      <section className="section-blue-dark">
        <div className="container-base">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <h2 className="mb-8" style={{ color: 'white' }}>¿Por Qué Elegirnos?</h2>
              <p className="text-lg md:text-xl text-gray-200 mb-8">
                Somos el único marketplace neutral que conecta extranjeros con profesionales 
                verificados sin coste adicional.
              </p>
              <Link href="/es/solicitar" className="btn-minimal-white">
                Solicitar Contacto Ahora
              </Link>
            </div>

            <div className="flex flex-col gap-6">
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div>
                  <div className="font-bold text-lg text-white mb-1">Sin Coste Para Ti</div>
                  <div className="text-gray-300">Los profesionales nos pagan a nosotros. Tú no pagas nada extra.</div>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div>
                  <div className="font-bold text-lg text-white mb-1">Respuesta en 24 Horas</div>
                  <div className="text-gray-300">Un profesional verificado te contactará en menos de 24 horas.</div>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div>
                  <div className="font-bold text-lg text-white mb-1">Profesionales Verificados</div>
                  <div className="text-gray-300">Todos nuestros colaboradores están verificados y especializados en extranjeros.</div>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div>
                  <div className="font-bold text-lg text-white mb-1">Tu Idioma</div>
                  <div className="text-gray-300">Profesionales que hablan inglés, alemán, francés y más.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust/Network Section con iconos */}
      <section className="section-blue-light text-center">
        <div className="container-base">
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="mb-6">Nuestra Red</h2>
            <p className="text-xl md:text-2xl text-gray-600">
              Cifras que respaldan nuestro compromiso con la comunidad extranjera en España
            </p>
          </div>

          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon"><TrustIcons.Users /></div>
              <div className="trust-number">150+</div>
              <p className="trust-label">Profesionales Verificados</p>
            </div>

            <div className="trust-item">
              <div className="trust-icon"><TrustIcons.MapPin /></div>
              <div className="trust-number">19</div>
              <p className="trust-label">Ciudades Españolas</p>
            </div>

            <div className="trust-item">
              <div className="trust-icon"><TrustIcons.Check /></div>
              <div className="trust-number">4</div>
              <p className="trust-label">Servicios Esenciales</p>
            </div>

            <div className="trust-item">
              <div className="trust-icon"><TrustIcons.Money /></div>
              <div className="trust-number">0€</div>
              <p className="trust-label">Coste para Ti</p>
            </div>

            <div className="trust-item">
              <div className="trust-icon"><TrustIcons.Clock /></div>
              <div className="trust-number">&lt;24h</div>
              <p className="trust-label">Tiempo de Respuesta</p>
            </div>

            <div className="trust-item">
              <div className="trust-icon"><TrustIcons.User /></div>
              <div className="trust-number">2</div>
              <p className="trust-label">Regiones Activas</p>
            </div>

            <div className="trust-item">
              <div className="trust-icon"><TrustIcons.Message /></div>
              <div className="trust-number">5+</div>
              <p className="trust-label">Idiomas Disponibles</p>
            </div>

            <div className="trust-item">
              <div className="trust-icon"><TrustIcons.Verified /></div>
              <div className="trust-number">100%</div>
              <p className="trust-label">Profesionales Verificados</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section text-center">
        <div className="container-narrow">
          <h2 className="mb-8">¿Listo para Empezar?</h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Sin coste. Sin compromiso. Respuesta en 24 horas.
          </p>
          <Link href="/es/solicitar" className="btn-minimal-lg">
            Solicitar Información Ahora
          </Link>
        </div>
      </section>
    </>
  );
}
