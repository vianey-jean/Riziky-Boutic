
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { EnhancedCard, EnhancedCardContent, EnhancedCardDescription, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle, Clock, HelpCircle, Users } from 'lucide-react';

const CustomerServicePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white py-24">
          <div className="absolute inset-0 bg-black/20"></div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 relative z-10"
          >
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Users className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Service Client
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
                Notre équipe dédiée est là pour vous accompagner et répondre à toutes vos questions
              </p>
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto space-y-12"
          >
            {/* Contact Methods */}
            <motion.div variants={itemVariants}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Comment nous contacter</h2>
                <p className="text-gray-600 text-lg">Choisissez le moyen qui vous convient le mieux</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Mail,
                    title: "Email",
                    subtitle: "Nous répondons sous 24h",
                    content: "contact@Riziky-Boutic.fr",
                    gradient: "from-blue-500 to-cyan-500"
                  },
                  {
                    icon: Phone,
                    title: "Téléphone",
                    subtitle: "Lun-Ven 9h-18h",
                    content: "01 23 45 67 89",
                    gradient: "from-green-500 to-emerald-500"
                  },
                  {
                    icon: MessageCircle,
                    title: "Chat en ligne",
                    subtitle: "Assistance immédiate",
                    content: "Démarrer un chat",
                    gradient: "from-purple-500 to-pink-500",
                    action: true
                  }
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <EnhancedCard className="h-full text-center border-0 shadow-xl">
                      <EnhancedCardContent className="p-8">
                        <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${contact.gradient} flex items-center justify-center shadow-lg`}>
                          <contact.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{contact.title}</h3>
                        <p className="text-gray-500 mb-4">{contact.subtitle}</p>
                        {contact.action ? (
                          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" asChild>
                            <Link to="/chat">{contact.content}</Link>
                          </Button>
                        ) : (
                          <p className="font-medium text-gray-900">{contact.content}</p>
                        )}
                      </EnhancedCardContent>
                    </EnhancedCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* FAQ Section */}
            <motion.div variants={itemVariants}>
              <EnhancedCard className="border-0 shadow-xl">
                <EnhancedCardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                      <HelpCircle className="w-6 h-6 text-white" />
                    </div>
                    <EnhancedCardTitle className="text-2xl">Questions fréquemment posées</EnhancedCardTitle>
                  </div>
                  <EnhancedCardDescription>
                    Trouvez rapidement les réponses aux questions les plus courantes
                  </EnhancedCardDescription>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    <AccordionItem value="item-1" className="border border-gray-200 rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">Comment suivre ma commande ?</AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4">
                        Vous pouvez suivre votre commande en vous connectant à votre compte client et en vous rendant dans la section "Mes commandes". 
                        Un numéro de suivi vous sera également envoyé par email dès que votre colis sera expédié.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2" className="border border-gray-200 rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">Quels sont les délais de livraison ?</AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4">
                        Nos délais de livraison standard sont de 2 à 4 jours ouvrables pour la France métropolitaine. 
                        Pour plus d'informations, veuillez consulter notre <Link to="/livraison" className="text-blue-600 hover:underline">page de livraison</Link>.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3" className="border border-gray-200 rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">Comment puis-je retourner un article ?</AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4">
                        Vous disposez de 30 jours à compter de la réception de votre commande pour retourner un article. 
                        Pour plus d'informations sur la procédure à suivre, consultez notre <Link to="/retours" className="text-blue-600 hover:underline">politique de retours</Link>.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-4" className="border border-gray-200 rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">Comment modifier ou annuler ma commande ?</AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4">
                        Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant sa passation en contactant notre service client. 
                        Au-delà de ce délai, il est possible que votre commande soit déjà en cours de préparation et ne puisse plus être modifiée.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-5" className="border border-gray-200 rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">Quels modes de paiement acceptez-vous ?</AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4">
                        Nous acceptons les paiements par carte bancaire (Visa, Mastercard), PayPal, et Apple Pay. Les paiements sont sécurisés et vos données ne sont jamais stockées sur nos serveurs.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </EnhancedCardContent>
              </EnhancedCard>
            </motion.div>
            
            {/* Contact Form CTA */}
            <motion.div variants={itemVariants}>
              <EnhancedCard className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 shadow-xl">
                <EnhancedCardContent className="p-8 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Nous contacter</h2>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Vous n'avez pas trouvé la réponse à votre question ? N'hésitez pas à nous contacter directement via notre formulaire de contact.
                  </p>
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg font-semibold rounded-xl">
                    <Link to="/contact">Formulaire de contact</Link>
                  </Button>
                </EnhancedCardContent>
              </EnhancedCard>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerServicePage;
