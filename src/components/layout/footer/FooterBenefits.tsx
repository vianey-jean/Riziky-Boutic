
import React from 'react';
import { Shield, Truck, Heart, CreditCard } from 'lucide-react';

const FooterBenefits = () => {
  const benefits = [
    { icon: Shield, text: "Paiement sécurisé", color: "text-green-400" },
    { icon: Truck, text: "Livraison gratuite", color: "text-blue-400" },
    { icon: Heart, text: "Service client", color: "text-red-400" },
    { icon: CreditCard, text: "Garantie qualité", color: "text-purple-400" }
  ];

  return (
    <div className="border-b border-gray-800 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center justify-center space-x-2 group">
              <div className={`w-8 h-8 ${benefit.color} bg-white/10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-white/20`}>
                <benefit.icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
                {benefit.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FooterBenefits;
