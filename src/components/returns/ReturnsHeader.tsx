
import React from 'react';
import { Package } from 'lucide-react';

const ReturnsHeader = () => {
  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-6 shadow-lg">
        <Package className="h-10 w-10 text-white" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
        Politique de retour
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
        Votre satisfaction est notre priorité. Retournez vos articles en toute simplicité sous 30 jours.
      </p>
    </div>
  );
};

export default ReturnsHeader;
