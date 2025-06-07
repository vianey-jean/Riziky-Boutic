
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const TermsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-800">Conditions Générales d'Utilisation</h1>
          <p className="text-gray-600 mt-2">Dernière mise à jour : Mai 2025</p>
        </div>

        <Card className="p-6 md:p-8">
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Bienvenue sur Riziky Boutique. Les présentes Conditions Générales d'Utilisation régissent l'utilisation de notre site web et de tous les services associés. En accédant à notre site, vous acceptez de vous conformer à ces conditions et de les respecter. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.
              </p>
              <p className="text-gray-700">
                Riziky Boutique se réserve le droit de modifier ces conditions à tout moment. Vous serez informé des changements importants, mais il est de votre responsabilité de consulter régulièrement cette page pour vous tenir informé des mises à jour.
              </p>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">2. Utilisation du Site</h2>
              <p className="text-gray-700 mb-4">
                En utilisant notre site, vous vous engagez à :
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li>Fournir des informations exactes et complètes lors de la création d'un compte ou lors d'une commande</li>
                <li>Maintenir la confidentialité de votre mot de passe et assumer l'entière responsabilité de toutes les activités effectuées sous votre compte</li>
                <li>Ne pas utiliser le site d'une manière qui pourrait l'endommager ou compromettre sa sécurité</li>
                <li>Ne pas tenter d'accéder à des sections restreintes du site sans autorisation</li>
                <li>Ne pas utiliser le site pour des activités illégales ou non autorisées</li>
              </ul>
              <p className="text-gray-700">
                Nous nous réservons le droit de refuser le service, de fermer des comptes ou de supprimer ou modifier du contenu à notre seule discrétion.
              </p>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">3. Comptes Utilisateur</h2>
              <p className="text-gray-700 mb-4">
                Lorsque vous créez un compte sur notre site, vous devez fournir des informations exactes, complètes et à jour. Le non-respect de cette obligation constitue une violation des Conditions Générales d'Utilisation et peut entraîner la résiliation immédiate de votre compte.
              </p>
              <p className="text-gray-700">
                Vous êtes responsable de la protection de votre mot de passe et de votre compte. Vous acceptez de ne pas révéler votre mot de passe à des tiers. Vous devez nous informer immédiatement de toute utilisation non autorisée de votre compte ou de toute autre violation de sécurité.
              </p>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">4. Produits et Services</h2>
              <p className="text-gray-700 mb-4">
                Tous les produits et services sont soumis à disponibilité. Les descriptions des produits et leurs prix sont susceptibles d'être modifiés à tout moment sans préavis, à notre seule discrétion.
              </p>
              <p className="text-gray-700 mb-4">
                Nous nous réservons le droit de limiter les quantités de produits commandés. Nous nous réservons également le droit de refuser une commande à notre seule discrétion.
              </p>
              <p className="text-gray-700">
                Les couleurs des produits affichés sur le site peuvent varier légèrement des couleurs réelles en raison des paramètres d'affichage de votre écran.
              </p>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">5. Commandes et Paiements</h2>
              <p className="text-gray-700 mb-4">
                Lorsque vous passez une commande, vous vous engagez à fournir des informations actuelles, complètes et exactes pour toutes les commandes passées sur notre site.
              </p>
              <p className="text-gray-700 mb-4">
                Tous les paiements sont traités de manière sécurisée par nos prestataires de services de paiement. En passant une commande, vous acceptez les conditions générales de ces prestataires.
              </p>
              <p className="text-gray-700">
                Nous nous réservons le droit d'annuler une commande en cas de problème de paiement ou si nous soupçonnons une fraude.
              </p>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">6. Livraison</h2>
              <p className="text-gray-700 mb-4">
                Les délais de livraison sont donnés à titre indicatif et ne constituent pas une garantie. Nous ne sommes pas responsables des retards de livraison causés par des événements indépendants de notre contrôle.
              </p>
              <p className="text-gray-700">
                Les risques liés aux produits sont transférés à l'acheteur au moment de la livraison. Il est de la responsabilité de l'acheteur de vérifier l'état des produits à la réception et de signaler tout problème dans les délais spécifiés dans notre politique de retour.
              </p>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">7. Propriété Intellectuelle</h2>
              <p className="text-gray-700 mb-4">
                Le contenu du site, y compris mais sans s'y limiter, les textes, graphiques, images, logos, icônes, logiciels et tout autre matériel, est la propriété de Riziky Boutique ou de ses fournisseurs et est protégé par les lois nationales et internationales sur le droit d'auteur.
              </p>
              <p className="text-gray-700">
                Vous ne pouvez pas reproduire, modifier, distribuer ou afficher publiquement tout contenu du site sans notre autorisation écrite préalable.
              </p>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">8. Limitation de Responsabilité</h2>
              <p className="text-gray-700 mb-4">
                Riziky Boutique ne sera pas responsable des dommages indirects, spéciaux, consécutifs ou punitifs résultant de l'utilisation ou de l'incapacité d'utiliser nos services ou produits.
              </p>
              <p className="text-gray-700">
                Notre responsabilité totale pour toutes réclamations liées à nos produits et services ne dépassera en aucun cas le montant que vous avez payé pour l'achat spécifique qui a donné lieu à la réclamation.
              </p>
            </section>

            <Separator className="my-6" />

            <section>
              <h2 className="text-xl font-bold mb-4">9. Contact</h2>
              <p className="text-gray-700">
                Pour toute question ou préoccupation concernant ces Conditions Générales d'Utilisation, veuillez nous contacter à <a href="mailto:contact@rizikyboutique.fr" className="text-red-800 hover:underline">contact@rizikyboutique.fr</a>.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default TermsPage;
