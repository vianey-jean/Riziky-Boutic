
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { EnhancedCard, EnhancedCardContent, EnhancedCardDescription, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card';
import { Truck, Clock, MapPin, Shield, Package, Star } from 'lucide-react';

const DeliveryPage = () => {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-24">
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
                  <Truck className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Informations de livraison
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
                Découvrez nos options de livraison flexibles et suivez votre commande en temps réel
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
            {/* Delivery Options */}
            <motion.div variants={itemVariants}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Options de livraison</h2>
                <p className="text-gray-600 text-lg">Choisissez l'option qui vous convient le mieux</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Package,
                    title: "Livraison standard",
                    duration: "4-5 jours ouvrables",
                    price: "3,99 €",
                    free: "GRATUIT pour les commandes > 50 €",
                    gradient: "from-green-500 to-emerald-500",
                    features: ["Suivi inclus", "Assurance colis", "Point relais disponible"]
                  },
                  {
                    icon: Clock,
                    title: "Livraison express",
                    duration: "1-2 jours ouvrables",
                    price: "7,99 €",
                    gradient: "from-orange-500 to-red-500",
                    features: ["Livraison prioritaire", "Suivi en temps réel", "SMS de notification"]
                  },
                  {
                    icon: Star,
                    title: "Livraison le jour même",
                    duration: "Commande avant 11h00",
                    price: "14,99 €",
                    subtitle: "Disponible dans certaines villes",
                    gradient: "from-purple-500 to-pink-500",
                    features: ["Livraison ultra-rapide", "Créneaux horaires", "Service premium"]
                  }
                ].map((option, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <EnhancedCard className="h-full border-0 shadow-xl">
                      <EnhancedCardHeader className="text-center">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${option.gradient} flex items-center justify-center shadow-lg`}>
                          <option.icon className="w-8 h-8 text-white" />
                        </div>
                        <EnhancedCardTitle className="text-xl">{option.title}</EnhancedCardTitle>
                        <EnhancedCardDescription className="text-base">
                          {option.duration}
                        </EnhancedCardDescription>
                      </EnhancedCardHeader>
                      <EnhancedCardContent className="text-center space-y-4">
                        <div className="space-y-2">
                          <div className="text-3xl font-bold text-gray-900">{option.price}</div>
                          {option.free && <div className="text-sm font-medium text-green-600">{option.free}</div>}
                          {option.subtitle && <div className="text-sm text-gray-500">{option.subtitle}</div>}
                        </div>
                        <div className="space-y-2">
                          {option.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center justify-center text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </EnhancedCardContent>
                    </EnhancedCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Delivery Areas */}
            <motion.div variants={itemVariants}>
              <EnhancedCard>
                <EnhancedCardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <EnhancedCardTitle>Zones de livraison</EnhancedCardTitle>
                  </div>
                  <EnhancedCardDescription>
                    Délais de livraison selon votre localisation
                  </EnhancedCardDescription>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        title: "France métropolitaine",
                        areas: [
                          { name: "Standard", time: "2-4 jours ouvrables" },
                          { name: "Express", time: "1-2 jours ouvrables" }
                        ],
                        gradient: "from-blue-100 to-indigo-100"
                      },
                      {
                        title: "DOM-TOM et Corse",
                        areas: [
                          { name: "Standard", time: "5-10 jours ouvrables" },
                          { name: "Express", time: "3-5 jours ouvrables" }
                        ],
                        gradient: "from-purple-100 to-pink-100"
                      }
                    ].map((zone, index) => (
                      <div key={index} className={`p-6 rounded-xl bg-gradient-to-br ${zone.gradient} border border-white/50`}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{zone.title}</h3>
                        <div className="space-y-3">
                          {zone.areas.map((area, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className="text-gray-700 font-medium">{area.name}</span>
                              <span className="text-gray-600">{area.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            </motion.div>

            {/* Tracking Info */}
            <motion.div variants={itemVariants}>
              <EnhancedCard>
                <EnhancedCardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <EnhancedCardTitle>Suivi de commande</EnhancedCardTitle>
                  </div>
                  <EnhancedCardDescription>
                    Restez informé à chaque étape de votre livraison
                  </EnhancedCardDescription>
                </EnhancedCardHeader>
                <EnhancedCardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Comment suivre votre commande</h3>
                      <div className="space-y-3">
                        {[
                          "Recevez un email de confirmation avec votre numéro de suivi",
                          "Consultez l'état de votre commande dans votre espace client",
                          "Suivez votre colis en temps réel sur notre site",
                          "Recevez des notifications SMS aux étapes clés"
                        ].map((step, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                              {index + 1}
                            </div>
                            <p className="text-gray-600 leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Besoin d'aide ?</h3>
                      <div className="space-y-3 text-sm">
                        <p className="text-gray-600">
                          Pour toute question concernant votre livraison, contactez notre service client :
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-700">Email :</span>
                            <span className="text-blue-600">livraison@riziky-boutique.com</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-700">Téléphone :</span>
                            <span className="text-blue-600">+262 123 456 789</span>
                          </div>
                          <div className="text-gray-500 text-xs">
                            Du lundi au vendredi de 9h à 18h
                          </div>
                        </div>
                      </div>
                    </div>
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

export default DeliveryPage;
