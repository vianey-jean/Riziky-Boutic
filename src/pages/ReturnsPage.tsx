
import React from 'react';
import Layout from '@/components/layout/Layout';

const ReturnsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-red-800">Politique de retour</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Conditions de retour</h2>
          
          <div className="space-y-4">
            <p>
              Chez Riziky-Boutic, nous voulons que vous soyez entièrement satisfait de votre achat. 
              Si vous n'êtes pas satisfait pour quelque raison que ce soit, vous pouvez retourner votre article 
              dans les 30 jours suivant la réception.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Pour être éligible à un retour, votre article doit :</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Être dans son état d'origine</li>
                <li>Ne pas avoir été utilisé ou porté</li>
                <li>Avoir toutes les étiquettes attachées</li>
                <li>Être dans son emballage d'origine</li>
                <li>Être accompagné du justificatif d'achat</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Procédure de retour</h2>
          
          <div className="space-y-4">
            <p>
              Pour retourner un article, veuillez suivre ces étapes simples :
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-red-800 text-white rounded-full flex items-center justify-center font-bold mr-3">1</div>
                  <h3 className="font-semibold">Contactez-nous</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Contactez notre service client par email à retours@Riziky-Boutic.fr ou par téléphone au 01 23 45 67 89 
                  pour nous informer de votre souhait de retourner un article. Nous vous fournirons un numéro de retour.
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-red-800 text-white rounded-full flex items-center justify-center font-bold mr-3">2</div>
                  <h3 className="font-semibold">Préparez votre colis</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Emballez soigneusement l'article à retourner dans son emballage d'origine si possible. 
                  Joignez le numéro de retour et votre justificatif d'achat.
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-red-800 text-white rounded-full flex items-center justify-center font-bold mr-3">3</div>
                  <h3 className="font-semibold">Expédiez le colis</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Envoyez le colis à l'adresse que nous vous communiquerons. 
                  Nous vous recommandons d'utiliser un service d'expédition avec suivi.
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-red-800 text-white rounded-full flex items-center justify-center font-bold mr-3">4</div>
                  <h3 className="font-semibold">Remboursement</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Une fois votre retour reçu et inspecté, nous vous informerons de l'approbation ou du rejet de votre remboursement. 
                  Si approuvé, votre remboursement sera traité dans les 5 jours ouvrables.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Remboursements</h2>
          
          <div className="space-y-4">
            <p>
              Une fois votre retour reçu et inspecté, nous procéderons au remboursement sur votre moyen de paiement initial. 
              En fonction de la politique de votre banque, le remboursement peut prendre de 5 à 10 jours ouvrables pour apparaître sur votre compte.
            </p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <h3 className="font-bold mb-1">Remboursement partiel</h3>
              <p className="text-sm">
                Dans certains cas, un remboursement partiel peut être accordé (par exemple, si l'article présente des signes d'utilisation
                ou si certains articles d'un lot retourné manquent).
              </p>
            </div>
            
            <p>
              Les frais de livraison pour le retour sont à la charge du client, sauf si l'article reçu est défectueux ou ne correspond
              pas à la description.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnsPage;
