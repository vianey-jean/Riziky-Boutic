
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { EnhancedCard, EnhancedCardContent, EnhancedCardDescription, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card';
import { RotateCcw, Package, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const ReturnsPage = () => {
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white py-24">
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
                  <RotateCcw className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                Politique de retour
              </h1>
              <p className="text-xl text-orange-100 leading-relaxed max-w-2xl mx-auto">
                Votre satisfaction est notre priorité. Découvrez nos conditions de retour simples et transparentes
              </p>
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto space-y-12"
          >
            {/* Conditions de retour */}
            <motion.div variants={itemVariants}>
              <EnhancedCard className="border-0 shadow-xl">
                <EnhancedCardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <EnhancedCardTitle className="text-2xl">Conditions de retour</EnhancedCardTitle>
                  </div>
                </EnhancedCardHeader>
                <EnhancedCardContent className="space-y-6">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Chez Riziky-Boutic, nous voulons que vous soyez entièrement satisfait de votre achat. 
                    Si vous n'êtes pas satisfait pour quelque raison que ce soit, vous pouvez retourner votre article 
                    dans les 30 jours suivant la réception.
                  </p>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <h3 className="font-semibold mb-4 text-green-800 text-lg">Pour être éligible à un retour, votre article doit :</h3>
                    <ul className="space-y-3">
                      {[
                        "Être dans son état d'origine",
                        "Ne pas avoir été utilisé ou porté",
                        "Avoir toutes les étiquettes attachées",
                        "Être dans son emballage d'origine",
                        "Être accompagné du justificatif d'achat"
                      ].map((condition, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">{condition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            </motion.div>
            
            {/* Procédure de retour */}
            <motion.div variants={itemVariants}>
              <EnhancedCard className="border-0 shadow-xl">
                <EnhancedCardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <EnhancedCardTitle className="text-2xl">Procédure de retour</EnhancedCardTitle>
                  </div>
                  <EnhancedCardDescription>
                    Suivez ces étapes simples pour retourner votre article
                  </EnhancedCardDescription>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        step: "1",
                        title: "Contactez-nous",
                        description: "Contactez notre service client par email à retours@Riziky-Boutic.fr ou par téléphone au 01 23 45 67 89 pour nous informer de votre souhait de retourner un article. Nous vous fournirons un numéro de retour.",
                        gradient: "from-blue-500 to-cyan-500"
                      },
                      {
                        step: "2",
                        title: "Préparez votre colis",
                        description: "Emballez soigneusement l'article à retourner dans son emballage d'origine si possible. Joignez le numéro de retour et votre justificatif d'achat.",
                        gradient: "from-purple-500 to-pink-500"
                      },
                      {
                        step: "3",
                        title: "Expédiez le colis",
                        description: "Envoyez le colis à l'adresse que nous vous communiquerons. Nous vous recommandons d'utiliser un service d'expédition avec suivi.",
                        gradient: "from-orange-500 to-red-500"
                      },
                      {
                        step: "4",
                        title: "Remboursement",
                        description: "Une fois votre retour reçu et inspecté, nous vous informerons de l'approbation ou du rejet de votre remboursement. Si approuvé, votre remboursement sera traité dans les 5 jours ouvrables.",
                        gradient: "from-green-500 to-emerald-500"
                      }
                    ].map((step, index) => (
                      <motion.div 
                        key={index}
                        whileHover={{ y: -2 }}
                        className="relative"
                      >
                        <div className="bg-white border border-gray-200 rounded-xl p-6 h-full shadow-sm hover:shadow-lg transition-shadow duration-200">
                          <div className="flex items-center mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${step.gradient} text-white rounded-full flex items-center justify-center font-bold text-lg mr-4 shadow-lg`}>
                              {step.step}
                            </div>
                            <h3 className="font-semibold text-lg">{step.title}</h3>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            </motion.div>
            
            {/* Remboursements */}
            <motion.div variants={itemVariants}>
              <EnhancedCard className="border-0 shadow-xl">
                <EnhancedCardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <EnhancedCardTitle className="text-2xl">Remboursements</EnhancedCardTitle>
                  </div>
                </EnhancedCardHeader>
                <EnhancedCardContent className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    Une fois votre retour reçu et inspecté, nous procéderons au remboursement sur votre moyen de paiement initial. 
                    En fonction de la politique de votre banque, le remboursement peut prendre de 5 à 10 jours ouvrables pour apparaître sur votre compte.
                  </p>
                  
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-6 rounded-r-xl">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold mb-2 text-yellow-800">Remboursement partiel</h3>
                        <p className="text-sm text-yellow-700 leading-relaxed">
                          Dans certains cas, un remboursement partiel peut être accordé (par exemple, si l'article présente des signes d'utilisation
                          ou si certains articles d'un lot retourné manquent).
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <p className="text-gray-700 leading-relaxed">
                      Les frais de livraison pour le retour sont à la charge du client, sauf si l'article reçu est défectueux ou ne correspond
                      pas à la description.
                    </p>
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

export default ReturnsPage;
