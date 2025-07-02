import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import PaymentMethods from '@/components/checkout/PaymentMethods';

interface PaymentFormProps {
  paymentMethod: string;
  loading: boolean;
  onMethodChange: (method: string) => void;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  onBackToShipping: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  paymentMethod,
  loading,
  onMethodChange,
  onSubmit,
  onBackToShipping
}) => {
  return (
    <form onSubmit={onSubmit}>
      <motion.div 
        className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 via-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Méthode de paiement
            </h2>
            <p className="text-gray-600 mt-1">Choisissez votre mode de paiement sécurisé</p>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PaymentMethods 
            selectedMethod={paymentMethod}
            onMethodChange={onMethodChange}
          />
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="flex flex-col sm:flex-row justify-between gap-4 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Button 
          type="button" 
          variant="outline"
          onClick={onBackToShipping}
          className="flex items-center px-8 py-4 h-14 border-2 border-gray-300 hover:border-gray-400 rounded-xl transition-all duration-300 hover:scale-105"
        >
          Retour aux informations
        </Button>
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500 hover:from-green-600 hover:via-emerald-600 hover:to-blue-600 text-white px-10 py-4 h-14 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl hover:scale-105"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Traitement en cours...
            </>
          ) : (
            <>
              <Shield className="h-5 w-5 mr-2" />
              Confirmer la commande
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
};

export default PaymentForm;