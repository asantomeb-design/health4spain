import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'pt';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.cookies.metaTitle,
  description: t.cookies.metaDesc,
  alternates: buildAlternates(locale, '/cookies'),
};

export default function CookiesPage() {
  return (
    <div className="section">
      <div className="container-narrow">
        <h1 className="mb-12">{t.cookies.title}</h1>

        <p className="text-gray-600 mb-12">
          <strong>{t.cookies.lastUpdate}:</strong> Janeiro 2026
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="mb-6 text-2xl font-bold">O que são cookies?</h2>
            <p className="text-gray-700 leading-relaxed">
              Os cookies são pequenos ficheiros de texto que são armazenados no seu dispositivo quando visita o nosso site. Ajudam-nos a melhorar a sua experiência e a entender como utiliza o nosso site.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Cookies que utilizamos</h2>

            <div className="mb-8">
              <h3 className="font-semibold text-xl mb-3">Cookies Essenciais</h3>
              <p className="text-gray-700 leading-relaxed">
                Estes cookies são necessários para o funcionamento básico do site. Não podem ser desativados.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
                <li>Cookies de sessão</li>
                <li>Cookies de preferência de idioma</li>
                <li>Cookies de segurança</li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-xl mb-3">Cookies de Análise</h3>
              <p className="text-gray-700 leading-relaxed">
                Utilizamos estes cookies para entender como os visitantes interagem com o nosso site.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
                <li>Google Analytics (se ativado)</li>
                <li>Cookies de rastreamento de desempenho</li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-xl mb-3">Cookies de Marketing</h3>
              <p className="text-gray-700 leading-relaxed">
                Estes cookies ajudam-nos a mostrar conteúdo relevante e a medir a eficácia das nossas campanhas.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Gestão de cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Pode modificar o seu consentimento a qualquer momento através da ligação &quot;Modificar consentimento de cookies&quot; no rodapé do nosso site.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Também pode controlar e/ou eliminar os cookies como desejar. Pode eliminar todos os cookies já no seu dispositivo e configurar a maioria dos navegadores para os bloquear.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Tenha em conta que se eliminar os cookies ou não aceitar cookies de terceiros, poderá não conseguir utilizar todas as funcionalidades do nosso site.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Cookies de terceiros</h2>
            <p className="text-gray-700 leading-relaxed">
              Utilizamos serviços de terceiros que podem colocar cookies no seu dispositivo:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Google Analytics para análise web</li>
              <li>Plataformas de redes sociais para partilha de conteúdo</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Atualizações desta política</h2>
            <p className="text-gray-700 leading-relaxed">
              Podemos atualizar esta política de cookies periodicamente. Recomendamos que a reveja regularmente para estar informado sobre como utilizamos os cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Contacto</h2>
            <p className="text-gray-700 leading-relaxed">
              Se tiver questões sobre a nossa política de cookies, contacte-nos em: <a href="mailto:info@health4spain.com" className="text-accent hover:underline font-medium ml-1">info@health4spain.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
