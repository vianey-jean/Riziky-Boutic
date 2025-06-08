import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Cookie, Shield, Settings, Eye, ExternalLink, Clock } from 'lucide-react';

const CookiesPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 rounded-none lg:rounded-3xl lg:mx-8 lg:mt-8 p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <Cookie className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Politique de Cookies</h1>
                <p className="text-orange-100 text-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Dernière mise à jour : Mai 2025
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto py-12 px-4">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
            <div className="p-8 md:p-12">
              <div className="prose max-w-none">
                <section className="mb-10">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl mr-4">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-0">1. Qu'est-ce qu'un cookie ?</h2>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500 mb-6">
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      Un cookie est un petit fichier texte qui est stocké sur votre ordinateur ou appareil mobile lorsque vous visitez un site web. Les cookies sont largement utilisés pour faire fonctionner les sites web ou les rendre plus efficaces, ainsi que pour fournir des informations aux propriétaires du site.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Les cookies permettent à un site web de reconnaître votre appareil et de mémoriser des informations sur votre visite, comme vos préférences de langue, la taille de la police, et d'autres paramètres d'affichage. Cela signifie que vous n'avez pas à saisir à nouveau ces informations lorsque vous revenez sur le site ou naviguez de page en page.
                    </p>
                  </div>
                </section>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px" />

                <section className="mb-10">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl mr-4">
                      <Settings className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-0">2. Types de cookies que nous utilisons</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
                      <h3 className="text-xl font-semibold mb-3 text-red-800">2.1. Cookies strictement nécessaires</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Ces cookies sont essentiels pour vous permettre de naviguer sur notre site web et d'utiliser ses fonctionnalités, telles que l'accès aux zones sécurisées du site. Sans ces cookies, les services que vous avez demandés, comme les achats en ligne, ne peuvent pas être fournis.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                      <h3 className="text-xl font-semibold mb-3 text-blue-800">2.2. Cookies de performance</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Ces cookies collectent des informations sur la façon dont les visiteurs utilisent un site web, par exemple quelles pages ils visitent le plus souvent, et s'ils reçoivent des messages d'erreur. Ces cookies ne collectent pas d'informations qui identifient un visiteur. Toutes les informations collectées par ces cookies sont agrégées et donc anonymes. Elles ne sont utilisées que pour améliorer le fonctionnement du site.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                      <h3 className="text-xl font-semibold mb-3 text-green-800">2.3. Cookies fonctionnels</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Ces cookies permettent au site web de se souvenir des choix que vous faites (comme votre nom d'utilisateur, votre langue ou la région dans laquelle vous vous trouvez) et de fournir des fonctionnalités améliorées et plus personnelles. Par exemple, un site web peut vous fournir des informations locales si il stocke dans un cookie la région dans laquelle vous vous trouvez actuellement.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                      <h3 className="text-xl font-semibold mb-3 text-purple-800">2.4. Cookies de ciblage ou publicitaires</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Ces cookies sont utilisés pour diffuser des publicités plus pertinentes pour vous et vos intérêts. Ils sont également utilisés pour limiter le nombre de fois que vous voyez une publicité et pour aider à mesurer l'efficacité des campagnes publicitaires. Ils se souviennent que vous avez visité un site web et cette information est partagée avec d'autres organisations, comme les annonceurs.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px" />

                <section className="mb-10">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl mr-4">
                      <ExternalLink className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-0">3. Cookies tiers</h2>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      En plus de nos propres cookies, nous pouvons également utiliser divers cookies tiers pour signaler les statistiques d'utilisation du site, diffuser des publicités, etc. Ces cookies sont notamment :
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <strong className="text-blue-600">Google Analytics</strong>
                        <p className="text-sm text-gray-600 mt-1">pour comprendre comment les visiteurs interagissent avec notre site</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <strong className="text-green-600">Google Ads</strong>
                        <p className="text-sm text-gray-600 mt-1">pour mesurer l'efficacité de nos campagnes publicitaires</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <strong className="text-purple-600">Facebook Pixel</strong>
                        <p className="text-sm text-gray-600 mt-1">pour mesurer l'efficacité de nos publicités sur Facebook</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <strong className="text-orange-600">Hotjar</strong>
                        <p className="text-sm text-gray-600 mt-1">pour comprendre le comportement des utilisateurs sur notre site</p>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px" />

                <section className="mb-10">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl mr-4">
                      <Settings className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-0">4. Comment gérer les cookies</h2>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      La plupart des navigateurs web vous permettent de contrôler la plupart des cookies via leurs paramètres. Vous pouvez généralement trouver ces paramètres dans le menu "options" ou "préférences" de votre navigateur. Pour comprendre ces paramètres, les liens suivants peuvent être utiles :
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <a href="https://support.google.com/chrome/answer/95647?hl=fr" target="_blank" rel="noopener noreferrer" className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-blue-600 hover:text-blue-700">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Paramètres de cookies dans Chrome
                      </a>
                      <a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener noreferrer" className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-blue-600 hover:text-blue-700">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Paramètres de cookies dans Firefox
                      </a>
                      <a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-blue-600 hover:text-blue-700">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Paramètres de cookies dans Edge
                      </a>
                      <a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-blue-600 hover:text-blue-700">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Paramètres de cookies dans Safari
                      </a>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Veuillez noter que la restriction des cookies peut avoir un impact sur les fonctionnalités de notre site web et de nombreux autres sites web que vous visitez. Par conséquent, il est recommandé de ne pas désactiver les cookies.
                    </p>
                  </div>
                </section>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px" />

                <section className="mb-10">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-3 rounded-xl mr-4">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-0">5. Consentement aux cookies</h2>
                  </div>
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-200">
                    <p className="text-gray-700 leading-relaxed">
                      Lorsque vous visitez notre site pour la première fois, nous vous demanderons de consentir à l'utilisation de cookies. Vous pouvez choisir d'accepter tous les cookies, de rejeter tous les cookies non essentiels, ou de personnaliser vos préférences. Vous pouvez modifier vos préférences à tout moment en utilisant notre outil de gestion des cookies accessible via un lien dans le pied de page de notre site.
                    </p>
                  </div>
                </section>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px" />

                <section>
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-br from-gray-500 to-gray-700 p-3 rounded-xl mr-4">
                      <Cookie className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-0">6. Contact</h2>
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200">
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      Si vous avez des questions concernant notre politique de cookies, veuillez nous contacter à :
                    </p>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <p className="text-gray-700">
                        Email : <a href="mailto:cookies@rizikyboutique.fr" className="text-red-600 hover:text-red-700 font-medium underline">cookies@rizikyboutique.fr</a><br />
                        Adresse : 123 Avenue de la Mode, 75001 Paris, France
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CookiesPage;
