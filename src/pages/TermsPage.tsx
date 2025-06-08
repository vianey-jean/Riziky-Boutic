
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, FileText, Users, CreditCard, Truck, Lock, Scale, MessageCircle } from 'lucide-react';

const TermsPage = () => {
  const sections = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "1. Introduction",
      color: "from-blue-500 to-blue-600",
      content: (
        <div>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            Bienvenue sur <span className="font-semibold text-red-600">Riziky Boutique</span>. Les présentes Conditions Générales d'Utilisation régissent l'utilisation de notre site web et de tous les services associés. En accédant à notre site, vous acceptez de vous conformer à ces conditions et de les respecter. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-blue-600">Important :</span> Riziky Boutique se réserve le droit de modifier ces conditions à tout moment. Vous serez informé des changements importants, mais il est de votre responsabilité de consulter régulièrement cette page pour vous tenir informé des mises à jour.
            </p>
          </div>
        </div>
      )
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "2. Utilisation du Site",
      color: "from-green-500 to-green-600",
      content: (
        <div>
          <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            En utilisant notre site, vous vous engagez à respecter les règles suivantes :
          </p>
          <div className="grid gap-4 mb-6">
            {[
              "Fournir des informations exactes et complètes lors de la création d'un compte ou lors d'une commande",
              "Maintenir la confidentialité de votre mot de passe et assumer l'entière responsabilité de toutes les activités effectuées sous votre compte",
              "Ne pas utiliser le site d'une manière qui pourrait l'endommager ou compromettre sa sécurité",
              "Ne pas tenter d'accéder à des sections restreintes du site sans autorisation",
              "Ne pas utiliser le site pour des activités illégales ou non autorisées"
            ].map((rule, index) => (
              <div key={index} className="flex items-start bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{rule}</p>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
            <p className="text-gray-700 dark:text-gray-300">
              Nous nous réservons le droit de refuser le service, de fermer des comptes ou de supprimer ou modifier du contenu à notre seule discrétion.
            </p>
          </div>
        </div>
      )
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "3. Comptes Utilisateur",
      color: "from-purple-500 to-purple-600",
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Lorsque vous créez un compte sur notre site, vous devez fournir des informations <span className="font-semibold text-purple-600">exactes, complètes et à jour</span>. Le non-respect de cette obligation constitue une violation des Conditions Générales d'Utilisation et peut entraîner la résiliation immédiate de votre compte.
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
            <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-white flex items-center">
              <Shield className="h-5 w-5 text-purple-600 mr-2" />
              Sécurité de votre compte
            </h4>
            <p className="text-gray-700 dark:text-gray-300">
              Vous êtes responsable de la protection de votre mot de passe et de votre compte. Vous acceptez de ne pas révéler votre mot de passe à des tiers. Vous devez nous informer immédiatement de toute utilisation non autorisée de votre compte ou de toute autre violation de sécurité.
            </p>
          </div>
        </div>
      )
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "4. Produits et Services",
      color: "from-red-500 to-red-600",
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
              <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Disponibilité</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Tous les produits et services sont soumis à disponibilité. Les descriptions des produits et leurs prix sont susceptibles d'être modifiés à tout moment sans préavis.
              </p>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
              <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Limitations</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Nous nous réservons le droit de limiter les quantités de produits commandés et de refuser une commande à notre seule discrétion.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 rounded-2xl p-6">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Note importante :</span> Les couleurs des produits affichés sur le site peuvent varier légèrement des couleurs réelles en raison des paramètres d'affichage de votre écran.
            </p>
          </div>
        </div>
      )
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "5. Commandes et Paiements",
      color: "from-emerald-500 to-emerald-600",
      content: (
        <div className="space-y-6">
          <div className="grid gap-4">
            {[
              {
                title: "Informations requises",
                description: "Lorsque vous passez une commande, vous vous engagez à fournir des informations actuelles, complètes et exactes.",
                icon: <FileText className="h-5 w-5" />
              },
              {
                title: "Sécurité des paiements",
                description: "Tous les paiements sont traités de manière sécurisée par nos prestataires de services de paiement certifiés.",
                icon: <Shield className="h-5 w-5" />
              },
              {
                title: "Validation des commandes",
                description: "Nous nous réservons le droit d'annuler une commande en cas de problème de paiement ou si nous soupçonnons une fraude.",
                icon: <Lock className="h-5 w-5" />
              }
            ].map((item, index) => (
              <div key={index} className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: "6. Limitation de Responsabilité",
      color: "from-indigo-500 to-indigo-600",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800">
            <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-white flex items-center">
              <Shield className="h-5 w-5 text-indigo-600 mr-2" />
              Exclusions de responsabilité
            </h4>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Riziky Boutique ne sera pas responsable des dommages indirects, spéciaux, consécutifs ou punitifs résultant de l'utilisation ou de l'incapacité d'utiliser nos services ou produits.
            </p>
            <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4">
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                <span className="font-semibold">Limitation financière :</span> Notre responsabilité totale pour toutes réclamations liées à nos produits et services ne dépassera en aucun cas le montant que vous avez payé pour l'achat spécifique qui a donné lieu à la réclamation.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          {/* En-tête moderne */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-6 shadow-lg">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Conditions Générales d'Utilisation
            </h1>
            <div className="inline-flex items-center bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full px-6 py-3 shadow-md">
              <span className="text-gray-600 dark:text-gray-300">Dernière mise à jour : </span>
              <span className="font-semibold text-gray-800 dark:text-white ml-2">Mai 2025</span>
            </div>
          </div>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="prose max-w-none">
                {sections.map((section, index) => (
                  <div key={index}>
                    <section className="mb-12">
                      <div className="flex items-center mb-6">
                        <div className={`w-14 h-14 bg-gradient-to-r ${section.color} rounded-2xl flex items-center justify-center mr-4 shadow-lg`}>
                          {React.cloneElement(section.icon, { className: "h-6 w-6 text-white" })}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
                      </div>
                      {section.content}
                    </section>
                    {index < sections.length - 1 && (
                      <Separator className="my-8 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                    )}
                  </div>
                ))}

                <section className="mt-12">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">9. Contact</h2>
                  </div>
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-8 border border-teal-200 dark:border-teal-800">
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                      Pour toute question ou préoccupation concernant ces Conditions Générales d'Utilisation, 
                      n'hésitez pas à nous contacter à{' '}
                      <a 
                        href="mailto:contact@rizikyboutique.fr" 
                        className="inline-flex items-center font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors duration-300 relative group"
                      >
                        contact@rizikyboutique.fr
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full"></div>
                      </a>
                    </p>
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

export default TermsPage;
