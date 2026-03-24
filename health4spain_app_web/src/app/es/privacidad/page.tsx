import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const LOCALE: Locale = 'es';
const t = getDictionary(LOCALE);

export const metadata: Metadata = {
  title: t.privacy.metaTitle,
  description: t.privacy.metaDesc,
  alternates: buildAlternates(LOCALE, '/privacidad'),
};

export default function PrivacidadPage() {
  return (
    <div className="section">
      <div className="container-narrow">
        <h1 className="mb-12">{t.privacy.title}</h1>
        
        <p className="text-gray-600 mb-12">
          <strong>{t.privacy.lastUpdate}:</strong> Enero 2026
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="mb-6 text-2xl font-bold">1. Responsable del Tratamiento</h2>
            <p className="text-gray-700 leading-relaxed">
              Health4Spain es el responsable del tratamiento de tus datos personales. 
              Nos comprometemos a proteger tu privacidad y garantizar el uso seguro de tu información personal.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">2. Datos Que Recopilamos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cuando utilizas nuestro formulario de contacto, recopilamos:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Nombre completo</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono (opcional)</li>
              <li>País de origen</li>
              <li>Información sobre tu situación y necesidades</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">3. Uso de Tus Datos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Utilizamos tu información personal para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Conectarte con profesionales verificados que pueden ayudarte</li>
              <li>Responder a tus consultas</li>
              <li>Enviarte información relevante sobre nuestros servicios</li>
              <li>Mejorar nuestros servicios</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">4. Compartir Información</h2>
            <p className="text-gray-700 leading-relaxed">
              Compartimos tu información únicamente con los profesionales que seleccionamos específicamente 
              para tu caso (2-3 profesionales máximo). Nunca vendemos tus datos a terceros para fines de marketing.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">5. Tus Derechos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Tienes derecho a:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Acceder a tus datos personales</li>
              <li>Rectificar datos incorrectos</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Oponerte al procesamiento de tus datos</li>
              <li>Solicitar la portabilidad de tus datos</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">6. Seguridad</h2>
            <p className="text-gray-700 leading-relaxed">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos 
              contra acceso no autorizado, alteración, divulgación o destrucción.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">7. Contacto</h2>
            <p className="text-gray-700 leading-relaxed">
              Para ejercer tus derechos o hacer consultas sobre nuestra política de privacidad, 
              contáctanos en: <a href="mailto:privacidad@health4spain.com" className="text-accent hover:underline font-medium">privacidad@health4spain.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
