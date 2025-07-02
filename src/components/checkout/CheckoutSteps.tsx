import React from 'react';
import { motion } from 'framer-motion';
import { Truck, CreditCard } from 'lucide-react';

interface CheckoutStepsProps {
  currentStep: 'shipping' | 'payment';
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
  return (
    <motion.div 
      className="mb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex justify-between items-center max-w-md mx-auto">
        <motion.div 
          className={`flex flex-col items-center ${currentStep === 'shipping' ? 'scale-110' : ''}`}
          whileHover={{ scale: 1.05 }}
        >
          <div className={`w-12 h-12 mb-3 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
            currentStep === 'shipping' 
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-500 shadow-lg' 
              : 'bg-white text-gray-400 border-gray-300'
          }`}>
            <Truck className="h-6 w-6" />
          </div>
          <span className={`text-sm font-medium ${currentStep === 'shipping' ? 'text-red-600' : 'text-gray-500'}`}>
            Livraison
          </span>
        </motion.div>
        
        <div className="flex-1 h-1 mx-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-red-500 to-pink-500"
            initial={{ width: '0%' }}
            animate={{ width: currentStep === 'payment' ? '100%' : '0%' }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <motion.div 
          className={`flex flex-col items-center ${currentStep === 'payment' ? 'scale-110' : ''}`}
          whileHover={{ scale: 1.05 }}
        >
          <div className={`w-12 h-12 mb-3 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
            currentStep === 'payment' 
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-500 shadow-lg' 
              : 'bg-white text-gray-400 border-gray-300'
          }`}>
            <CreditCard className="h-6 w-6" />
          </div>
          <span className={`text-sm font-medium ${currentStep === 'payment' ? 'text-red-600' : 'text-gray-500'}`}>
            Paiement
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CheckoutSteps;