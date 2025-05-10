
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
import API from '@/services/api';

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
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-red-800">Contactez-nous</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Formulaire de contact</CardTitle>
              <CardDescription>
                Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input placeholder="Dupont" {...field} />
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
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input placeholder="Jean" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
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
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="06 12 34 56 78" {...field} />
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
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Input placeholder="123 rue des Exemples, 75000 Paris" {...field} />
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
                        <FormLabel>Objet</FormLabel>
                        <FormControl>
                          <Input placeholder="Objet de votre message" {...field} />
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
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Votre message..." {...field} rows={5} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-red-800 hover:bg-red-700"
                    disabled={contactMutation.isPending}
                  >
                    {contactMutation.isPending ? "Envoi en cours..." : "Envoyer"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-red-800">Adresse</h3>
                  <p className="text-gray-600">123 Rue du Commerce</p>
                  <p className="text-gray-600">75015 Paris, France</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-red-800">Téléphone</h3>
                  <p className="text-gray-600">+33 (0)1 23 45 67 89</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-red-800">Email</h3>
                  <p className="text-gray-600">contact@Riziky-Boutic.fr</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-red-800">Heures d'ouverture</h3>
                  <p className="text-gray-600">Lundi - Vendredi: 9h00 - 18h00</p>
                  <p className="text-gray-600">Samedi: 10h00 - 16h00</p>
                  <p className="text-gray-600">Dimanche: Fermé</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
