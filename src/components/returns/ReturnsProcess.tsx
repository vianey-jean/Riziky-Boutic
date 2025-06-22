import React from 'react';
import { ArrowRight, Shield, Package, Truck, CreditCard } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const ReturnsProcess = () => {
  const steps: Step[] = [
    {
      number: 1,
      title: "Contactez-nous",
      description: "Contactez notre service client par email ou téléphone pour obtenir un numéro de retour.",
      icon: <Shield className="h-6 w-6" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      number: 2,
      title: "Préparez votre colis",
      description: "Emballez soigneusement l'article avec son emballage d'origine et le justificatif d'achat.",
      icon: <Package className="h-6 w-6" />,
      color: "from-green-500 to-green-600"
    },
    {
      number: 3,
      title: "Expédiez le colis",
      description: "Envoyez le colis à l'adresse communiquée avec un service d'expédition avec suivi.",
      icon: <Truck className="h-6 w-6" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      number: 4,
      title: "Remboursement",
      description: "Recevez votre remboursement dans les 5 jours ouvrables après validation.",
      icon: <CreditCard className="h-6 w-6" />,
      color: "from-red-500 to-red-600"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-8 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full -translate-y-20 -translate-x-20"></div>
      <div className="relative">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
            <ArrowRight className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Procédure de retour :</h2>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
          Pour retourner un article, suivez ces <span className="font-semibold">4 étapes simples</span> :
        </p>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="group">
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${step.color} opacity-10 rounded-full -translate-y-10 translate-x-10`}></div>
                <div className="relative">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg`}>
                      {step.number}
                    </div>
                    <div className={`w-10 h-10 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center text-white`}>
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Informations de contact :</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email :</p>
                <p className="text-blue-600 dark:text-blue-400">retours@Riziky-Boutic.fr</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Téléphone :</p>
                <p className="text-green-600 dark:text-green-400">06 92 84 23 70</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsProcess;
