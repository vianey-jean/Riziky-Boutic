
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Clock, CreditCard, TrendingUp, Gift, Sparkles, CheckCircle } from 'lucide-react';

const benefits = [
  { 
    icon: Shield, 
    text: "Paiements sécurisés", 
    description: "Toutes vos transactions sont protégées",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  },
  { 
    icon: Clock, 
    text: "Livraison rapide", 
    description: "Expédition sous 24-48h",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20"
  },
  { 
    icon: Award, 
    text: "Qualité garantie", 
    description: "Des produits sélectionnés avec soin",
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
  },
  { 
    icon: CreditCard, 
    text: "Paiement facile", 
    description: "Plusieurs méthodes de paiement",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20"
  },
  { 
    icon: TrendingUp, 
    text: "Top tendances", 
    description: "Produits à la mode",
    color: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-50 dark:bg-pink-900/20"
  },
  { 
    icon: Gift, 
    text: "Offres exclusives", 
    description: "Promotions régulières",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20"
  },
];

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
  hidden: { y: 30, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      type: "spring",
      stiffness: 100
    }
  }
};

interface BenefitsSectionProps {
  hidePrompts?: boolean;
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ hidePrompts = false }) => {
  if (hidePrompts) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-red-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-red-950 py-16 border-t border-neutral-200 dark:border-neutral-800">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-red-100 dark:bg-red-900/20 rounded-full -translate-x-32 -translate-y-32 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-100 dark:bg-blue-900/20 rounded-full translate-x-24 translate-y-24 opacity-50"></div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="container mx-auto px-4 relative"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6 text-red-600 dark:text-red-400" />
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Pourquoi choisir Riziky Boutique ?
            </h2>
            <Sparkles className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mx-auto"
          />
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="group text-center p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-neutral-700"
            >
              <motion.div 
                className={`${benefit.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <div className={`bg-gradient-to-r ${benefit.color} p-2 rounded-xl`}>
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
              </motion.div>
              
              <motion.h3 
                className="font-bold text-lg mb-2 text-gray-800 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {benefit.text}
              </motion.h3>
              
              <motion.p 
                className="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.4 }}
              >
                {benefit.description}
              </motion.p>
              
              {/* Indicateur de vérification */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="mt-3"
              >
                <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        {/* Section de confiance supplémentaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 px-8 rounded-2xl inline-block shadow-lg">
            <p className="text-lg font-semibold">
              ✨ Plus de 10,000 clients satisfaits nous font confiance
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default BenefitsSection;
