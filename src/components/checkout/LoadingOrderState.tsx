import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';

const LoadingOrderState: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[500px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div 
              className="w-20 h-20 bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <CreditCard className="h-10 w-10 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <LoadingSpinner size="lg" text="Traitement sécurisé de votre commande..." />
            </motion.div>
            
            <motion.div 
              className="mt-8 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm text-gray-500">
                🔒 Veuillez patienter, ne fermez pas cette page
              </p>
              <p className="text-xs text-gray-400">
                Votre paiement est en cours de traitement de manière sécurisée
              </p>
            </motion.div>

            {/* Animation de confiance */}
            <motion.div 
              className="mt-12 flex justify-center space-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              {['🔐', '💳', '✅'].map((emoji, index) => (
                <motion.div
                  key={index}
                  className="text-2xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                >
                  {emoji}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOrderState;