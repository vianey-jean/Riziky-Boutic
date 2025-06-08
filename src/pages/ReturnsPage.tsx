
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Shield, Package, Truck, CreditCard, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const ReturnsPage = () => {
  const steps = [
    {
      number: 1,
      title: "Contactez-nous",
      description: "Contactez notre service client par email ou téléphone pour obtenir un numéro de retour.",
      icon: <Shield className="h-6 w-6" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      number: 2,
      title: "Préparez votre colis",
      description: "Emballez soigneusement l'article avec son emballage d'origine et le justificatif d'achat.",
      icon: <Package className="h-6 w-6" />,
      color: "from-green-500 to-green-600"
    },
    {
      number: 3,
      title: "Expédiez le colis",
      description: "Envoyez le colis à l'adresse communiquée avec un service d'expédition avec suivi.",
      icon: <Truck className="h-6 w-6" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      number: 4,
      title: "Remboursement",
      description: "Recevez votre remboursement dans les 5 jours ouvrables après validation.",
      icon: <CreditCard className="h-6 w-6" />,
      color: "from-red-500 to-red-600"
    }
  ];

  const conditions = [
    "Être dans son état d'origine",
    "Ne pas avoir été utilisé ou porté",
    "Avoir toutes les étiquettes attachées",
    "Être dans son emballage d'origine",
    "Être accompagné du justificatif d'achat"
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          {/* En-tête moderne */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-6 shadow-lg">
              <Package className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Politique de retour
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Votre satisfaction est notre priorité. Retournez vos articles en toute simplicité sous 30 jours.
            </p>
          </div>

          {/* Section conditions */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conditions de retour</h2>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                Chez Riziky-Boutic, nous voulons que vous soyez entièrement satisfait de votre achat. 
                Si vous n'êtes pas satisfait pour quelque raison que ce soit, vous pouvez retourner votre article 
                dans les <span className="font-semibold text-red-600">30 jours</span> suivant la réception.
              </p>
              
              <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center">
                  <Clock className="h-5 w-5 text-red-600 mr-2" />
                  Pour être éligible à un retour, votre article doit :
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {conditions.map((condition, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mr-3"></div>
                      <span className="text-gray-700 dark:text-gray-300">{condition}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Procédure de retour */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-8 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full -translate-y-20 -translate-x-20"></div>
            <div className="relative">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                  <ArrowRight className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Procédure de retour</h2>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                Pour retourner un article, suivez ces <span className="font-semibold">4 étapes simples</span> :
              </p>
              
              <div className="grid lg:grid-cols-2 gap-6">
                {steps.map((step, index) => (
                  <div key={step.number} className="group">
                    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${step.color} opacity-10 rounded-full -translate-y-10 translate-x-10`}></div>
                      <div className="relative">
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg`}>
                            {step.number}
                          </div>
                          <div className={`w-10 h-10 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center text-white`}>
                            {step.icon}
                          </div>
                        </div>
                        <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">{step.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact info */}
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Informations de contact :</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email</p>
                      <p className="text-blue-600 dark:text-blue-400">retours@Riziky-Boutic.fr</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Téléphone</p>
                      <p className="text-green-600 dark:text-green-400">01 23 45 67 89</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Section remboursements */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -translate-y-16 -translate-x-16"></div>
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Remboursements</h2>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                Une fois votre retour reçu et inspecté, nous procéderons au remboursement sur votre moyen de paiement initial. 
                En fonction de la politique de votre banque, le remboursement peut prendre de <span className="font-semibold text-green-600">5 à 10 jours ouvrables</span> pour apparaître sur votre compte.
              </p>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-l-4 border-yellow-400 rounded-2xl p-6 mb-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Remboursement partiel</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Dans certains cas, un remboursement partiel peut être accordé (par exemple, si l'article présente des signes d'utilisation
                      ou si certains articles d'un lot retourné manquent).
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="font-semibold">Important :</span> Les frais de livraison pour le retour sont à la charge du client, sauf si l'article reçu est défectueux ou ne correspond
                  pas à la description.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnsPage;
