import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const LOCALE: Locale = 'es';
const t = getDictionary(LOCALE);

export const metadata: Metadata = {
  title: t.cookies.metaTitle,
  description: t.cookies.metaDesc,
  alternates: buildAlternates(LOCALE, '/cookies'),
};

export default function CookiesPage() {
  return (
    <div className="section">
      <div className="container-narrow">
        <h1 className="mb-12">{t.cookies.title}</h1>
        
        <p className="text-gray-600 mb-12">
          <strong>{t.cookies.lastUpdate}:</strong> Enero 2026
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="mb-6 text-2xl font-bold">¿Qué son las cookies?</h2>
            <p className="text-gray-700 leading-relaxed">
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas 
              nuestro sitio web. Nos ayudan a mejorar tu experiencia y entender cómo utilizas nuestro sitio.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Cookies que utilizamos</h2>
            
            <div className="mb-8">
              <h3 className="font-semibold text-xl mb-3">Cookies Esenciales</h3>
              <p className="text-gray-700 leading-relaxed">
                Estas cookies son necesarias para el funcionamiento básico del sitio web. 
                No pueden ser desactivadas.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
                <li>Cookies de sesión</li>
                <li>Cookies de preferencias de idioma</li>
                <li>Cookies de seguridad</li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-xl mb-3">Cookies de Análisis</h3>
              <p className="text-gray-700 leading-relaxed">
                Utilizamos estas cookies para entender cómo los visitantes interactúan con nuestro sitio.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
                <li>Google Analytics (si está habilitado)</li>
                <li>Cookies de seguimiento de rendimiento</li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-xl mb-3">Cookies de Marketing</h3>
              <p className="text-gray-700 leading-relaxed">
                Estas cookies nos ayudan a mostrar contenido relevante y medir la efectividad 
                de nuestras campañas.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Gestión de cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Puedes modificar tu consentimiento en cualquier momento mediante el enlace &quot;Modificar consentimiento 
              de cookies&quot; que encontrarás en el pie de página de nuestro sitio web.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              También puedes controlar y/o eliminar las cookies como desees. Puedes eliminar todas las cookies 
              que ya están en tu dispositivo y configurar la mayoría de los navegadores para que no se coloquen.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Ten en cuenta que si eliminas las cookies o no aceptas las cookies de terceros, 
              es posible que no puedas utilizar todas las funciones de nuestro sitio web.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Cookies de terceros</h2>
            <p className="text-gray-700 leading-relaxed">
              Utilizamos servicios de terceros que pueden establecer cookies en tu dispositivo:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Google Analytics para análisis web</li>
              <li>Plataformas de redes sociales para compartir contenido</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Actualizaciones de esta política</h2>
            <p className="text-gray-700 leading-relaxed">
              Podemos actualizar esta política de cookies periódicamente. Te recomendamos que la revises 
              regularmente para estar informado sobre cómo utilizamos las cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Contacto</h2>
            <p className="text-gray-700 leading-relaxed">
              Si tienes preguntas sobre nuestra política de cookies, contáctanos en: 
              <a href="mailto:info@health4spain.com" className="text-accent hover:underline font-medium ml-1">info@health4spain.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
