
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardDescription,
  EnhancedCardFooter,
  EnhancedCardHeader,
  EnhancedCardTitle,
} from '@/components/ui/enhanced-card';
import { Button } from '@/components/ui/button';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import Layout from '@/components/layout/Layout';
import { authAPI } from '@/services/api';
import PasswordStrengthIndicator from '@/components/auth/PasswordStrengthIndicator';
import { Eye, EyeOff, CheckCircle, Mail, Lock, Key, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const togglePasswordConfirmVisibility = () => setShowConfirmPassword(!showConfirmPassword);
  
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <EnhancedCard className="backdrop-blur-xl">
            <EnhancedCardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mb-4 shadow-xl"
              >
                <Key className="h-10 w-10 text-white" />
              </motion.div>
              <EnhancedCardTitle>Mot de passe oublié</EnhancedCardTitle>
              <EnhancedCardDescription>
                {userId && !showContactAdmin
                  ? 'Entrez le code temporaire et créez un nouveau mot de passe'
                  : 'Entrez votre adresse email pour commencer'}
              </EnhancedCardDescription>
            </EnhancedCardHeader>

            <EnhancedCardContent>
              {!userId ? (
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-6">
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <EnhancedInput 
                                placeholder="email@example.com" 
                                {...field}
                                className="pl-12"
                              />
                              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        "Continuer"
                      )}
                    </Button>
                  </form>
                </Form>
              ) : showContactAdmin ? (
                <div className="space-y-6">
                  <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20">
                    <Mail className="h-4 w-4" />
                    <AlertTitle>Code temporaire non trouvé</AlertTitle>
                    <AlertDescription>
                      Aucun code temporaire n'a été défini pour votre compte. Contactez l'administrateur :
                    </AlertDescription>
                  </Alert>
                  <div className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <a href="mailto:vianey.jean@ymail.com" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                      vianey.jean@ymail.com
                    </a>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                    onClick={() => {
                      setUserId(null);
                      setShowContactAdmin(false);
                      emailForm.reset();
                    }}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
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
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <EnhancedInput 
                                placeholder="email@example.com" 
                                disabled 
                                {...field}
                                className="pl-12 bg-gray-50 dark:bg-gray-800"
                              />
                              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={resetForm.control}
                      name="passwordUnique"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Code temporaire</FormLabel>
                          <div className="flex space-x-3">
                            <FormControl>
                              <div className="relative flex-1">
                                <EnhancedInput
                                  placeholder="Code temporaire"
                                  {...field}
                                  disabled={isTempPasswordValid}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setIsTempPasswordValid(false);
                                  }}
                                  className="pl-12"
                                />
                                <Key className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                              </div>
                            </FormControl>
                            {!isTempPasswordValid ? (
                              <Button
                                type="button"
                                onClick={verifyTempPassword}
                                disabled={!field.value || isLoading}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl px-6"
                              >
                                Vérifier
                              </Button>
                            ) : (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl"
                              >
                                <CheckCircle className="h-6 w-6 text-green-500" />
                              </motion.div>
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
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Nouveau mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <EnhancedInput
                                {...field}
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder="********"
                                className="pl-12 pr-12"
                              />
                              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1 h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                onClick={toggleNewPasswordVisibility}
                              >
                                {showNewPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-400" />
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
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Confirmer le mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <EnhancedInput
                                {...field}
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="********"
                                className="pl-12 pr-12"
                              />
                              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1 h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                onClick={togglePasswordConfirmVisibility}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-400" />
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
                      className="w-full h-12 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isLoading || !isTempPasswordValid}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        "Réinitialiser"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </EnhancedCardContent>

            <EnhancedCardFooter className="flex flex-col gap-4 text-center">
              <Link 
                to="/login" 
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium hover:underline transition-colors duration-200"
              >
                Retour à la connexion
              </Link>
            </EnhancedCardFooter>
          </EnhancedCard>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;
