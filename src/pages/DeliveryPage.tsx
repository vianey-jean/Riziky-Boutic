
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { Truck, Clock, MapPin, Shield, Star, CheckCircle } from 'lucide-react';

const DeliveryPage = () => {
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadDeliveryInfo = async () => {
    // Simuler le chargement des informations de livraison
    await new Promise(resolve => setTimeout(resolve, 800));
    return { loaded: true };
  };

  const handleDataSuccess = () => {
    setDataLoaded(true);
  };

  const handleMaxRetriesReached = () => {
    setDataLoaded(true);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/5 dark:via-indigo-500/5 dark:to-purple-500/5">
          <div className="absolute inset-0 bg-grid-neutral-100/50 dark:bg-grid-neutral-800/50" />
          <div className="container mx-auto px-4 py-16 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-2xl shadow-lg">
                  <Truck className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Informations de Livraison
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
                Découvrez nos options de livraison flexibles et sécurisées pour recevoir vos commandes en toute sérénité.
              </p>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-blue-500" />
                  <span>Livraison rapide</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>100% sécurisé</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>Service premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <PageDataLoader
            fetchFunction={loadDeliveryInfo}
            onSuccess={handleDataSuccess}
            onMaxRetriesReached={handleMaxRetriesReached}
            loadingMessage="Chargement des informations de livraison..."
            loadingSubmessage="Récupération de nos options de livraison..."
            errorMessage="Erreur de chargement des informations"
          >
            {/* Options de livraison */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-8 mb-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-xl mr-4">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Options de livraison
                </h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className="font-bold text-lg text-green-800 dark:text-green-400">Livraison standard :</h3>
                  </div>
                  <div className="space-y-2 text-neutral-600 dark:text-neutral-400">
                    <p className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-green-600" />
                      4-5 jours ouvrables
                    </p>
                    <p>Secteur du Sud est Payant et dépend du secteur</p>
                    <p className="font-semibold text-green-700 dark:text-green-400">
                      GRATUIT pour le secteur entre Sainte Suzanne vers Saint-Paul 
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center mb-4">
                    <Clock className="h-6 w-6 text-orange-600 mr-2" />
                    <h3 className="font-bold text-lg text-orange-800 dark:text-orange-400">Livraison express</h3>
                  </div>
                  <div className="space-y-2 text-neutral-600 dark:text-neutral-400">
                    <p className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-orange-600" />
                      1-2 jours ouvrables
                    </p>
                    <p className="font-semibold text-orange-700 dark:text-orange-400">L frais dépend du Secteur</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center mb-4">
                    <MapPin className="h-6 w-6 text-purple-600 mr-2" />
                    <h3 className="font-bold text-lg text-purple-800 dark:text-purple-400">Livraison le jour même</h3>
                  </div>
                  <div className="space-y-2 text-neutral-600 dark:text-neutral-400">
                    <p>Pour les commandes passées avant 11h00</p>
                    <p>Disponible uniquement dans certaines villes</p>
                    <p className="font-semibold text-purple-700 dark:text-purple-400">Dépend du secteur</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Délais de livraison */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-8 mb-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-xl mr-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Délais de livraison
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-xl p-6 border border-neutral-200 dark:border-neutral-600">
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Les délais de livraison commencent à partir du moment où votre commande est confirmée et préparée
                    (vous recevrez un email de confirmation). Les délais indiqués sont des estimations et peuvent varier 
                    selon l'emplacement et les périodes de forte demande.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                    <h3 className="font-bold text-lg mb-4 text-blue-800 dark:text-blue-400">France métropolitaine</h3>
                    <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                        Standard : 5 -7  jours ouvrables
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                        Express : 2 - 4 jours ouvrables
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                    <h3 className="font-bold text-lg mb-4 text-emerald-800 dark:text-emerald-400">DOM-TOM </h3>
                    <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mr-2" />
                        Standard : Dépend du secteur
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mr-2" />
                        Express : 5 - 7 jours ouvrables
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Suivi de commande */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl mr-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Suivi de commande
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                    Dès que votre commande est expédiée, vous recevrez un email avec un numéro de suivi
                    qui vous permettra de suivre votre colis en temps réel. Vous pourrez également consulter 
                    l'état de votre commande dans votre espace client.
                  </p>
                  
                  <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-green-300 dark:border-green-700">
                    <p className="text-neutral-700 dark:text-neutral-300">
                      Pour toute question concernant votre livraison, n'hésitez pas à contacter notre 
                      service client à <span className="font-semibold text-green-700 dark:text-green-400">livraison@Riziky-Boutic.fr</span> ou par téléphone
                      au <span className="font-semibold text-green-700 dark:text-green-400">06 92 84 23 70</span> (du lundi au vendredi de 9h à 18h).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </PageDataLoader>
        </div>
      </div>
    </Layout>
  );
};

export default DeliveryPage;
