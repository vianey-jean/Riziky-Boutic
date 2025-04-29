
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { toast } from '@/components/ui/sonner';
import { authAPI } from '@/services/api';
import PasswordStrengthIndicator from '@/components/auth/PasswordStrengthIndicator';

const emailFormSchema = z.object({
  email: z.string().email('Email invalide'),
});

const resetFormSchema = z.object({
  email: z.string().email('Email invalide'),
  code: z.string().min(1, 'Code requis'),
  newPassword: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type EmailFormValues = z.infer<typeof emailFormSchema>;
type ResetFormValues = z.infer<typeof resetFormSchema>;

const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: '',
    },
  });
  
  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: {
      email: '',
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmitEmail = async (data: EmailFormValues) => {
    try {
      setIsLoading(true);
      
      // Appel API pour envoyer le code de réinitialisation
      await authAPI.forgotPassword(data.email);
      
      // Dans un environnement réel, le code est envoyé par email
      // Pour cette démo, nous affichons une notification
      toast.success(`Un code de réinitialisation a été envoyé à ${data.email}`);
      
      // Préparer le formulaire de réinitialisation avec l'email
      resetForm.setValue('email', data.email);
      setStep('reset');
    } catch (error) {
      console.error('Erreur de demande de réinitialisation:', error);
      toast.error("Une erreur s'est produite. Veuillez réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitReset = async (data: ResetFormValues) => {
    try {
      setIsLoading(true);
      
      // Appel API pour réinitialiser le mot de passe
      await resetPassword(data.email, data.code, data.newPassword);
      
      toast.success("Votre mot de passe a été réinitialisé avec succès");
      navigate('/login');
    } catch (error) {
      console.error('Erreur de réinitialisation du mot de passe:', error);
      toast.error("Le code de réinitialisation est invalide ou expiré");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[70vh]">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Mot de passe oublié</CardTitle>
            <CardDescription>
              {step === 'email'
                ? 'Entrez votre adresse email pour recevoir un code de réinitialisation'
                : 'Entrez le code reçu par email et votre nouveau mot de passe'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'email' ? (
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
                  <FormField
                    control={emailForm.control}
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
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Envoi en cours..." : "Envoyer le code"}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(onSubmitReset)} className="space-y-4">
                  <FormField
                    control={resetForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" disabled {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={resetForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code de réinitialisation</FormLabel>
                        <FormControl>
                          <Input placeholder="Entrez le code reçu par email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={resetForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nouveau mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                        <PasswordStrengthIndicator password={field.value} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={resetForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => setStep('email')}
                    disabled={isLoading}
                  >
                    Utiliser une autre adresse email
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter>
            <div className="text-sm text-muted-foreground w-full text-center">
              <Link to="/login" className="text-blue-600 hover:underline">
                Retour à la connexion
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;
