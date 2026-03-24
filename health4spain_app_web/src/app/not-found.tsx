import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-[5%] py-24">
      <div className="max-w-[800px] mx-auto text-center">
        {/* Large 404 */}
        <div className="font-lora text-[12rem] md:text-[16rem] font-bold text-gray-200 leading-none mb-8">
          404
        </div>

        {/* Message */}
        <h1 className="font-lora text-[3rem] md:text-[4rem] font-bold mb-6 text-[#1a1a1a]">
          Página No Encontrada
        </h1>
        
        <p className="text-[1.3rem] text-gray-600 leading-relaxed mb-8 max-w-[600px] mx-auto">
          Lo sentimos, la página que buscas no existe o aún no está disponible.
        </p>

        {/* Info box */}
        <div className="bg-gray-50 border-l-4 border-accent p-8 mb-12 text-left max-w-[600px] mx-auto">
          <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
            <span>ℹ️</span>
            <span>¿Cambiaste de idioma?</span>
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Actualmente solo tenemos contenido disponible en <strong>español</strong>. 
            Estamos trabajando en las versiones en inglés, alemán y francés.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            <strong>Próximamente:</strong> 🇬🇧 English • 🇩🇪 Deutsch • 🇫🇷 Français
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/es"
            className="inline-block bg-[#1a1a1a] text-white py-5 px-10 no-underline font-medium uppercase tracking-wider text-[0.85rem] transition-all hover:bg-accent"
          >
            Volver al Inicio
          </Link>
          <Link
            href="/es/solicitar"
            className="inline-block border-2 border-[#1a1a1a] text-[#1a1a1a] py-5 px-10 no-underline font-medium uppercase tracking-wider text-[0.85rem] transition-all hover:bg-[#1a1a1a] hover:text-white"
          >
            Contactar
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-6">
            Páginas Populares
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link 
              href="/es/destinos" 
              className="text-accent hover:underline text-sm uppercase tracking-wider"
            >
              Destinos
            </Link>
            <Link 
              href="/es/servicios" 
              className="text-accent hover:underline text-sm uppercase tracking-wider"
            >
              Servicios
            </Link>
            <Link 
              href="/es/blog" 
              className="text-accent hover:underline text-sm uppercase tracking-wider"
            >
              Historias
            </Link>
            <Link 
              href="/es/sobre-nosotros" 
              className="text-accent hover:underline text-sm uppercase tracking-wider"
            >
              Sobre Nosotros
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
