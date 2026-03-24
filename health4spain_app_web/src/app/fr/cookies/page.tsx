import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const locale: Locale = 'fr';
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
          <strong>{t.cookies.lastUpdate}:</strong> Janvier 2026
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="mb-6 text-2xl font-bold">Qu&apos;est-ce que les cookies ?</h2>
            <p className="text-gray-700 leading-relaxed">
              Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez notre site. Ils nous aident à améliorer votre expérience et à comprendre comment vous utilisez notre site.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Cookies que nous utilisons</h2>

            <div className="mb-8">
              <h3 className="font-semibold text-xl mb-3">Cookies Essentiels</h3>
              <p className="text-gray-700 leading-relaxed">
                Ces cookies sont nécessaires au fonctionnement de base du site. Ils ne peuvent pas être désactivés.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
                <li>Cookies de session</li>
                <li>Cookies de préférence de langue</li>
                <li>Cookies de sécurité</li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-xl mb-3">Cookies d&apos;Analyse</h3>
              <p className="text-gray-700 leading-relaxed">
                Nous utilisons ces cookies pour comprendre comment les visiteurs interagissent avec notre site.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
                <li>Google Analytics (si activé)</li>
                <li>Cookies de suivi des performances</li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-xl mb-3">Cookies Marketing</h3>
              <p className="text-gray-700 leading-relaxed">
                Ces cookies nous aident à afficher du contenu pertinent et à mesurer l&apos;efficacité de nos campagnes.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Gestion des cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Vous pouvez modifier votre consentement à tout moment via le lien &quot;Modifier le consentement aux cookies&quot; dans le pied de page de notre site.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Vous pouvez également contrôler et/ou supprimer les cookies comme vous le souhaitez. Vous pouvez supprimer tous les cookies déjà sur votre appareil et configurer la plupart des navigateurs pour les bloquer.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Notez que si vous supprimez les cookies ou n&apos;acceptez pas les cookies tiers, vous ne pourrez peut-être pas utiliser toutes les fonctionnalités de notre site.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Cookies tiers</h2>
            <p className="text-gray-700 leading-relaxed">
              Nous utilisons des services tiers qui peuvent placer des cookies sur votre appareil :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Google Analytics pour l&apos;analyse web</li>
              <li>Plateformes de réseaux sociaux pour le partage de contenu</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Mises à jour de cette politique</h2>
            <p className="text-gray-700 leading-relaxed">
              Nous pouvons mettre à jour cette politique de cookies périodiquement. Nous vous recommandons de la consulter régulièrement pour rester informé de notre utilisation des cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              Pour toute question sur notre politique de cookies, contactez-nous à : <a href="mailto:info@health4spain.com" className="text-accent hover:underline font-medium ml-1">info@health4spain.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
