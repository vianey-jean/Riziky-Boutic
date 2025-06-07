
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const CookiesPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-800">Politique de Cookies</h1>
          <p className="text-gray-600 mt-2">Dernière mise à jour : Mai 2025</p>
        </div>

        <Card className="p-6 md:p-8">
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">1. Qu'est-ce qu'un cookie ?</h2>
              <p className="text-gray-700 mb-4">
                Un cookie est un petit fichier texte qui est stocké sur votre ordinateur ou appareil mobile lorsque vous visitez un site web. Les cookies sont largement utilisés pour faire fonctionner les sites web ou les rendre plus efficaces, ainsi que pour fournir des informations aux propriétaires du site.
              </p>
              <p className="text-gray-700">
                Les cookies permettent à un site web de reconnaître votre appareil et de mémoriser des informations sur votre visite, comme vos préférences de langue, la taille de la police, et d'autres paramètres d'affichage. Cela signifie que vous n'avez pas à saisir à nouveau ces informations lorsque vous revenez sur le site ou naviguez de page en page.
              </p>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">2. Types de cookies que nous utilisons</h2>
              
              <h3 className="text-lg font-semibold mb-2">2.1. Cookies strictement nécessaires</h3>
              <p className="text-gray-700 mb-4">
                Ces cookies sont essentiels pour vous permettre de naviguer sur notre site web et d'utiliser ses fonctionnalités, telles que l'accès aux zones sécurisées du site. Sans ces cookies, les services que vous avez demandés, comme les achats en ligne, ne peuvent pas être fournis.
              </p>
              
              <h3 className="text-lg font-semibold mb-2">2.2. Cookies de performance</h3>
              <p className="text-gray-700 mb-4">
                Ces cookies collectent des informations sur la façon dont les visiteurs utilisent un site web, par exemple quelles pages ils visitent le plus souvent, et s'ils reçoivent des messages d'erreur. Ces cookies ne collectent pas d'informations qui identifient un visiteur. Toutes les informations collectées par ces cookies sont agrégées et donc anonymes. Elles ne sont utilisées que pour améliorer le fonctionnement du site.
              </p>
              
              <h3 className="text-lg font-semibold mb-2">2.3. Cookies fonctionnels</h3>
              <p className="text-gray-700 mb-4">
                Ces cookies permettent au site web de se souvenir des choix que vous faites (comme votre nom d'utilisateur, votre langue ou la région dans laquelle vous vous trouvez) et de fournir des fonctionnalités améliorées et plus personnelles. Par exemple, un site web peut vous fournir des informations locales si il stocke dans un cookie la région dans laquelle vous vous trouvez actuellement.
              </p>
              
              <h3 className="text-lg font-semibold mb-2">2.4. Cookies de ciblage ou publicitaires</h3>
              <p className="text-gray-700 mb-4">
                Ces cookies sont utilisés pour diffuser des publicités plus pertinentes pour vous et vos intérêts. Ils sont également utilisés pour limiter le nombre de fois que vous voyez une publicité et pour aider à mesurer l'efficacité des campagnes publicitaires. Ils se souviennent que vous avez visité un site web et cette information est partagée avec d'autres organisations, comme les annonceurs.
              </p>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">3. Cookies tiers</h2>
              <p className="text-gray-700 mb-4">
                En plus de nos propres cookies, nous pouvons également utiliser divers cookies tiers pour signaler les statistiques d'utilisation du site, diffuser des publicités, etc. Ces cookies sont notamment :
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li><strong>Google Analytics</strong> : pour comprendre comment les visiteurs interagissent avec notre site</li>
                <li><strong>Google Ads</strong> : pour mesurer l'efficacité de nos campagnes publicitaires</li>
                <li><strong>Facebook Pixel</strong> : pour mesurer l'efficacité de nos publicités sur Facebook</li>
                <li><strong>Hotjar</strong> : pour comprendre le comportement des utilisateurs sur notre site</li>
              </ul>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">4. Comment gérer les cookies</h2>
              <p className="text-gray-700 mb-4">
                La plupart des navigateurs web vous permettent de contrôler la plupart des cookies via leurs paramètres. Vous pouvez généralement trouver ces paramètres dans le menu "options" ou "préférences" de votre navigateur. Pour comprendre ces paramètres, les liens suivants peuvent être utiles :
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li><a href="https://support.google.com/chrome/answer/95647?hl=fr" target="_blank" rel="noopener noreferrer" className="text-red-800 hover:underline">Paramètres de cookies dans Chrome</a></li>
                <li><a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener noreferrer" className="text-red-800 hover:underline">Paramètres de cookies dans Firefox</a></li>
                <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-red-800 hover:underline">Paramètres de cookies dans Edge</a></li>
                <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-red-800 hover:underline">Paramètres de cookies dans Safari</a></li>
              </ul>
              <p className="text-gray-700">
                Veuillez noter que la restriction des cookies peut avoir un impact sur les fonctionnalités de notre site web et de nombreux autres sites web que vous visitez. Par conséquent, il est recommandé de ne pas désactiver les cookies.
              </p>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">5. Consentement aux cookies</h2>
              <p className="text-gray-700">
                Lorsque vous visitez notre site pour la première fois, nous vous demanderons de consentir à l'utilisation de cookies. Vous pouvez choisir d'accepter tous les cookies, de rejeter tous les cookies non essentiels, ou de personnaliser vos préférences. Vous pouvez modifier vos préférences à tout moment en utilisant notre outil de gestion des cookies accessible via un lien dans le pied de page de notre site.
              </p>
            </section>

            <Separator className="my-6" />

            <section>
              <h2 className="text-xl font-bold mb-4">6. Contact</h2>
              <p className="text-gray-700 mb-4">
                Si vous avez des questions concernant notre politique de cookies, veuillez nous contacter à :
              </p>
              <p className="text-gray-700">
                Email : <a href="mailto:cookies@rizikyboutique.fr" className="text-red-800 hover:underline">cookies@rizikyboutique.fr</a><br />
                Adresse : 123 Avenue de la Mode, 75001 Paris, France
              </p>
            </section>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default CookiesPage;
