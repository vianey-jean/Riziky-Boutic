
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const CustomerServicePage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-red-800">Service Client</h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-2">Email</h2>
            <p className="text-gray-500 mb-4">Nous répondons sous 24h</p>
            <p className="font-medium text-red-800">contact@Riziky-Boutic.fr</p>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-2">Téléphone</h2>
            <p className="text-gray-500 mb-4">Lun-Ven 9h-18h</p>
            <p className="font-medium text-red-800">01 23 45 67 89</p>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-2">Chat en ligne</h2>
            <p className="text-gray-500 mb-4">Assistance immédiate</p>
            <Button className="bg-red-800 hover:bg-red-700" asChild>
              <Link to="/chat">Démarrer un chat</Link>
            </Button>
          </Card>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-10">
          <h2 className="text-xl font-bold mb-6">Questions fréquemment posées</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Comment suivre ma commande ?</AccordionTrigger>
              <AccordionContent>
                Vous pouvez suivre votre commande en vous connectant à votre compte client et en vous rendant dans la section "Mes commandes". 
                Un numéro de suivi vous sera également envoyé par email dès que votre colis sera expédié.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>Quels sont les délais de livraison ?</AccordionTrigger>
              <AccordionContent>
                Nos délais de livraison standard sont de 2 à 4 jours ouvrables pour la France métropolitaine. 
                Pour plus d'informations, veuillez consulter notre <Link to="/livraison" className="text-red-800 hover:underline">page de livraison</Link>.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Comment puis-je retourner un article ?</AccordionTrigger>
              <AccordionContent>
                Vous disposez de 30 jours à compter de la réception de votre commande pour retourner un article. 
                Pour plus d'informations sur la procédure à suivre, consultez notre <Link to="/retours" className="text-red-800 hover:underline">politique de retours</Link>.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Comment modifier ou annuler ma commande ?</AccordionTrigger>
              <AccordionContent>
                Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant sa passation en contactant notre service client. 
                Au-delà de ce délai, il est possible que votre commande soit déjà en cours de préparation et ne puisse plus être modifiée.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>Quels modes de paiement acceptez-vous ?</AccordionTrigger>
              <AccordionContent>
                Nous acceptons les paiements par carte bancaire (Visa, Mastercard), PayPal, et Apple Pay. Les paiements sont sécurisés et vos données ne sont jamais stockées sur nos serveurs.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="bg-red-50 border border-red-100 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Nous contacter</h2>
          <p className="mb-6">
            Vous n'avez pas trouvé la réponse à votre question ? N'hésitez pas à nous contacter directement via notre formulaire de contact.
          </p>
          <Button asChild className="bg-red-800 hover:bg-red-700">
            <Link to="/contact">Formulaire de contact</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerServicePage;
