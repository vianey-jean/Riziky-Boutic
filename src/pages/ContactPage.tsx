import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { useMutation } from '@tanstack/react-query';
import { API } from '@/services/api';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Sparkles, CheckCircle2, ArrowRight, Globe } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';

const formSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  telephone: z.string().min(8, 'Numéro de téléphone invalide'),
  adresse: z.string().min(5, 'Adresse requise'),
  objet: z.string().min(3, 'Objet requis'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

type FormValues = z.infer<typeof formSchema>;

const ContactPage = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      objet: '',
      message: '',
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return API.post('/contacts', data);
    },
    onSuccess: () => {
      toast.success("Votre message a été envoyé avec succès");
      form.reset();
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de l'envoi de votre message");
    }
  });

  const onSubmit = (data: FormValues) => {
    contactMutation.mutate(data);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-none lg:rounded-3xl lg:mx-8 lg:mt-8 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          
          <div className="relative z-10 text-center py-20 px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="bg-white/20 backdrop-blur-sm p-6 rounded-3xl shadow-xl">
                  <MessageSquare className="h-12 w-12 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-5xl font-bold text-white mb-4">
                    Parlons Ensemble
                  </h1>
                  <p className="text-xl text-blue-100 max-w-2xl">
                    Notre équipe est là pour vous accompagner dans tous vos projets. 
                    Contactez-nous et découvrez comment nous pouvons vous aider.
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
                  <Clock className="h-8 w-8 mb-4 text-blue-200" />
                  <h3 className="font-semibold mb-2">Réponse Rapide</h3>
                  <p className="text-sm text-blue-100">Nous répondons sous 24h maximum</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
                  <CheckCircle2 className="h-8 w-8 mb-4 text-green-300" />
                  <h3 className="font-semibold mb-2">Support Expert</h3>
                  <p className="text-sm text-blue-100">Une équipe qualifiée à votre service</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
                  <Globe className="h-8 w-8 mb-4 text-purple-200" />
                  <h3 className="font-semibold mb-2">Disponibilité</h3>
                  <p className="text-sm text-blue-100">7j/7 pour votre satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto py-16 px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form Section */}
            <div className="order-2 lg:order-1">
              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-500">
                <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-blue-100 rounded-t-lg">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                    <Sparkles className="h-7 w-7 mr-3 text-blue-600" />
                    Envoyez-nous un message
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-lg mt-2">
                    Remplissez ce formulaire et notre équipe vous contactera rapidement pour répondre à vos besoins.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-8">
                  {contactMutation.isPending ? (
                    <div className="flex justify-center py-12">
                      <LoadingSpinner size="lg" variant="elegant" text="Envoi de votre message..." />
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="nom"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-semibold">Nom *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Dupont" 
                                    {...field} 
                                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 hover:border-gray-300" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="prenom"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-semibold">Prénom *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Jean" 
                                    {...field} 
                                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 hover:border-gray-300" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-semibold">Email *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="email@example.com" 
                                    {...field} 
                                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 hover:border-gray-300" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="telephone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-semibold">Téléphone *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="06 12 34 56 78" 
                                    {...field} 
                                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 hover:border-gray-300" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="adresse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-semibold">Adresse *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="123 rue des Exemples, 75000 Paris" 
                                  {...field} 
                                  className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 hover:border-gray-300" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="objet"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-semibold">Objet *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Objet de votre message" 
                                  {...field} 
                                  className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 hover:border-gray-300" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-semibold">Message *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Décrivez votre demande en détail..." 
                                  {...field} 
                                  rows={6} 
                                  className="border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 hover:border-gray-300 resize-none" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold h-14 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                          disabled={contactMutation.isPending}
                        >
                          <Send className="h-5 w-5 mr-3" />
                          Envoyer le message
                          <ArrowRight className="h-5 w-5 ml-3" />
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Contact Info Section */}
            <div className="order-1 lg:order-2 space-y-8">
              <div className="text-center lg:text-left mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos coordonnées</h2>
                <p className="text-xl text-gray-600">Plusieurs moyens de nous joindre pour mieux vous servir</p>
              </div>

              <div className="grid gap-6">
                <Card className="group border-0 shadow-xl bg-gradient-to-br from-white to-red-50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-gradient-to-br from-red-500 to-pink-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                        <MapPin className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-red-800">Adresse :</h3>
                        <p className="text-gray-600">Notre siège social :</p>
                      </div>
                    </div>
                    <div className="ml-16">
                      <p className="text-gray-700 font-medium">10 Allée des Beryls Bleus</p>
                      <p className="text-gray-700 font-medium">Bellepierre</p>
                      <p className="text-gray-700 font-medium">97400 Saint-Denis, Réunion</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="group border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                        <Phone className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-blue-800">Téléphone :</h3>
                        <p className="text-gray-600">Appelez-nous directement</p>
                      </div>
                    </div>
                    <div className="ml-16">
                      <p className="text-gray-700 font-medium">+262 (0)6 92 84 23 70</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="group border-0 shadow-xl bg-gradient-to-br from-white to-green-50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                        <Mail className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-green-800">Email :</h3>
                        <p className="text-gray-600">Écrivez-nous</p>
                      </div>
                    </div>
                    <div className="ml-16">
                      <p className="text-gray-700 font-medium">contact@Riziky-Boutic.fr</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="group border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                        <Clock className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-purple-800">Heures d'ouverture :</h3>
                        <p className="text-gray-600">Quand nous contacter</p>
                      </div>
                    </div>
                    <div className="ml-16 space-y-1">
                      <p className="text-gray-700 font-medium">Lundi - Vendredi: 9h00 - 18h00</p>
                      <p className="text-gray-700 font-medium">Samedi: 10h00 - 16h00</p>
                      <p className="text-gray-700 font-medium">Dimanche: Fermé</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center shadow-2xl">
                <h3 className="text-2xl font-bold mb-4">Besoin d'une réponse immédiate ?</h3>
                <p className="text-blue-100 mb-6">Notre équipe support est disponible pour vous aider en temps réel</p>
                  <a
                    href="https://wa.me/+262692842370" // Numéro de téléphone au format international, sans le "+"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button className="bg-white text-green-600 hover:bg-green-50 font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center">
                      <Phone className="h-5 w-5 mr-2" />
                      Contactez-nous sur WhatsApp
                    </Button>
                  </a>

              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
