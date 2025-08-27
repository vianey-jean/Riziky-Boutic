import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Shield, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import PasswordStrengthIndicator from '../auth/PasswordStrengthIndicator';
import { toast } from '@/components/ui/sonner';
import { authAPI } from '@/services/api';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
  newPassword: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .refine(
      (password) => /[A-Z]/.test(password),
      'Le mot de passe doit contenir au moins une majuscule'
    )
    .refine(
      (password) => /[a-z]/.test(password),
      'Le mot de passe doit contenir au moins une minuscule'
    )
    .refine(
      (password) => /[0-9]/.test(password),
      'Le mot de passe doit contenir au moins un chiffre'
    )
    .refine(
      (password) => /[^A-Za-z0-9]/.test(password),
      'Le mot de passe doit contenir au moins un caractère spécial'
    ),
  confirmPassword: z.string().min(1, 'Confirmation du mot de passe requise'),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

type PasswordFormProps = {
  loading?: boolean;
  onPasswordChange?: (currentPassword: string, newPassword: string) => Promise<boolean>;
};

const PasswordForm = ({ loading: externalLoading, onPasswordChange }: PasswordFormProps = {}) => {
  const { user, logout } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPasswordValid, setCurrentPasswordValid] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [hasShownSuccessNotification, setHasShownSuccessNotification] = useState(false);
  const [hasShownErrorNotification, setHasShownErrorNotification] = useState(false);

  const actualLoading = externalLoading || isLoading;

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const watchedValues = form.watch();

  // Vérifier si le bouton doit être activé
  useEffect(() => {
    const { currentPassword, newPassword, confirmPassword } = watchedValues;
    
    const isValid = 
      currentPasswordValid &&
      newPassword.length >= 8 &&
      /[A-Z]/.test(newPassword) &&
      /[a-z]/.test(newPassword) &&
      /[0-9]/.test(newPassword) &&
      /[^A-Za-z0-9]/.test(newPassword) &&
      newPassword === confirmPassword &&
      newPassword !== currentPassword;

    setIsButtonEnabled(isValid);
  }, [watchedValues, currentPasswordValid]);

  // Vérifier le mot de passe actuel quand on commence à taper le nouveau
  useEffect(() => {
    const { currentPassword, newPassword } = watchedValues;
    
    if (currentPassword && newPassword.length > 0 && !currentPasswordValid) {
      verifyCurrentPassword(currentPassword);
    }
  }, [watchedValues.newPassword]);

  const verifyCurrentPassword = async (password: string) => {
    if (!user || !password) return;

    try {
      const response = await authAPI.verifyPassword(user.id, password);
      
      if (response.data.valid) {
        setCurrentPasswordValid(true);
        setHasShownErrorNotification(false); // Réinitialiser le flag d'erreur
        
        // Afficher la notification une seule fois
        if (!hasShownSuccessNotification) {
          toast.success('Mot de passe actuel correct', {
            style: { backgroundColor: 'green', color: 'white' },
          });
          setHasShownSuccessNotification(true);
        }
      } else {
        handleIncorrectPassword();
      }
    } catch (error) {
      handleIncorrectPassword();
    }
  };

  const handleIncorrectPassword = () => {
    setCurrentPasswordValid(false);
    setHasShownSuccessNotification(false);
    setFailedAttempts(prev => prev + 1);
    
    // Réinitialiser le champ mot de passe actuel
    form.setValue('currentPassword', '');
    
    // Afficher la notification d'erreur une seule fois
    if (!hasShownErrorNotification) {
      toast.error('Mot de passe erroné', {
        style: { backgroundColor: 'red', color: 'white' },
      });
      setHasShownErrorNotification(true);
    }

    // Déconnecter après 3 tentatives échouées
    if (failedAttempts >= 2) {
      toast.error('Trop de tentatives échouées. Déconnexion...', {
        style: { backgroundColor: 'red', color: 'white' },
      });
      setTimeout(() => {
        logout();
      }, 2000);
    }
  };

  // Vérifier si le nouveau mot de passe est identique au mot de passe actuel
  useEffect(() => {
    const { currentPassword, newPassword } = watchedValues;
    
    if (currentPasswordValid && newPassword && newPassword === currentPassword) {
      toast.error('Le nouveau mot de passe est pareil au mot de passe actuel', {
        style: { backgroundColor: 'red', color: 'white' },
      });
      return;
    }
  }, [watchedValues.newPassword, currentPasswordValid]);

  const onSubmit = async (data: PasswordFormValues) => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return;
    }

    // Vérifier si les mots de passe correspondent au moment de la validation
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Le nouveau mot de passe et confirmation ne sont pas pareils. Veuillez bien vérifier le nouveau mot de passe.', {
        style: { backgroundColor: 'red', color: 'white' },
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Si une fonction de mise à jour personnalisée est fournie, l'utiliser
      if (onPasswordChange) {
        await onPasswordChange(data.currentPassword, data.newPassword);
      } else {
        // Sinon, utiliser l'API directement
        await authAPI.updatePassword(user.id, data.currentPassword, data.newPassword);
      }
      
      // Réinitialiser le formulaire et les états
      form.reset();
      setCurrentPasswordValid(false);
      setHasShownSuccessNotification(false);
      setHasShownErrorNotification(false);
      setFailedAttempts(0);
      
      toast.success('Mot de passe mis à jour avec succès. Redirection vers la page de connexion...', {
        style: { backgroundColor: 'green', color: 'white' },
      });

      // Déconnecter l'utilisateur et rediriger vers la page de connexion
      setTimeout(() => {
        logout();
      }, 2000);
      
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe', {
        style: { backgroundColor: 'red', color: 'white' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Sécurité du Compte</CardTitle>
              <CardDescription className="text-red-100">
                Modifiez votre mot de passe pour sécuriser votre compte
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                  Conseils de sécurité
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Utilisez un mot de passe unique avec au moins 8 caractères, incluant majuscules, minuscules, chiffres et caractères spéciaux.
                </p>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Mot de passe actuel
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? 'text' : 'password'}
                          placeholder="Entrez votre mot de passe actuel"
                          {...field}
                          className="pl-12 pr-12 h-12 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500 rounded-xl transition-all duration-200"
                        />
                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1.5 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Nouveau mot de passe
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="Entrez votre nouveau mot de passe"
                          {...field}
                          className="pl-12 pr-12 h-12 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500 rounded-xl transition-all duration-200"
                        />
                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1.5 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <div className="mt-3">
                      <PasswordStrengthIndicator password={field.value} />
                    </div>
                    <FormDescription className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Confirmer le mot de passe
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirmez votre nouveau mot de passe"
                          {...field}
                          className="pl-12 pr-12 h-12 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500 rounded-xl transition-all duration-200"
                        />
                        <CheckCircle2 className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1.5 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
                  disabled={actualLoading || !isButtonEnabled}
                >
                  {actualLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Mise à jour en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Mettre à jour le mot de passe
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordForm;
