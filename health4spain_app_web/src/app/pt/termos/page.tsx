import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'pt';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.terms.metaTitle,
  description: t.terms.metaDesc,
  alternates: buildAlternates(locale, '/termos'),
};

export default function TermosPage() {
  return (
    <div className="section">
      <div className="container-narrow">
        <h1 className="mb-12">{t.terms.title}</h1>

        <p className="text-gray-600 mb-12">
          <strong>{t.terms.lastUpdate}:</strong> Janeiro 2026
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="mb-6 text-2xl font-bold">1. Aceitação dos Termos</h2>
            <p className="text-gray-700 leading-relaxed">
              Ao utilizar a Health4Spain, aceita estes termos e condições. Se não concordar com alguma parte destes termos, não deve utilizar os nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">2. Descrição do Serviço</h2>
            <p className="text-gray-700 leading-relaxed">
              A Health4Spain é uma plataforma de conexão que coloca em contacto pessoas que desejam estabelecer-se em Espanha com profissionais verificados (advogados, corretores de seguros, agentes imobiliários e gestores administrativos).
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">3. Para Utilizadores</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Serviço Gratuito:</strong> A utilização da Health4Spain é completamente gratuita para os utilizadores finais.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Sem Compromisso:</strong> Não está obrigado a contratar com nenhum dos profissionais que lhe apresentamos.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Responsabilidade:</strong> A Health4Spain atua apenas como intermediária. Não somos responsáveis pelos serviços prestados pelos profissionais.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">4. Para Profissionais</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Verificação:</strong> Todos os profissionais devem passar pelo nosso processo de verificação antes de receber leads.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Comissões:</strong> Os profissionais pagam uma comissão apenas quando há conversão (o utilizador contrata o serviço).
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Conduta Profissional:</strong> Os profissionais devem manter padrões éticos e fornecer informações precisas.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">5. Propriedade Intelectual</h2>
            <p className="text-gray-700 leading-relaxed">
              Todos os conteúdos da Health4Spain, incluindo textos, imagens, logos e design, estão protegidos por direitos de propriedade intelectual.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">6. Limitação de Responsabilidade</h2>
            <p className="text-gray-700 leading-relaxed">
              A Health4Spain não é responsável por:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>A qualidade dos serviços prestados pelos profissionais</li>
              <li>Disputas entre utilizadores e profissionais</li>
              <li>Erros ou omissões nas informações fornecidas</li>
              <li>Danos indiretos ou consequentes</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">7. Modificações</h2>
            <p className="text-gray-700 leading-relaxed">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a sua publicação no site.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">8. Lei Aplicável</h2>
            <p className="text-gray-700 leading-relaxed">
              Estes termos são regidos pelas leis espanholas. Qualquer disputa será resolvida nos tribunais de Espanha.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">9. Contacto</h2>
            <p className="text-gray-700 leading-relaxed">
              Para questões sobre estes termos, contacte-nos em: <a href="mailto:legal@health4spain.com" className="text-accent hover:underline font-medium ml-1">legal@health4spain.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
