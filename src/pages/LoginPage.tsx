
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { authAPI } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import PasswordStrengthIndicator from '@/components/auth/PasswordStrengthIndicator';

// ✅ Validation schemas
const emailSchema = z.object({
  email: z.string().email('Email invalide'),
});
const passwordSchema = z.object({
  password: z.string().min(1, 'Mot de passe requis'),
});

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Formulaires
  const emailForm = useForm<{ email: string }>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const passwordForm = useForm<{ password: string }>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  // ✅ Gestion soumission email
  const onEmailSubmit = async (data: { email: string }) => {
    const normalizedEmail = data.email.trim().toLowerCase();
    try {
      setIsLoading(true);
      const response = await authAPI.checkEmail(normalizedEmail);

      if (response.data.exists) {
        setUserEmail(normalizedEmail);
        setUserName(response.data.user.nom || 'Utilisateur');
        setStep('password');
        toast.success(`Bienvenue ${response.data.user.nom || 'Utilisateur'}`, {
          style: { backgroundColor: 'green', color: 'white' },
        });
      } else {
        toast.error("Cet email n'existe pas", {
          style: { backgroundColor: 'red', color: 'white' },
        });
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email:", error);
      toast.error("Erreur lors de la vérification de l'email", {
        style: { backgroundColor: 'red', color: 'white' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Gestion soumission mot de passe
  const onPasswordSubmit = async (data: { password: string }) => {
    try {
      setIsLoading(true);
      
      // Vérifier si on vient directement de /login (pas de redirection sauvegardée)
      const isDirectLogin = !localStorage.getItem('redirectAfterLogin');
      
      // Si on vient directement sur /login, on va vers home après connexion
      const redirectTo = isDirectLogin ? '/' : undefined;
      
      await login(userEmail, data.password, redirectTo);
      // La redirection est gérée dans le contexte Auth
    } catch (error) {
      console.error("Erreur de connexion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
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
                <User className="h-10 w-10 text-white" />
              </motion.div>
              <EnhancedCardTitle>Connexion</EnhancedCardTitle>
              <EnhancedCardDescription>
                Accédez à votre espace personnel
              </EnhancedCardDescription>
            </EnhancedCardHeader>

            <EnhancedCardContent>
              {step === 'email' ? (
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <EnhancedInput
                                {...field}
                                placeholder="email@example.com"
                                onChange={(e) => field.onChange(e.target.value.trim())}
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
                        <>
                          Continuer
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
                    >
                      <p className="text-sm text-green-700 dark:text-green-300 text-center">
                        Connecté en tant que : <strong>{userEmail}</strong>
                      </p>
                    </motion.div>

                    <FormField
                      control={passwordForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <EnhancedInput
                                {...field}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="********"
                                className="pl-12 pr-12"
                              />
                              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1 h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                onClick={togglePasswordVisibility}
                              >
                                {showPassword ? (
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
                    <div className="space-y-3">
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
                          "Se connecter"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                        onClick={() => setStep('email')}
                        disabled={isLoading}
                      >
                        Modifier l'email
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </EnhancedCardContent>

            <EnhancedCardFooter className="flex flex-col gap-4 text-center">
              <Link 
                to="/forgot-password" 
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium hover:underline transition-colors duration-200"
              >
                Mot de passe oublié ?
              </Link>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Pas encore de compte ?{" "}
                <Link 
                  to="/register" 
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium hover:underline transition-colors duration-200"
                >
                  S'inscrire
                </Link>
              </div>
            </EnhancedCardFooter>
          </EnhancedCard>
        </motion.div>
      </div>
    </Layout>
  );
};

export default LoginPage;
