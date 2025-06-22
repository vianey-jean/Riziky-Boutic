
import React from 'react';
import Layout from '@/components/layout/Layout';
import ReturnsHeader from '@/components/returns/ReturnsHeader';
import ReturnsConditions from '@/components/returns/ReturnsConditions';
import ReturnsProcess from '@/components/returns/ReturnsProcess';
import { CreditCard, Shield } from 'lucide-react';

const ReturnsPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <ReturnsHeader />
          <ReturnsConditions />
          <ReturnsProcess />
          
          {/* Section remboursements */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -translate-y-16 -translate-x-16"></div>
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Remboursements :</h2>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                Une fois votre retour reçu et inspecté, nous procéderons au remboursement sur votre moyen de paiement initial. 
                En fonction de la politique de votre banque, le remboursement peut prendre de <span className="font-semibold text-green-600">5 à 10 jours ouvrables</span> pour apparaître sur votre compte.
              </p>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-l-4 border-yellow-400 rounded-2xl p-6 mb-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Remboursement partiel :</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Dans certains cas, un remboursement partiel peut être accordé (par exemple, si l'article présente des signes d'utilisation
                      ou si certains articles d'un lot retourné manquent).
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="font-semibold">Important :</span> Les frais de livraison pour le retour sont à la charge du client, sauf si l'article reçu est défectueux ou ne correspond
                  pas à la description.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnsPage;
