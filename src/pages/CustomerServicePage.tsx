import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle, Clock, Users, HeadphonesIcon, Sparkles, ArrowRight } from 'lucide-react';

const CustomerServicePage = () => {
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadCustomerServiceData = async () => {
    // Simuler le chargement des données du service client
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-none lg:rounded-3xl lg:mx-8 lg:mt-8 p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <HeadphonesIcon className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Service Client</h1>
                <p className="text-blue-100 text-lg">Nous sommes là pour vous accompagner</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto py-12 px-4">
          <PageDataLoader
            fetchFunction={loadCustomerServiceData}
            onSuccess={handleDataSuccess}
            onMaxRetriesReached={handleMaxRetriesReached}
            loadingMessage="Chargement du service client..."
            loadingSubmessage="Préparation de notre assistance personnalisée..."
            errorMessage="Erreur de chargement du service client"
          >
            {/* Enhanced Contact Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* ... keep existing code (contact cards) */}
              <Card className="group p-8 flex flex-col items-center text-center border-0 shadow-xl bg-gradient-to-br from-white to-red-50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-red-800">Email</h2>
                <p className="text-gray-600 mb-4 text-lg">Nous répondons sous 24h</p>
                <div className="bg-red-100 px-4 py-2 rounded-xl">
                  <p className="font-bold text-red-800">contact@Riziky-Boutic.fr</p>
                </div>
              </Card>
              
              <Card className="group p-8 flex flex-col items-center text-center border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-blue-800">Téléphone</h2>
                <p className="text-gray-600 mb-4 text-lg">Lun-Ven 9h-18h</p>
                <div className="bg-blue-100 px-4 py-2 rounded-xl">
                  <p className="font-bold text-blue-800">01 23 45 67 89</p>
                </div>
              </Card>
              
              <Card className="group p-8 flex flex-col items-center text-center border-0 shadow-xl bg-gradient-to-br from-white to-green-50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-green-800">Chat en ligne</h2>
                <p className="text-gray-600 mb-6 text-lg">Assistance immédiate</p>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl px-6 py-3 transition-all duration-300 hover:shadow-lg" asChild>
                  <Link to="/chat" className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Démarrer un chat
                  </Link>
                </Button>
              </Card>
            </div>
            
            {/* Enhanced FAQ Section */}
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 mb-12">
              <div className="p-8">
                <div className="flex items-center mb-8">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl mr-4 shadow-lg">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">Questions fréquemment posées</h2>
                    <p className="text-gray-600 text-lg mt-2">Trouvez rapidement les réponses à vos questions</p>
                  </div>
                </div>
                
                <Accordion type="single" collapsible className="w-full space-y-4">
                  <AccordionItem value="item-1" className="border border-gray-200 rounded-xl px-6 shadow-sm hover:shadow-md transition-shadow">
                    <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                      Comment suivre ma commande ?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mt-2">
                      Vous pouvez suivre votre commande en vous connectant à votre compte client et en vous rendant dans la section "Mes commandes". 
                      Un numéro de suivi vous sera également envoyé par email dès que votre colis sera expédié.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2" className="border border-gray-200 rounded-xl px-6 shadow-sm hover:shadow-md transition-shadow">
                    <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:text-green-600">
                      Quels sont les délais de livraison ?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg mt-2">
                      Nos délais de livraison standard sont de 2 à 4 jours ouvrables pour la France métropolitaine. 
                      Pour plus d'informations, veuillez consulter notre <Link to="/livraison" className="text-green-600 hover:text-green-700 underline font-medium">page de livraison</Link>.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3" className="border border-gray-200 rounded-xl px-6 shadow-sm hover:shadow-md transition-shadow">
                    <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:text-orange-600">
                      Comment puis-je retourner un article ?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg mt-2">
                      Vous disposez de 30 jours à compter de la réception de votre commande pour retourner un article. 
                      Pour plus d'informations sur la procédure à suivre, consultez notre <Link to="/retours" className="text-orange-600 hover:text-orange-700 underline font-medium">politique de retours</Link>.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4" className="border border-gray-200 rounded-xl px-6 shadow-sm hover:shadow-md transition-shadow">
                    <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:text-purple-600">
                      Comment modifier ou annuler ma commande ?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mt-2">
                      Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant sa passation en contactant notre service client. 
                      Au-delà de ce délai, il est possible que votre commande soit déjà en cours de préparation et ne puisse plus être modifiée.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5" className="border border-gray-200 rounded-xl px-6 shadow-sm hover:shadow-md transition-shadow">
                    <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:text-teal-600">
                      Quels modes de paiement acceptez-vous ?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg mt-2">
                      Nous acceptons les paiements par carte bancaire (Visa, Mastercard), PayPal, et Apple Pay. Les paiements sont sécurisés et vos données ne sont jamais stockées sur nos serveurs.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </Card>
            
            {/* Enhanced Contact CTA */}
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-purple-500/5"></div>
              <div className="relative p-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-gradient-to-br from-red-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                    Nous contacter
                  </h2>
                  <p className="text-gray-700 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                    Vous n'avez pas trouvé la réponse à votre question ? N'hésitez pas à nous contacter directement via notre formulaire de contact.
                  </p>
                  <Button 
                    asChild 
                    className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-bold px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    <Link to="/contact" className="flex items-center">
                      <Mail className="h-6 w-6 mr-3" />
                      Formulaire de contact
                      <ArrowRight className="h-6 w-6 ml-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </PageDataLoader>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerServicePage;
