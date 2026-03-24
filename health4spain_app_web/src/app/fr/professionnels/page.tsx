import Link from 'next/link';
import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { localePath } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'fr';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.professionals.metaTitle,
  description: t.professionals.metaDesc,
  alternates: buildAlternates(locale, '/professionnels'),
};

export default function ProfessionnelsPage() {
  return (
    <>
      <section className="section">
        <div className="container-narrow text-center">
          <h1 className="mb-8">{t.professionals.title}</h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Développez votre activité avec des clients internationaux. Rejoignez notre réseau de professionnels vérifiés.
          </p>
        </div>
      </section>

      <section className="section-alt">
        <div className="container-narrow">
          <div className="bg-white border-t-3 border-accent p-8">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Si vous êtes avocat, courtier d&apos;assurance, agent immobilier ou gestionnaire administratif, Health4Spain peut être votre meilleure source de clients qualifiés. Vous ne payez que pour les résultats réels, sans frais mensuels ni engagement.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow text-center mb-16">
          <h2 className="mb-6">Avantages Pour Vous</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Ce que nous offrons à nos partenaires
          </p>
        </div>
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Leads Qualifiés', desc: 'Uniquement des contacts qui ont vraiment besoin de vos services et sont prêts à contracter. Pré-qualifiés par profil, localisation et besoin spécifique.' },
              { title: 'Paiement à la Conversion', desc: "Pas de frais mensuels. Vous ne payez que lorsqu'il y a conversion réelle : le client contracte votre service. Zéro risque, résultats garantis." },
              { title: 'Profil Vérifié', desc: 'Nous mettons en avant votre expérience avec les clients internationaux, les langues et spécialités. Votre badge vérifié génère une confiance immédiate.' },
              { title: 'Croissance Prévisible', desc: 'Flux constant de clients potentiels. Vous décidez combien de leads vous voulez recevoir par mois selon votre capacité.' },
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
          <h2 className="mb-6">Professionnels Que Nous Recherchons</h2>
        </div>
        <div className="container-narrow">
          <ul className="service-list-minimal">
            {[
              { title: 'Avocats', desc: 'Famille, civil, travail, immigration et plus. Toutes les spécialités.' },
              { title: 'Assurances', desc: 'Courtiers en assurance santé privée valables pour les visas' },
              { title: 'Immobilier', desc: 'Agences avec expérience en clients internationaux' },
              { title: 'Services Administratifs', desc: 'Gestion administrative, fiscale et sociale pour étrangers' },
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
          <h2 className="mb-6">Exigences Pour Devenir Partenaire</h2>
        </div>
        <div className="container-narrow">
          <div className="space-y-6">
            {[
              { title: 'Licences et Inscription Actives', desc: 'Vous devez être légalement enregistré en Espagne avec toutes les licences professionnelles requises.' },
              { title: 'Expérience Avec les Étrangers', desc: 'Minimum 2 ans de travail avec des clients internationaux. Références vérifiables.' },
              { title: 'Langues', desc: "En plus de l'espagnol, maîtrise d'au moins l'anglais (B2+). L'allemand ou le français est un plus." },
              { title: 'Capacité de Réponse', desc: 'Engagement à répondre aux leads en moins de 24 heures. Suivi professionnel.' },
              { title: 'Assurance Responsabilité Civile Professionnelle', desc: 'Police RC professionnelle active et en vigueur.' },
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
          <h2 className="mb-6">Comment Ça Marche</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Quatre étapes pour rejoindre notre réseau
          </p>
        </div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-12">
          {[
            { num: '1', title: 'Candidature', desc: 'Remplissez le formulaire avec vos infos professionnelles et spécialités' },
            { num: '2', title: 'Vérification', desc: 'Nous vérifions licences, références et expérience (2-5 jours)' },
            { num: '3', title: 'Activation', desc: 'Vous configurez votre profil et commencez à recevoir des leads qualifiés' },
            { num: '4', title: 'Conversion', desc: 'Vous ne payez que lorsque le client contracte votre service' },
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
          <h2 className="mb-12 text-center">Modèle de Commissions</h2>
          <div className="bg-white border-t-3 border-accent p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-6">Paiement à la Conversion</h3>
            <p className="text-gray-600 mb-8">
              Vous ne payez que lorsqu&apos;il y a conversion réelle. Les commissions varient selon le service :
            </p>
            <ul className="space-y-4">
              {[
                { label: 'Assurance Santé', value: '15-20% de la première année' },
                { label: 'Services Juridiques', value: '20-25% du service' },
                { label: 'Services Immobiliers', value: '15-20% de commission' },
                { label: 'Services Administratifs', value: '25-30% du service' },
              ].map((item, i) => (
                <li key={i} className="flex justify-between items-center py-4 border-b border-gray-200 last:border-0">
                  <span className="font-medium">{item.label}</span>
                  <span className="font-bold text-accent">{item.value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-600">
              <strong>Pas de frais mensuels.</strong> Pas d&apos;engagement minimum. Pas de coûts cachés. Vous ne payez que lorsque nous gagnons tous les deux.
            </p>
          </div>
        </div>
      </section>

      <section className="section-blue-dark">
        <div className="container-narrow text-center">
          <h2 className="mb-8" style={{ color: 'white' }}>Prêt à Développer Votre Activité ?</h2>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Rejoignez plus de 150 professionnels qui font déjà confiance à Health4Spain pour développer leur portefeuille de clients internationaux.
          </p>
          <Link href={localePath(locale, 'contact')} className="btn-minimal-white">
            Demander des Informations Partenaire
          </Link>
        </div>
      </section>
    </>
  );
}
