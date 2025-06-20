
import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

const ReturnsConditions = () => {
  const conditions = [
    "Être dans son état d'origine",
    "Ne pas avoir été utilisé ou porté",
    "Avoir toutes les étiquettes attachées",
    "Être dans son emballage d'origine",
    "Être accompagné du justificatif d'achat"
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="relative">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conditions de retour</h2>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
          Chez Riziky-Boutic, nous voulons que vous soyez entièrement satisfait de votre achat. 
          Si vous n'êtes pas satisfait pour quelque raison que ce soit, vous pouvez retourner votre article 
          dans les <span className="font-semibold text-red-600">30 jours</span> suivant la réception.
        </p>
        
        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
          <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center">
            <Clock className="h-5 w-5 text-red-600 mr-2" />
            Pour être éligible à un retour, votre article doit :
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {conditions.map((condition, index) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mr-3"></div>
                <span className="text-gray-700 dark:text-gray-300">{condition}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsConditions;
