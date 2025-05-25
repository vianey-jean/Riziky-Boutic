
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, RotateCcw, Phone, Star, Users, Award, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface TrustIndicator {
  icon: React.ReactNode;
  title: string;
  description: string;
  value?: string;
}

const TrustIndicators: React.FC = () => {
  const indicators: TrustIndicator[] = [
    {
      icon: <Shield className="h-6 w-6 text-green-600" />,
      title: "Paiement Sécurisé",
      description: "SSL 256-bit encryption",
      value: "100%"
    },
    {
      icon: <Truck className="h-6 w-6 text-blue-600" />,
      title: "Livraison Rapide",
      description: "Expédition en 24h",
      value: "Express"
    },
    {
      icon: <RotateCcw className="h-6 w-6 text-purple-600" />,
      title: "Retour Gratuit",
      description: "30 jours pour changer d'avis",
      value: "30j"
    },
    {
      icon: <Phone className="h-6 w-6 text-orange-600" />,
      title: "Support 24/7",
      description: "Assistance disponible",
      value: "Live"
    },
    {
      icon: <Star className="h-6 w-6 text-yellow-600" />,
      title: "Note Clients",
      description: "Satisfaction garantie",
      value: "4.8/5"
    },
    {
      icon: <Users className="h-6 w-6 text-red-600" />,
      title: "Clients Satisfaits",
      description: "Communauté active",
      value: "50K+"
    },
    {
      icon: <Award className="h-6 w-6 text-indigo-600" />,
      title: "Certifié",
      description: "Qualité premium",
      value: "ISO"
    },
    {
      icon: <Clock className="h-6 w-6 text-teal-600" />,
      title: "Depuis 2020",
      description: "Expérience prouvée",
      value: "4 ans"
    }
  ];

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Pourquoi nous faire confiance ?
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Des milliers de clients nous font déjà confiance
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {indicators.map((indicator, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <Card className="p-4 text-center hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-2">
                {indicator.icon}
              </div>
              
              {indicator.value && (
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {indicator.value}
                </div>
              )}
              
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                {indicator.title}
              </h3>
              
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {indicator.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrustIndicators;
