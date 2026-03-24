import Link from 'next/link';
import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { localePath } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'pt';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.professionals.metaTitle,
  description: t.professionals.metaDesc,
  alternates: buildAlternates(locale, '/profissionais'),
};

export default function ProfissionaisPage() {
  return (
    <>
      <section className="section">
        <div className="container-narrow text-center">
          <h1 className="mb-8">{t.professionals.title}</h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Expanda o seu negócio com clientes internacionais. Junte-se à nossa rede de profissionais verificados.
          </p>
        </div>
      </section>

      <section className="section-alt">
        <div className="container-narrow">
          <div className="bg-white border-t-3 border-accent p-8">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Se é advogado, corretor de seguros, agente imobiliário ou gestor administrativo, a Health4Spain pode ser a sua melhor fonte de clientes qualificados. Só paga por resultados reais, sem taxas mensais nem compromissos mínimos.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Benefícios Para Si</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            O que oferecemos aos nossos parceiros
          </p>
        </div>
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Leads Qualificados', desc: 'Apenas contactos que realmente precisam dos seus serviços e estão prontos para contratar. Pré-qualificados por perfil, localização e necessidade específica.' },
              { title: 'Pagamento por Conversão', desc: 'Sem taxas mensais. Só paga quando há conversão real: o cliente contrata o seu serviço. Zero risco, resultados garantidos.' },
              { title: 'Perfil Verificado', desc: 'Destacamos a sua experiência com clientes internacionais, idiomas e especialidades. O seu distintivo verificado gera confiança imediata.' },
              { title: 'Crescimento Previsível', desc: 'Fluxo constante de clientes potenciais. Decide quantos leads quer receber por mês de acordo com a sua capacidade.' },
            ].map((item, i) => (
              <div key={i} className="profile-card">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{item.title}</h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-blue-light">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Profissionais Que Procuramos</h2>
        </div>
        <div className="container-narrow">
          <ul className="service-list-minimal">
            {[
              { title: 'Advogados', desc: 'Família, civil, trabalho, imigração e mais. Todas as especialidades.' },
              { title: 'Seguros', desc: 'Corretores de seguro de saúde privado válidos para vistos' },
              { title: 'Imobiliárias', desc: 'Agências com experiência em clientes internacionais' },
              { title: 'Assessorias', desc: 'Gestão administrativa, fiscal e laboral para estrangeiros' },
            ].map((item, i) => (
              <li key={i} className="service-item-minimal py-8">
                <div className="service-number">0{i + 1}</div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">{item.title}</h3>
                  <p className="text-base md:text-lg text-gray-600">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Requisitos Para Ser Parceiro</h2>
        </div>
        <div className="container-narrow">
          <div className="space-y-6">
            {[
              { title: 'Licenças e Registo Ativos', desc: 'Deve estar legalmente registado em Espanha com todas as licenças profissionais necessárias.' },
              { title: 'Experiência Com Estrangeiros', desc: 'Mínimo 2 anos a trabalhar com clientes internacionais. Referências verificáveis.' },
              { title: 'Idiomas', desc: 'Além do espanhol, domínio de pelo menos inglês (B2+). Alemão ou francês é um plus.' },
              { title: 'Capacidade de Resposta', desc: 'Compromisso de responder aos leads em menos de 24 horas. Acompanhamento profissional.' },
              { title: 'Seguro de Responsabilidade Civil Profissional', desc: 'Apólice de RC profissional ativa e vigente.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 pb-6 border-b border-gray-300 last:border-0">
                <svg className="w-6 h-6 text-accent mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-alt">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Como Funciona</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Quatro passos para se juntar à nossa rede
          </p>
        </div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-12">
          {[
            { num: '1', title: 'Candidatura', desc: 'Preencha o formulário com as suas informações profissionais e especialidades' },
            { num: '2', title: 'Verificação', desc: 'Analisamos licenças, referências e experiência (2-5 dias)' },
            { num: '3', title: 'Ativação', desc: 'Configura o seu perfil e começa a receber leads qualificados' },
            { num: '4', title: 'Conversão', desc: 'Só paga quando o cliente contrata o seu serviço' },
          ].map((item, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-number">{item.num}</div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container-narrow">
          <h2 className="mb-12 text-center">Modelo de Comissões</h2>
          <div className="bg-white border-t-3 border-accent p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-6">Pagamento por Conversão</h3>
            <p className="text-gray-600 mb-8">
              Só paga quando há conversão real. As comissões variam consoante o serviço:
            </p>
            <ul className="space-y-4">
              {[
                { label: 'Seguro de Saúde', value: '15-20% do primeiro ano' },
                { label: 'Serviços Jurídicos', value: '20-25% do serviço' },
                { label: 'Serviços Imobiliários', value: '15-20% de comissão' },
                { label: 'Serviços Administrativos', value: '25-30% do serviço' },
              ].map((item, i) => (
                <li key={i} className="flex justify-between items-center py-4 border-b border-gray-200 last:border-0">
                  <span className="font-medium">{item.label}</span>
                  <span className="font-bold text-accent">{item.value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-600">
              <strong>Sem taxas mensais.</strong> Sem compromisso mínimo. Sem custos ocultos. Só paga quando ambos ganhamos.
            </p>
          </div>
        </div>
      </section>

      <section className="section-blue-dark">
        <div className="container-narrow text-center">
          <h2 className="mb-8" style={{ color: 'white' }}>Pronto para Crescer o Seu Negócio?</h2>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Junte-se a mais de 150 profissionais que já confiam na Health4Spain para expandir o seu portfólio de clientes internacionais.
          </p>
          <Link href={localePath(locale, 'contact')} className="btn-minimal-white">
            Solicitar Informação de Parceiro
          </Link>
        </div>
      </section>
    </>
  );
}
