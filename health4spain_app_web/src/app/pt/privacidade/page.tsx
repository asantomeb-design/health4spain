import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'pt';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.privacy.metaTitle,
  description: t.privacy.metaDesc,
  alternates: buildAlternates(locale, '/privacidade'),
};

export default function PrivacidadePage() {
  return (
    <div className="section">
      <div className="container-narrow">
        <h1 className="mb-12">{t.privacy.title}</h1>

        <p className="text-gray-600 mb-12">
          <strong>{t.privacy.lastUpdate}:</strong> Janeiro 2026
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="mb-6 text-2xl font-bold">1. Responsável pelo Tratamento</h2>
            <p className="text-gray-700 leading-relaxed">
              A Health4Spain é a responsável pelo tratamento dos seus dados pessoais. Comprometemo-nos a proteger a sua privacidade e garantir a utilização segura das suas informações pessoais.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">2. Dados Que Recolhemos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Quando utiliza o nosso formulário de contacto, recolhemos:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Nome completo</li>
              <li>Endereço de email</li>
              <li>Número de telefone (opcional)</li>
              <li>País de origem</li>
              <li>Informações sobre a sua situação e necessidades</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">3. Utilização dos Seus Dados</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Utilizamos as suas informações pessoais para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Conectá-lo com profissionais verificados que podem ajudá-lo</li>
              <li>Responder às suas consultas</li>
              <li>Enviar-lhe informações relevantes sobre os nossos serviços</li>
              <li>Melhorar os nossos serviços</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">4. Partilha de Informações</h2>
            <p className="text-gray-700 leading-relaxed">
              Partilhamos as suas informações apenas com os profissionais que selecionamos especificamente para o seu caso (máximo 2-3 profissionais). Nunca vendemos os seus dados a terceiros para fins de marketing.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">5. Os Seus Direitos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Tem o direito de:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Aceder aos seus dados pessoais</li>
              <li>Retificar dados incorretos</li>
              <li>Solicitar a eliminação dos seus dados</li>
              <li>Opor-se ao tratamento dos seus dados</li>
              <li>Solicitar a portabilidade dos seus dados</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">6. Segurança</h2>
            <p className="text-gray-700 leading-relaxed">
              Implementamos medidas de segurança técnicas e organizacionais para proteger os seus dados contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">7. Contacto</h2>
            <p className="text-gray-700 leading-relaxed">
              Para exercer os seus direitos ou fazer consultas sobre a nossa política de privacidade, contacte-nos em: <a href="mailto:privacidad@health4spain.com" className="text-accent hover:underline font-medium">privacidad@health4spain.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
