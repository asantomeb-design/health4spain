import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'fr';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.privacy.metaTitle,
  description: t.privacy.metaDesc,
  alternates: buildAlternates(locale, '/confidentialite'),
};

export default function ConfidentialitePage() {
  return (
    <div className="section">
      <div className="container-narrow">
        <h1 className="mb-12">{t.privacy.title}</h1>

        <p className="text-gray-600 mb-12">
          <strong>{t.privacy.lastUpdate}:</strong> Janvier 2026
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="mb-6 text-2xl font-bold">1. Responsable du Traitement</h2>
            <p className="text-gray-700 leading-relaxed">
              Health4Spain est le responsable du traitement de vos données personnelles. Nous nous engageons à protéger votre vie privée et à garantir l&apos;utilisation sécurisée de vos informations personnelles.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">2. Données Que Nous Collectons</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Lorsque vous utilisez notre formulaire de contact, nous collectons :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Nom complet</li>
              <li>Adresse e-mail</li>
              <li>Numéro de téléphone (optionnel)</li>
              <li>Pays d&apos;origine</li>
              <li>Informations sur votre situation et vos besoins</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">3. Utilisation de Vos Données</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nous utilisons vos informations personnelles pour :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Vous connecter avec des professionnels vérifiés qui peuvent vous aider</li>
              <li>Répondre à vos demandes</li>
              <li>Vous envoyer des informations pertinentes sur nos services</li>
              <li>Améliorer nos services</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">4. Partage d&apos;Informations</h2>
            <p className="text-gray-700 leading-relaxed">
              Nous partageons vos informations uniquement avec les professionnels que nous sélectionnons spécifiquement pour votre cas (2-3 professionnels maximum). Nous ne vendons jamais vos données à des tiers à des fins marketing.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">5. Vos Droits</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Vous avez le droit de :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Accéder à vos données personnelles</li>
              <li>Rectifier les données incorrectes</li>
              <li>Demander la suppression de vos données</li>
              <li>Vous opposer au traitement de vos données</li>
              <li>Demander la portabilité de vos données</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">6. Sécurité</h2>
            <p className="text-gray-700 leading-relaxed">
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre l&apos;accès non autorisé, la modification, la divulgation ou la destruction.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">7. Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              Pour exercer vos droits ou pour toute question sur notre politique de confidentialité, contactez-nous à : <a href="mailto:privacidad@health4spain.com" className="text-accent hover:underline font-medium">privacidad@health4spain.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
