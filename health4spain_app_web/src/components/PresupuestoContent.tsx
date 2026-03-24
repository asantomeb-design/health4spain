/** Shared quote/presupuesto page content - Spanish for now, used by all locales */
export default function PresupuestoContent() {
  return (
    <>
      {/* HERO MODERNO */}
      <section className="relative py-32 px-[5%] bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-[1200px] mx-auto text-center">
          <h1 className="font-lora text-[5rem] font-bold mb-6 leading-[1.1]">
            Una Web Que Te<br/>
            <span className="text-accent">Posiciona en Google</span>
          </h1>
          <p className="text-[1.4rem] text-gray-300 leading-relaxed max-w-[800px] mx-auto mb-12">
            No es solo una web bonita. Es una máquina de generación de leads con 76 puertas de entrada desde Google (4 servicios × 19 ciudades).
          </p>
          <div className="flex gap-8 justify-center items-center text-lg">
            <div className="flex items-center gap-2">
              <span className="text-accent text-2xl">✓</span>
              <span>76 Landings SEO</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent text-2xl">✓</span>
              <span>4 Servicios</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent text-2xl">✓</span>
              <span>19 Ciudades</span>
            </div>
          </div>
        </div>
      </section>

      {/* EL SECRETO: SEO */}
      <section className="py-24 px-[5%] bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-lora text-[3.5rem] font-bold mb-4 text-[#1a1a1a]">
              El Secreto: Dominar Google
            </h2>
            <p className="text-xl text-gray-600 max-w-[700px] mx-auto">
              La mayoría de webs son invisibles en Google. La tuya no.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <div className="text-7xl mb-6">🎯</div>
              <h3 className="font-lora text-[2.5rem] font-bold mb-6 text-[#1a1a1a]">
                ¿Por Qué SEO?
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Imagina tener una oficina en la mejor calle, pero sin letrero. Eso es una web sin SEO.
              </p>
              <div className="bg-accent/10 border-l-4 border-accent p-6 mb-6">
                <p className="text-gray-900 font-semibold mb-2">Dato clave:</p>
                <p className="text-gray-700">
                  <strong>90%</strong> de las personas que buscan seguros, abogados, inmobiliarias o gestorías en España empiezan en Google. Si no apareces en la primera página, <strong>no existes.</strong>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-10 rounded-lg">
              <h4 className="font-semibold text-xl mb-6 text-[#1a1a1a]">Nuestra Estrategia: SEO Quirúrgico</h4>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <div>
                    <strong className="text-gray-900 block mb-1">Servicios específicos</strong>
                    <p className="text-gray-600 text-sm">Seguros, Abogados, Inmobiliarias, Gestorías</p>
                  </div>
                </div>
                <div className="text-3xl text-center text-gray-400">×</div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold">19</div>
                  <div>
                    <strong className="text-gray-900 block mb-1">Ciudades estratégicas</strong>
                    <p className="text-gray-600 text-sm">Murcia, Alicante, Torrevieja, Cartagena, Lorca...</p>
                  </div>
                </div>
                <div className="border-t-2 border-accent pt-4 mt-6">
                  <div className="flex gap-4 items-center">
                    <div className="flex-shrink-0 w-14 h-14 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center font-bold text-xl">76</div>
                    <div>
                      <strong className="text-[#1a1a1a] text-xl block">Páginas optimizadas</strong>
                      <p className="text-gray-600">Cada una atacando una búsqueda específica en Google</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OBJETIVOS EN GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg text-center">
              <div className="text-5xl mb-4">👁️</div>
              <h4 className="font-bold text-lg mb-2 text-gray-900">Visibilidad Inmediata</h4>
              <p className="text-gray-700 text-sm">Desde el día 1 en búsquedas hiperlocales</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h4 className="font-bold text-lg mb-2 text-gray-900">Tráfico Cualificado</h4>
              <p className="text-gray-700 text-sm">Visitantes listos para contratar</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg text-center">
              <div className="text-5xl mb-4">📍</div>
              <h4 className="font-bold text-lg mb-2 text-gray-900">Dominio Territorial</h4>
              <p className="text-gray-700 text-sm">Controla tu zona geográfica</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-lg text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h4 className="font-bold text-lg mb-2 text-gray-900">Ventaja Competitiva</h4>
              <p className="text-gray-700 text-sm">Tu competencia tiene 10 páginas, tú 76</p>
            </div>
          </div>

          {/* AHORRO DESTACADO */}
          <div className="bg-gradient-to-br from-accent to-accent/80 text-white p-12 rounded-2xl text-center shadow-2xl">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="font-lora text-[2.5rem] font-bold mb-4">El Ahorro Real</h3>
            <p className="text-xl opacity-95 mb-6 max-w-[800px] mx-auto">
              Una campaña SEO para posicionar 76 términos específicos te costaría <strong>8.000€ - 24.000€</strong> durante 6-12 meses, sin garantías.
            </p>
            <div className="inline-block bg-white/20 backdrop-blur px-8 py-4 rounded-lg">
              <p className="text-2xl font-bold">Con esta estructura, ese trabajo YA está hecho</p>
            </div>
          </div>
        </div>
      </section>

      {/* QUÉ INCLUYE */}
      <section className="py-24 px-[5%] bg-gray-50">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-lora text-[3.5rem] font-bold text-center mb-4 text-[#1a1a1a]">
            Qué Incluye Tu Web
          </h2>
          <p className="text-center text-xl text-gray-600 mb-16 max-w-[700px] mx-auto">
            Todo lo que necesitas para generar clientes desde el primer día
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl">🎨</div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">GRATIS</div>
              </div>
              <h3 className="font-lora text-2xl font-bold mb-3 text-[#1a1a1a]">Diseño Profesional</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Aspecto visual único, bocetos hasta que estés 100% satisfecho. Como un diseñador gráfico especializado en webs.
              </p>
              <div className="text-right">
                <span className="text-gray-400 line-through">360€</span>
                <span className="ml-2 text-green-600 font-bold text-xl">0€</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="font-lora text-2xl font-bold mb-3 text-[#1a1a1a]">Programación Custom</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Código a medida, sin WordPress. Adaptado a móviles, tablets y ordenadores. Base de datos y navegación incluidas.
              </p>
              <div className="text-right">
                <span className="text-[#1a1a1a] font-bold text-2xl">320€</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
              <div className="mb-4"><svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg></div>
              <h3 className="font-lora text-2xl font-bold mb-3 text-[#1a1a1a]">Home Premium</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Tu escaparate principal. Diseño estratégico con textos SEO y carrusel de imágenes para impactar.
              </p>
              <div className="text-right">
                <span className="text-[#1a1a1a] font-bold text-2xl">180€</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
              <div className="mb-4"><svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
              <h3 className="font-lora text-2xl font-bold mb-3 text-[#1a1a1a]">2 Páginas Extra</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Dos páginas adicionales (Destinos, Servicios...). Programadas en código para máximo rendimiento. Editables por nosotros durante soporte.
              </p>
              <div className="text-right">
                <span className="text-gray-500 text-sm">45€ × 2</span><br/>
                <span className="text-[#1a1a1a] font-bold text-2xl">90€</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
              <div className="mb-4"><svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></div>
              <h3 className="font-lora text-2xl font-bold mb-3 text-[#1a1a1a]">Blog con CMS</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Publica artículos tú mismo sin código. CMS incluido. Gestión autónoma completa. Clave para SEO continuo.
              </p>
              <div className="text-right">
                <span className="text-[#1a1a1a] font-bold text-2xl">210€</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-accent to-accent/80 text-white p-8 rounded-lg shadow-2xl">
              <div className="mb-4"><svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
              <h3 className="font-lora text-2xl font-bold mb-3">Sistema CRM</h3>
              <p className="text-white/90 mb-4 leading-relaxed">
                Formularios inteligentes + CRM. Cada lead se clasifica automáticamente. Adiós Excel, hola automatización.
              </p>
              <div className="text-right">
                <span className="font-bold text-3xl">470€</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a1a] to-gray-800 text-white p-8 rounded-lg shadow-2xl lg:col-span-2">
              <div className="flex justify-between items-start mb-4">
                <div className="text-5xl">🚀</div>
                <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold">NÚCLEO SEO</div>
              </div>
              <h3 className="font-lora text-3xl font-bold mb-3">76 Landing Pages SEO</h3>
              <p className="text-white/90 mb-4 text-lg leading-relaxed">
                El corazón de tu estrategia. Una página específica para cada combinación de servicio + ciudad. &quot;Seguros de salud en Torrevieja&quot;, &quot;Abogados Murcia&quot;, &quot;Inmobiliarias Alicante&quot;...
              </p>
              <div className="bg-white/10 backdrop-blur p-4 rounded-lg mb-4">
                <p className="text-sm text-white/90">
                  <strong>Por qué funciona:</strong> Cuando alguien busca exactamente eso en Google, tu página aparece. Sin estas páginas, estarías invisible para el 90% de búsquedas locales específicas.
                </p>
              </div>
              <div className="text-right">
                <span className="text-gray-300 text-sm">3€ × 76 páginas</span><br/>
                <span className="font-bold text-4xl">228€</span>
              </div>
            </div>

            <div className="bg-white border-4 border-green-500 p-8 rounded-lg shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl">🛟</div>
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">INCLUIDO</div>
              </div>
              <h3 className="font-lora text-2xl font-bold mb-3 text-[#1a1a1a]">3 Meses Soporte</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Corrección de errores, ajustes, cambios menores, dudas... Todo cubierto durante 3 meses críticos.
              </p>
              <div className="text-right">
                <span className="text-gray-400 line-through">600€</span>
                <span className="ml-2 text-green-600 font-bold text-xl">GRATIS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOTAL VISUAL */}
      <section className="py-16 px-[5%] bg-gradient-to-br from-gray-900 to-[#1a1a1a] text-white">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-accent uppercase tracking-[3px] text-sm font-bold mb-4">INVERSIÓN TOTAL</p>
          <div className="text-[6rem] font-bold font-lora leading-none mb-2">1.498€</div>
          <p className="text-gray-400 text-lg">+ IVA | Plataforma completa con 76 landing pages SEO + 3 meses soporte</p>
        </div>
      </section>

      {/* RENDIMIENTO */}
      <section className="py-24 px-[5%] bg-white">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-lora text-[3rem] font-bold text-center mb-16 text-[#1a1a1a]">
            Garantías de Rendimiento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-32 h-32 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl font-bold text-accent">90+</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">PageSpeed</h3>
              <p className="text-gray-600">Velocidad optimizada. Google premia webs rápidas con mejor posicionamiento.</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl font-bold text-accent">100%</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Responsive</h3>
              <p className="text-gray-600">Perfecta en móviles, tablets y ordenadores. +70% de visitas son desde móvil.</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl font-bold text-accent">A+</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">SEO Ready</h3>
              <p className="text-gray-600">Estructura técnica lista para Google. Las 76 landings son tu base.</p>
            </div>
          </div>
        </div>
      </section>

      {/* QUÉ NO INCLUYE */}
      <section className="py-24 px-[5%] bg-gray-50">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-lora text-[3rem] font-bold text-center mb-6 text-[#1a1a1a]">
            Qué NO Está Incluido
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg max-w-[700px] mx-auto">
            Transparencia total. Estos servicios se contratan por separado:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border-l-4 border-gray-300">
              <div className="text-3xl mb-3">🌐</div>
              <h3 className="font-bold mb-2 text-gray-900">Dominio</h3>
              <p className="text-gray-600 text-sm mb-2">Tu dirección web (www.health4spain.com)</p>
              <p className="text-accent font-semibold">~12€/año</p>
            </div>
            <div className="bg-white p-6 rounded-lg border-l-4 border-gray-300">
              <div className="text-3xl mb-3">💾</div>
              <h3 className="font-bold mb-2 text-gray-900">Hosting</h3>
              <p className="text-gray-600 text-sm mb-2">Donde se aloja tu web</p>
              <p className="text-accent font-semibold">5-20€/mes</p>
            </div>
            <div className="bg-white p-6 rounded-lg border-l-4 border-gray-300">
              <div className="text-3xl mb-3">✍️</div>
              <h3 className="font-bold mb-2 text-gray-900">Artículos Blog</h3>
              <p className="text-gray-600 text-sm mb-2">Redacción de contenidos para blog</p>
              <p className="text-accent font-semibold">A presupuestar</p>
            </div>
            <div className="bg-white p-6 rounded-lg border-l-4 border-gray-300">
              <div className="text-3xl mb-3">📸</div>
              <h3 className="font-bold mb-2 text-gray-900">Fotos</h3>
              <p className="text-gray-600 text-sm mb-2">Usamos bancos o tus fotos</p>
              <p className="text-accent font-semibold">Opcional</p>
            </div>
            <div className="bg-white p-6 rounded-lg border-l-4 border-gray-300">
              <div className="text-3xl mb-3">🔧</div>
              <h3 className="font-bold mb-2 text-gray-900">Mantenimiento</h3>
              <p className="text-gray-600 text-sm mb-2">Después de 3 meses</p>
              <p className="text-accent font-semibold">A presupuestar</p>
            </div>
            <div className="bg-white p-6 rounded-lg border-l-4 border-gray-300">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold mb-2 text-gray-900">Marketing</h3>
              <p className="text-gray-600 text-sm mb-2">Google Ads, redes sociales</p>
              <p className="text-accent font-semibold">A presupuestar</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-32 px-[5%] bg-gradient-to-br from-[#1a1a1a] to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-[800px] mx-auto text-center">
          <h2 className="font-lora text-[3.5rem] font-bold mb-6 leading-tight">
            Lista Para Generar Leads
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Una inversión que se paga sola. Cada cliente que captes gracias al posicionamiento hace que valga la pena.
          </p>
        </div>
      </section>
    </>
  );
}
