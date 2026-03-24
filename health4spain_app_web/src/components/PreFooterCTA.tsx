'use client';

import { usePathname } from 'next/navigation';

const trustBadges = [
  { icon: 'check', text: 'Profesionales Verificados' },
  { icon: 'clock', text: 'Respuesta en 24h' },
  { icon: 'lock', text: 'Datos Protegidos' },
  { icon: 'shield', text: '100% Legal en España' },
];

export default function PreFooterCTA() {
  const pathname = usePathname();
  
  // Ocultar en:
  // - Página de contacto (ya tiene su propio formulario)
  // - Home (no necesita formulario, todo va a /contacto)
  // - Páginas de listado (/servicios, /destinos) - solo tienen CTAs a formulario
  // Solo mostrar en landings específicas como /servicios/abogados-murcia, /destinos/murcia
  const hiddenPages = [
    '/es/contacto',
    '/es/solicitar',
    '/es',
    '/es/servicios',
    '/es/destinos',
  ];
  
  if (hiddenPages.includes(pathname)) {
    return null;
  }
  
  return (
    <section className="section-blue-dark">
      <div className="container-base">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              ¿Necesitas Ayuda Legal en España?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Conectamos con profesionales verificados en menos de 24 horas. 
              Sin coste para ti. Sin compromiso.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2 text-white">
                  {badge.icon === 'check' && <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                  {badge.icon === 'clock' && <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  {badge.icon === 'lock' && <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                  {badge.icon === 'shield' && <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                  <span className="text-sm font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-8 md:p-10">
            <h3 className="text-2xl font-bold mb-6 text-black">Solicitar Información</h3>
            <form className="space-y-5" action="/es/solicitar" method="GET">
              <div>
                <input 
                  type="text" 
                  name="nombre"
                  placeholder="Tu nombre" 
                  className="form-input-minimal w-full border-gray-300 focus:border-blue-600 text-black"
                />
              </div>
              <div>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Tu email" 
                  className="form-input-minimal w-full border-gray-300 focus:border-blue-600 text-black"
                />
              </div>
              <div>
                <input 
                  type="tel" 
                  name="telefono"
                  placeholder="Tu teléfono" 
                  className="form-input-minimal w-full border-gray-300 focus:border-blue-600 text-black"
                />
              </div>
              <div>
                <textarea 
                  name="mensaje"
                  placeholder="Cuéntanos tu caso brevemente" 
                  rows={4}
                  className="form-input-minimal w-full border-gray-300 focus:border-blue-600 text-black resize-none"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-accent text-white py-4 px-8 font-bold text-lg hover:bg-accent-600 transition-colors"
              >
                Enviar Solicitud →
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
