
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const PrivacyPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-800">Politique de Confidentialité</h1>
          <p className="text-gray-600 mt-2">Dernière mise à jour : Mai 2025</p>
        </div>

        <Card className="p-6 md:p-8">
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Chez Riziky Boutique, nous accordons une grande importance à la protection de votre vie privée et de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez notre site web ou nos services.
              </p>
              <p className="text-gray-700">
                En utilisant notre site, vous consentez à la collecte et à l'utilisation de vos informations conformément à cette politique. Si vous n'acceptez pas les termes de cette politique, veuillez ne pas utiliser notre site.
              </p>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">2. Informations que nous collectons</h2>
              <p className="text-gray-700 mb-4">
                Nous pouvons collecter les types d'informations suivants :
              </p>
              <h3 className="text-lg font-semibold mb-2">2.1. Informations personnelles identifiables</h3>
              <p className="text-gray-700 mb-4">
                Il s'agit d'informations qui peuvent être utilisées pour vous identifier personnellement, telles que :
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li>Nom et prénom</li>
                <li>Adresse e-mail</li>
                <li>Adresse postale</li>
                <li>Numéro de téléphone</li>
                <li>Informations de paiement (nous ne stockons pas les détails complets de votre carte de crédit)</li>
              </ul>
              <h3 className="text-lg font-semibold mb-2">2.2. Informations non-identifiables</h3>
              <p className="text-gray-700 mb-4">
                Il s'agit de données qui ne permettent pas de vous identifier personnellement, telles que :
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li>Données démographiques</li>
                <li>Comportement de navigation sur notre site</li>
                <li>Préférences d'achat</li>
                <li>Adresse IP</li>
                <li>Type de navigateur et d'appareil</li>
              </ul>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">3. Comment nous utilisons vos informations</h2>
              <p className="text-gray-700 mb-4">
                Nous utilisons les informations que nous collectons pour :
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li>Traiter vos commandes et paiements</li>
                <li>Vous envoyer des confirmations de commande et des mises à jour</li>
                <li>Vous fournir un service client</li>
                <li>Personnaliser votre expérience sur notre site</li>
                <li>Vous envoyer des informations marketing et promotionnelles (si vous y avez consenti)</li>
                <li>Améliorer notre site et nos services</li>
                <li>Détecter et prévenir la fraude</li>
                <li>Se conformer à nos obligations légales</li>
              </ul>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">4. Partage de vos informations</h2>
              <p className="text-gray-700 mb-4">
                Nous ne vendons, n'échangeons ni ne louons vos informations personnelles identifiables à des tiers. Nous pouvons partager vos informations dans les situations suivantes :
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li>Avec des prestataires de services tiers qui nous aident à exploiter notre site et à vous fournir nos services (traitement des paiements, livraison, service client)</li>
                <li>Pour se conformer à la loi, à une procédure judiciaire ou à une demande gouvernementale</li>
                <li>Pour protéger nos droits, notre propriété ou notre sécurité, ainsi que ceux de nos utilisateurs ou du public</li>
                <li>En cas de fusion, acquisition ou vente d'actifs, vos informations peuvent faire partie des actifs transférés</li>
              </ul>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">5. Cookies et technologies similaires</h2>
              <p className="text-gray-700 mb-4">
                Nous utilisons des cookies et des technologies de suivi similaires pour suivre l'activité sur notre site et conserver certaines informations. Les cookies sont des fichiers contenant une petite quantité de données qui peuvent inclure un identifiant unique anonyme.
              </p>
              <p className="text-gray-700 mb-4">
                Vous pouvez configurer votre navigateur pour qu'il refuse tous les cookies ou pour qu'il vous avertisse lorsqu'un cookie est envoyé. Cependant, si vous n'acceptez pas les cookies, vous ne pourrez peut-être pas utiliser certaines parties de notre site.
              </p>
              <p className="text-gray-700">
                Pour plus d'informations sur notre utilisation des cookies, veuillez consulter notre <a href="/cookies-policy" className="text-red-800 hover:underline">Politique de Cookies</a>.
              </p>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">6. Sécurité des données</h2>
              <p className="text-gray-700 mb-4">
                La sécurité de vos données est importante pour nous, mais n'oubliez pas qu'aucune méthode de transmission sur Internet ou de stockage électronique n'est sûre à 100%. Bien que nous nous efforcions d'utiliser des moyens commercialement acceptables pour protéger vos informations personnelles, nous ne pouvons garantir leur sécurité absolue.
              </p>
              <p className="text-gray-700">
                Nous mettons en œuvre diverses mesures de sécurité pour maintenir la sécurité de vos informations personnelles, y compris le cryptage, les pare-feu et l'accès restreint aux données.
              </p>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">7. Vos droits</h2>
              <p className="text-gray-700 mb-4">
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à d'autres lois applicables sur la protection des données, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li>Droit d'accès à vos données personnelles</li>
                <li>Droit de rectification des données inexactes</li>
                <li>Droit à l'effacement de vos données (« droit à l'oubli »)</li>
                <li>Droit à la limitation du traitement de vos données</li>
                <li>Droit à la portabilité des données</li>
                <li>Droit d'opposition au traitement de vos données</li>
                <li>Droit de ne pas faire l'objet d'une décision automatisée</li>
              </ul>
              <p className="text-gray-700">
                Pour exercer ces droits, veuillez nous contacter via les coordonnées fournies à la fin de cette politique.
              </p>
            </section>

            <Separator className="my-6" />

            <section>
              <h2 className="text-xl font-bold mb-4">8. Contact</h2>
              <p className="text-gray-700 mb-4">
                Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à :
              </p>
              <p className="text-gray-700">
                Email : <a href="mailto:privacy@rizikyboutique.fr" className="text-red-800 hover:underline">privacy@rizikyboutique.fr</a><br />
                Adresse : 123 Avenue de la Mode, 75001 Paris, France
              </p>
            </section>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default PrivacyPage;
