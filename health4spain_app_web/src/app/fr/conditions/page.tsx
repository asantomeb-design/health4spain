import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'fr';
const t = getDictionary(locale);

export const metadata: Metadata = {
  title: t.terms.metaTitle,
  description: t.terms.metaDesc,
  alternates: buildAlternates(locale, '/conditions'),
};

export default function ConditionsPage() {
  return (
    <div className="section">
      <div className="container-narrow">
        <h1 className="mb-12">{t.terms.title}</h1>

        <p className="text-gray-600 mb-12">
          <strong>{t.terms.lastUpdate}:</strong> Janvier 2026
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="mb-6 text-2xl font-bold">1. Acceptation des Conditions</h2>
            <p className="text-gray-700 leading-relaxed">
              En utilisant Health4Spain, vous acceptez ces conditions générales. Si vous n&apos;êtes pas d&apos;accord avec une partie de ces conditions, vous ne devez pas utiliser nos services.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">2. Description du Service</h2>
            <p className="text-gray-700 leading-relaxed">
              Health4Spain est une plateforme de connexion qui met en relation les personnes souhaitant s&apos;installer en Espagne avec des professionnels vérifiés (avocats, courtiers d&apos;assurance, agents immobiliers et gestionnaires administratifs).
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">3. Pour les Utilisateurs</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Service Gratuit :</strong> L&apos;utilisation de Health4Spain est entièrement gratuite pour les utilisateurs finaux.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Sans Engagement :</strong> Vous n&apos;êtes pas obligé de contracter avec l&apos;un des professionnels que nous vous présentons.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Responsabilité :</strong> Health4Spain agit uniquement en tant qu&apos;intermédiaire. Nous ne sommes pas responsables des services fournis par les professionnels.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">4. Pour les Professionnels</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Vérification :</strong> Tous les professionnels doivent passer notre processus de vérification avant de recevoir des leads.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Commissions :</strong> Les professionnels paient une commission uniquement en cas de conversion (l&apos;utilisateur contracte le service).
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Conduite Professionnelle :</strong> Les professionnels doivent maintenir des normes éthiques et fournir des informations précises.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">5. Propriété Intellectuelle</h2>
            <p className="text-gray-700 leading-relaxed">
              Tous les contenus de Health4Spain, y compris les textes, images, logos et design, sont protégés par des droits de propriété intellectuelle.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">6. Limitation de Responsabilité</h2>
            <p className="text-gray-700 leading-relaxed">
              Health4Spain n&apos;est pas responsable de :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>La qualité des services fournis par les professionnels</li>
              <li>Les litiges entre utilisateurs et professionnels</li>
              <li>Les erreurs ou omissions dans les informations fournies</li>
              <li>Les dommages indirects ou consécutifs</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">7. Modifications</h2>
            <p className="text-gray-700 leading-relaxed">
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet immédiatement après leur publication sur le site.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">8. Droit Applicable</h2>
            <p className="text-gray-700 leading-relaxed">
              Ces conditions sont régies par le droit espagnol. Tout litige sera résolu devant les tribunaux d&apos;Espagne.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">9. Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              Pour toute question sur ces conditions, contactez-nous à : <a href="mailto:legal@health4spain.com" className="text-accent hover:underline font-medium ml-1">legal@health4spain.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
