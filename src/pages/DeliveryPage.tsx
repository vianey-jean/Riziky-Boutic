
import React from 'react';
import Layout from '@/components/layout/Layout';

const DeliveryPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-red-800">Informations de livraison</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Options de livraison</h2>
          
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2 text-red-800">Livraison standard</h3>
              <p className="text-gray-600">4-5 jours ouvrables</p>
              <p className="text-gray-600">3,99 € pour les commandes inférieures à 50 €</p>
              <p className="font-medium">GRATUIT pour les commandes supérieures à 50 €</p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2 text-red-800">Livraison express</h3>
              <p className="text-gray-600">1-2 jours ouvrables</p>
              <p className="font-medium">7,99 €</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 text-red-800">Livraison le jour même</h3>
              <p className="text-gray-600">Pour les commandes passées avant 11h00</p>
              <p className="text-gray-600">Disponible uniquement dans certaines villes</p>
              <p className="font-medium">14,99 €</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Délais de livraison</h2>
          
          <div className="space-y-4">
            <p>
              Les délais de livraison commencent à partir du moment où votre commande est confirmée et préparée
              (vous recevrez un email de confirmation). Les délais indiqués sont des estimations et peuvent varier 
              selon l'emplacement et les périodes de forte demande.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border p-4 rounded">
                <h3 className="font-semibold mb-2">France métropolitaine</h3>
                <ul className="list-disc ml-5 text-gray-600">
                  <li>Standard : 2-4 jours ouvrables</li>
                  <li>Express : 1-2 jours ouvrables</li>
                </ul>
              </div>
              
              <div className="border p-4 rounded">
                <h3 className="font-semibold mb-2">DOM-TOM et Corse</h3>
                <ul className="list-disc ml-5 text-gray-600">
                  <li>Standard : 5-10 jours ouvrables</li>
                  <li>Express : 3-5 jours ouvrables</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Suivi de commande</h2>
          
          <div className="space-y-4">
            <p>
              Dès que votre commande est expédiée, vous recevrez un email avec un numéro de suivi
              qui vous permettra de suivre votre colis en temps réel. Vous pourrez également consulter 
              l'état de votre commande dans votre espace client.
            </p>
            
            <p>
              Pour toute question concernant votre livraison, n'hésitez pas à contacter notre 
              service client à <span className="font-medium">livraison@Riziky-Boutic.fr</span> ou par téléphone
              au <span className="font-medium">01 23 45 67 89</span> (du lundi au vendredi de 9h à 18h).
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DeliveryPage;
