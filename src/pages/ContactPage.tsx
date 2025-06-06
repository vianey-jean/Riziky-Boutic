
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { EnhancedCard, EnhancedCardContent, EnhancedCardDescription, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Mail, Phone, Clock, Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Message envoyé avec succès !');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white py-24">
          <div className="absolute inset-0 bg-black/20"></div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 relative z-10"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
                Contactez-nous
              </h1>
              <p className="text-xl text-red-100 leading-relaxed">
                Notre équipe dédiée est là pour répondre à toutes vos questions et vous accompagner dans votre expérience beauté.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto"
          >
            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <EnhancedCard className="h-full">
                <EnhancedCardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <EnhancedCardTitle>Envoyez-nous un message</EnhancedCardTitle>
                  </div>
                  <EnhancedCardDescription>
                    Nous vous répondrons dans les plus brefs délais. Tous les champs sont obligatoires.
                  </EnhancedCardDescription>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Nom complet</label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Votre nom complet"
                          required
                          className="transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="votre@email.com"
                          required
                          className="transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Sujet</label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="De quoi souhaitez-vous nous parler ?"
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Message</label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Décrivez votre demande en détail..."
                        rows={6}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-6 text-lg font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Envoi en cours...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Send className="w-5 h-5" />
                          <span>Envoyer le message</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </EnhancedCardContent>
              </EnhancedCard>
            </motion.div>

            {/* Contact Information */}
            <motion.div variants={itemVariants} className="space-y-6">
              <EnhancedCard>
                <EnhancedCardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <EnhancedCardTitle>Nos coordonnées</EnhancedCardTitle>
                  </div>
                </EnhancedCardHeader>
                <EnhancedCardContent className="space-y-6">
                  {[
                    {
                      icon: MapPin,
                      title: "Adresse",
                      content: "123 Avenue de la Beauté\n97400 Saint-Denis, La Réunion",
                      gradient: "from-red-500 to-pink-500"
                    },
                    {
                      icon: Phone,
                      title: "Téléphone",
                      content: "+262 123 456 789",
                      gradient: "from-green-500 to-emerald-500"
                    },
                    {
                      icon: Mail,
                      title: "Email",
                      content: "contact@riziky-boutique.com",
                      gradient: "from-blue-500 to-cyan-500"
                    },
                    {
                      icon: Clock,
                      title: "Horaires",
                      content: "Lundi - Samedi: 9h00 - 19h00\nDimanche: Fermé",
                      gradient: "from-yellow-500 to-orange-500"
                    }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ x: 5 }}
                      className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className={`p-3 bg-gradient-to-r ${item.gradient} rounded-lg shadow-lg`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-gray-600 whitespace-pre-line leading-relaxed">{item.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </EnhancedCardContent>
              </EnhancedCard>

              {/* Quick Actions */}
              <EnhancedCard>
                <EnhancedCardHeader>
                  <EnhancedCardTitle>Actions rapides</EnhancedCardTitle>
                  <EnhancedCardDescription>
                    Besoin d'aide immédiate ? Essayez ces options
                  </EnhancedCardDescription>
                </EnhancedCardHeader>
                <EnhancedCardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-12 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                  >
                    <MessageCircle className="w-4 h-4 mr-3 text-red-500" />
                    Chat en direct avec notre équipe
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-12 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                  >
                    <Phone className="w-4 h-4 mr-3 text-blue-500" />
                    Programmer un rappel téléphonique
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

export default ContactPage;
