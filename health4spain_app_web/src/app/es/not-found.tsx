import Link from 'next/link';

export default function NotFoundES() {
  return (
    <div className="section min-h-[70vh] flex items-center justify-center">
      <div className="container-narrow text-center">
        {/* Large 404 */}
        <div className="text-[12rem] md:text-[16rem] font-bold text-gray-200 leading-none mb-8">
          404
        </div>

        {/* Message */}
        <h1 className="mb-6">
          Página No Encontrada
        </h1>
        
        <p className="text-[1.3rem] text-gray-600 leading-relaxed mb-12 max-w-[600px] mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/es"
            className="btn-minimal-lg"
          >
            Volver al Inicio
          </Link>
          <Link
            href="/es/solicitar"
            className="inline-block border-2 border-[#293f92] text-[#293f92] py-3 px-8 no-underline font-medium uppercase tracking-wider text-[0.85rem] transition-all hover:bg-[#293f92] hover:text-white"
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
              className="text-accent hover:underline text-sm uppercase tracking-wider font-medium"
            >
              Destinos
            </Link>
            <Link 
              href="/es/servicios" 
              className="text-accent hover:underline text-sm uppercase tracking-wider font-medium"
            >
              Servicios
            </Link>
            <Link 
              href="/es/blog" 
              className="text-accent hover:underline text-sm uppercase tracking-wider font-medium"
            >
              Blog
            </Link>
            <Link 
              href="/es/sobre-nosotros" 
              className="text-accent hover:underline text-sm uppercase tracking-wider font-medium"
            >
              Sobre Nosotros
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
