
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { EnhancedCard, EnhancedCardContent } from '@/components/ui/enhanced-card';
import { Separator } from '@/components/ui/separator';
import { Cookie, Shield, Settings, Eye, Lock, ExternalLink } from 'lucide-react';

const CookiesPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 text-white py-24">
          <div className="absolute inset-0 bg-black/20"></div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 relative z-10"
          >
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Cookie className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
                Politique de Cookies
              </h1>
              <p className="text-xl text-amber-100 leading-relaxed max-w-2xl mx-auto">
                Découvrez comment nous utilisons les cookies pour améliorer votre expérience sur notre site
              </p>
              <div className="mt-8 inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <Cookie className="w-5 h-5" />
                <span>Dernière mise à jour : Mai 2025</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <EnhancedCard className="border-0 shadow-xl">
                <EnhancedCardContent className="p-8 md:p-12">
                  <div className="prose max-w-none">
                    <section className="mb-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                          <Cookie className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 m-0">1. Qu'est-ce qu'un cookie ?</h2>
                      </div>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        Un cookie est un petit fichier texte qui est stocké sur votre ordinateur ou appareil mobile lorsque vous visitez un site web. Les cookies sont largement utilisés pour faire fonctionner les sites web ou les rendre plus efficaces, ainsi que pour fournir des informations aux propriétaires du site.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Les cookies permettent à un site web de reconnaître votre appareil et de mémoriser des informations sur votre visite, comme vos préférences de langue, la taille de la police, et d'autres paramètres d'affichage. Cela signifie que vous n'avez pas à saisir à nouveau ces informations lorsque vous revenez sur le site ou naviguez de page en page.
                      </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                          <Settings className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 m-0">2. Types de cookies que nous utilisons</h2>
                      </div>
                      
                      <div className="space-y-6">
                        {[
                          {
                            title: "2.1. Cookies strictement nécessaires",
                            description: "Ces cookies sont essentiels pour vous permettre de naviguer sur notre site web et d'utiliser ses fonctionnalités, telles que l'accès aux zones sécurisées du site. Sans ces cookies, les services que vous avez demandés, comme les achats en ligne, ne peuvent pas être fournis.",
                            gradient: "from-red-100 to-pink-100",
                            icon: Lock
                          },
                          {
                            title: "2.2. Cookies de performance",
                            description: "Ces cookies collectent des informations sur la façon dont les visiteurs utilisent un site web, par exemple quelles pages ils visitent le plus souvent, et s'ils reçoivent des messages d'erreur. Ces cookies ne collectent pas d'informations qui identifient un visiteur. Toutes les informations collectées par ces cookies sont agrégées et donc anonymes.",
                            gradient: "from-blue-100 to-cyan-100",
                            icon: Eye
                          },
                          {
                            title: "2.3. Cookies fonctionnels",
                            description: "Ces cookies permettent au site web de se souvenir des choix que vous faites (comme votre nom d'utilisateur, votre langue ou la région dans laquelle vous vous trouvez) et de fournir des fonctionnalités améliorées et plus personnelles.",
                            gradient: "from-green-100 to-emerald-100",
                            icon: Settings
                          },
                          {
                            title: "2.4. Cookies de ciblage ou publicitaires",
                            description: "Ces cookies sont utilisés pour diffuser des publicités plus pertinentes pour vous et vos intérêts. Ils sont également utilisés pour limiter le nombre de fois que vous voyez une publicité et pour aider à mesurer l'efficacité des campagnes publicitaires.",
                            gradient: "from-purple-100 to-pink-100",
                            icon: Eye
                          }
                        ].map((cookieType, index) => (
                          <div key={index} className={`bg-gradient-to-r ${cookieType.gradient} p-6 rounded-xl border border-gray-200`}>
                            <div className="flex items-start space-x-4">
                              <div className="p-2 bg-white rounded-lg shadow-sm">
                                <cookieType.icon className="w-5 h-5 text-gray-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-900">{cookieType.title}</h3>
                                <p className="text-gray-700 leading-relaxed">{cookieType.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                          <ExternalLink className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 m-0">3. Cookies tiers</h2>
                      </div>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        En plus de nos propres cookies, nous pouvons également utiliser divers cookies tiers pour signaler les statistiques d'utilisation du site, diffuser des publicités, etc. Ces cookies sont notamment :
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { name: "Google Analytics", purpose: "pour comprendre comment les visiteurs interagissent avec notre site" },
                          { name: "Google Ads", purpose: "pour mesurer l'efficacité de nos campagnes publicitaires" },
                          { name: "Facebook Pixel", purpose: "pour mesurer l'efficacité de nos publicités sur Facebook" },
                          { name: "Hotjar", purpose: "pour comprendre le comportement des utilisateurs sur notre site" }
                        ].map((service, index) => (
                          <div key={index} className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border border-gray-200">
                            <div className="font-semibold text-gray-900 mb-1">{service.name}</div>
                            <div className="text-sm text-gray-600">{service.purpose}</div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                          <Settings className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 m-0">4. Comment gérer les cookies</h2>
                      </div>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        La plupart des navigateurs web vous permettent de contrôler la plupart des cookies via leurs paramètres. Vous pouvez généralement trouver ces paramètres dans le menu "options" ou "préférences" de votre navigateur. Pour comprendre ces paramètres, les liens suivants peuvent être utiles :
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        {[
                          { browser: "Chrome", url: "https://support.google.com/chrome/answer/95647?hl=fr" },
                          { browser: "Firefox", url: "https://support.mozilla.org/fr/kb/activer-desactiver-cookies" },
                          { browser: "Edge", url: "https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" },
                          { browser: "Safari", url: "https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" }
                        ].map((browser, index) => (
                          <a 
                            key={index}
                            href={browser.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors duration-200 group"
                          >
                            <ExternalLink className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                            <span className="text-blue-600 group-hover:text-blue-700 font-medium">Paramètres de cookies dans {browser.browser}</span>
                          </a>
                        ))}
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        Veuillez noter que la restriction des cookies peut avoir un impact sur les fonctionnalités de notre site web et de nombreux autres sites web que vous visitez. Par conséquent, il est recommandé de ne pas désactiver les cookies.
                      </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 m-0">5. Consentement aux cookies</h2>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        Lorsque vous visitez notre site pour la première fois, nous vous demanderons de consentir à l'utilisation de cookies. Vous pouvez choisir d'accepter tous les cookies, de rejeter tous les cookies non essentiels, ou de personnaliser vos préférences. Vous pouvez modifier vos préférences à tout moment en utilisant notre outil de gestion des cookies accessible via un lien dans le pied de page de notre site.
                      </p>
                    </section>

                    <Separator className="my-8" />

                    <section>
                      <h2 className="text-xl font-bold mb-4 text-gray-900">6. Contact</h2>
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          Si vous avez des questions concernant notre politique de cookies, veuillez nous contacter à :
                        </p>
                        <div className="space-y-2">
                          <p className="text-gray-700">
                            Email : <a href="mailto:cookies@rizikyboutique.fr" className="text-blue-600 hover:underline font-medium">cookies@rizikyboutique.fr</a>
                          </p>
                          <p className="text-gray-700">
                            Adresse : 123 Avenue de la Mode, 75001 Paris, France
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CookiesPage;
