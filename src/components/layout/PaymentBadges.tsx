
import React from 'react';
import visa from "@/assets/visa.png"; 
import applepay from "@/assets/applepay.png"; 
import mastercard from "@/assets/mastercard.png"; 
import american from "@/assets/american.png"; 
import paypal from "@/assets/paypal.png";
import { Shield, Lock } from 'lucide-react';

interface PaymentBadgesProps {
  hidePrompts?: boolean;
}

const PaymentBadges: React.FC<PaymentBadgesProps> = ({ hidePrompts = false }) => {
  if (hidePrompts) return null;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-neutral-900 dark:to-neutral-800 py-12 border-t border-b border-neutral-200 dark:border-neutral-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6 text-green-600" />
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Paiement 100% Sécurisé
            </h3>
            <Lock className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Nous acceptons tous les moyens de paiement sécurisés</p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-8 mb-6">
          {[
            { src: visa, alt: "Visa", name: "Visa" },
            { src: mastercard, alt: "Mastercard", name: "Mastercard" },
            { src: american, alt: "American Express", name: "American Express" },
            { src: paypal, alt: "PayPal", name: "PayPal" },
            { src: applepay, alt: "Apple Pay", name: "Apple Pay" }
          ].map((payment, index) => (
            <div 
              key={payment.name}
              className="group relative bg-white dark:bg-neutral-800 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-neutral-700"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img 
                src={payment.src} 
                alt={payment.alt} 
                className="h-8 opacity-80 group-hover:opacity-100 transition-opacity duration-300 relative z-10" 
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Cryptage SSL 256-bit</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Transactions sécurisées</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span>Protection des données</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentBadges;
