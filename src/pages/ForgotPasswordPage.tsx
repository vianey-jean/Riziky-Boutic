import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';

import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import Layout from '@/components/layout/Layout';
import { authAPI } from '@/services/api';
import PasswordStrengthIndicator from '@/components/auth/PasswordStrengthIndicator';
import { Eye, EyeOff, CheckCircle, Mail, Lock, ArrowLeft, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import LoadingSpinner from '@/components/ui/loading-spinner';

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const emailFormSchema = z.object({
  email: z.string().email('Email invalide'),
});

const resetFormSchema = z.object({
  email: z.string().email('Email invalide'),
  passwordUnique: z.string().min(1, 'Le code temporaire est requis'),
  newPassword: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .refine((val) => /[A-Z]/.test(val), 'Au moins une majuscule')
    .refine((val) => /[a-z]/.test(val), 'Au moins une minuscule')
    .refine((val) => /[0-9]/.test(val), 'Au moins un chiffre')
    .refine((val) => /[^A-Za-z0-9]/.test(val), 'Au moins un caractère spécial'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type EmailFormValues = z.infer<typeof emailFormSchema>;
type ResetFormValues = z.infer<typeof resetFormSchema>;

const ForgotPasswordPage: React.FC = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isTempPasswordValid, setIsTempPasswordValid] = useState(false);
  const [showContactAdmin, setShowContactAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: '' },
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: {
      email: '', passwordUnique: '', newPassword: '', confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmitEmail = async (data: EmailFormValues) => {
    try {
      setIsLoading(true);

      const emailCheckResponse = await authAPI.checkEmail(data.email);
      if (!emailCheckResponse.data.exists) {
        toast.error(`Aucun compte trouvé avec l'email ${data.email}`, {
          style: { backgroundColor: 'red', color: 'white' },
        });
                  
        return;
      }

      setUserEmail(data.email);
      setUserId(emailCheckResponse.data.userId);

      const response = await fetch(`${AUTH_BASE_URL}/api/auth/user-temp-password?email=${encodeURIComponent(data.email)}`);
      if (!response.ok) throw new Error(`Erreur serveur: ${response.status}`);

      const userData = await response.json();
      if (!userData.passwordUnique) {
        setShowContactAdmin(true);
        toast.error("Aucun code temporaire n'a été défini pour ce compte.",{
          style: { backgroundColor: 'red', color: 'white' },
        });
      } else {
        resetForm.setValue('email', data.email);
        toast.success("Veuillez saisir le code temporaire transmis.",{
          style: { backgroundColor: 'green', color: 'white' },
        });
      }
    } catch (err) {
      console.error('Erreur dans la vérification email:', err);
      toast.error("Une erreur est survenue. Veuillez réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTempPassword = async () => {
    const tempPassword = resetForm.getValues('passwordUnique');
    if (!userId || !userEmail || !tempPassword) return;

    try {
      setIsLoading(true);

      const res = await fetch(`${AUTH_BASE_URL}/api/auth/verify-temp-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, tempPassword }),
      });

      const result = await res.json();

      if (res.ok && result.valid) {
        setIsTempPasswordValid(true);
        toast.success("Code temporaire valide.",{
          style: { backgroundColor: 'green', color: 'white' },
        });
      } else {
        setIsTempPasswordValid(false);
        toast.error("Code temporaire invalide.",
          {
            style: { backgroundColor: 'red', color: 'white' },
          }
        );
      }
    } catch (error) {
      console.error('Erreur de vérification du code temporaire:', error);
      toast.error("Une erreur est survenue.",
        {
          style: { backgroundColor: 'red', color: 'white' },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitReset = async (data: ResetFormValues) => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const res = await fetch(`${AUTH_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          passwordUnique: data.passwordUnique,
          newPassword: data.newPassword
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur inconnue");
      }

      toast.success("Mot de passe réinitialisé avec succès.",
        {
          style: { backgroundColor: 'green', color: 'white' },
        }
      );
      navigate('/login');
    } catch (error: any) {
      console.error('Erreur de réinitialisation:', error);
      toast.error(error.message || "Une erreur est survenue.",
        {
          style: { backgroundColor: 'red', color: 'white' },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNewPasswordVisibility  = () => setShowNewPassword(!showNewPassword);
  const togglePasswordConfirmVisibility = () => setShowConfirmPassword(!showConfirmPassword);
  
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[70vh]">
            <div className="w-full max-w-md">
              {/* Header avec icône */}
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Récupération de compte</h1>
                <p className="text-gray-600">
                  {userId && !showContactAdmin
                    ? 'Dernière étape pour sécuriser votre compte'
                    : 'Nous vous aidons à retrouver l\'accès à votre compte'}
                </p>
              </div>

              <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b border-blue-100">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-600" />
                    {userId && !showContactAdmin
                      ? 'Nouveau mot de passe'
                      : 'Vérification du compte'}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {userId && !showContactAdmin
                      ? 'Entrez le code temporaire et créez un nouveau mot de passe sécurisé'
                      : 'Entrez votre adresse email pour commencer la récupération'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6">
                  {isLoading && (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size="md" variant="elegant" text="Traitement en cours..." />
                    </div>
                  )}

                  {!isLoading && !userId ? (
                    <Form {...emailForm}>
                      <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-6">
                        <FormField
                          control={emailForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium flex items-center">
                                <Mail className="h-4 w-4 mr-2" />
                                Adresse email
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="votre@email.com" 
                                  {...field} 
                                  className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                          disabled={isLoading}
                        >
                          Continuer la récupération
                        </Button>
                      </form>
                    </Form>
                  ) : showContactAdmin ? (
                    <div className="space-y-6">
                      <Alert className="border-orange-200 bg-orange-50">
                        <Mail className="h-4 w-4 text-orange-600" />
                        <AlertTitle className="text-orange-800">Assistance requise</AlertTitle>
                        <AlertDescription className="text-orange-700">
                          Aucun code temporaire n'a été défini pour votre compte. Notre équipe support peut vous aider.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-gray-900 mb-3">Contactez notre support</h3>
                        <div className="flex items-center justify-center p-4 bg-white rounded-lg border border-blue-200">
                          <Mail className="h-5 w-5 text-blue-600 mr-3" />
                          <a href="mailto:vianey.jean@ymail.com" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                            vianey.jean@ymail.com
                          </a>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        className="w-full h-12 border-2 border-gray-300 hover:border-blue-500 transition-colors"
                        onClick={() => {
                          setUserId(null);
                          setShowContactAdmin(false);
                          emailForm.reset();
                        }}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour
                      </Button>
                    </div>
                  ) : (
                    <Form {...resetForm}>
                      <form onSubmit={resetForm.handleSubmit(onSubmitReset)} className="space-y-6">
                        <FormField
                          control={resetForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Email confirmé</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  disabled 
                                  className="h-12 bg-gray-50 border-gray-200"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={resetForm.control}
                          name="passwordUnique"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Code temporaire</FormLabel>
                              <div className="flex space-x-2">
                                <FormControl>
                                  <Input
                                    placeholder="Entrez le code temporaire"
                                    {...field}
                                    disabled={isTempPasswordValid}
                                    className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setIsTempPasswordValid(false);
                                    }}
                                  />
                                </FormControl>
                                {!isTempPasswordValid ? (
                                  <Button
                                    type="button"
                                    onClick={verifyTempPassword}
                                    disabled={!field.value || isLoading}
                                    className="h-12 px-6 bg-blue-600 hover:bg-blue-700"
                                  >
                                    Vérifier
                                  </Button>
                                ) : (
                                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                  </div>
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={resetForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Nouveau mot de passe</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                      type={showNewPassword ? 'text' : 'password'}
                                      placeholder="********"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0"
                                    onClick={toggleNewPasswordVisibility}
                                  >
                                    {showNewPassword ? (
                                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                      <Eye className="h-5 w-5 text-muted-foreground" />
                                    )}
                                  </Button>
                                </div>
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
                              <FormLabel className="text-gray-700 font-medium">Confirmer le mot de passe</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                      type={showConfirmPassword ? 'text' : 'password'}
                                      placeholder="********"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0"
                                    onClick={togglePasswordConfirmVisibility}
                                  >
                                    {showConfirmPassword ? (
                                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                      <Eye className="h-5 w-5 text-muted-foreground" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                          disabled={isLoading || !isTempPasswordValid}
                        >
                          {isLoading ? "Réinitialisation..." : "Confirmer le nouveau mot de passe"}
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
                
                <CardFooter className="bg-gray-50 rounded-b-lg border-t border-gray-100">
                  <div className="w-full text-center">
                    <Link 
                      to="/login" 
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center justify-center"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour à la connexion
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;
