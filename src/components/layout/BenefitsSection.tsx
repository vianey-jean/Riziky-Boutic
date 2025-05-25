
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Clock, CreditCard, TrendingUp, Gift } from 'lucide-react';

const benefits = [
  { icon: Shield, text: "Paiements sécurisés", description: "Toutes vos transactions sont protégées" },
  { icon: Clock, text: "Livraison rapide", description: "Expédition sous 24-48h" },
  { icon: Award, text: "Qualité garantie", description: "Des produits sélectionnés avec soin" },
  { icon: CreditCard, text: "Paiement facile", description: "Plusieurs méthodes de paiement" },
  { icon: TrendingUp, text: "Top tendances", description: "Produits à la mode" },
  { icon: Gift, text: "Offres exclusives", description: "Promotions régulières" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

interface BenefitsSectionProps {
  hidePrompts?: boolean;
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ hidePrompts = false }) => {
  if (hidePrompts) return null;

  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="bg-white dark:bg-neutral-900 py-12 border-t border-neutral-200 dark:border-neutral-800"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Pourquoi choisir <span className="text-red-600">Riziky Boutique</span> ?
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center p-4"
            >
              <div className="bg-red-50 dark:bg-red-900/20 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                <benefit.icon className="h-7 w-7 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-medium mb-1">{benefit.text}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default BenefitsSection;
