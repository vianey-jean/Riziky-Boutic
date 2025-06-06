
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  EnhancedCard, 
  EnhancedCardContent, 
  EnhancedCardDescription, 
  EnhancedCardFooter, 
  EnhancedCardHeader, 
  EnhancedCardTitle 
} from '@/components/ui/enhanced-card';
import { Button } from '@/components/ui/button';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, User, Lock, UserPlus, Shield } from 'lucide-react';
import { debounce } from 'lodash';
import PasswordStrengthIndicator from '@/components/auth/PasswordStrengthIndicator';
import RegistrationChecker from '@/components/auth/RegistrationChecker';

const formSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
    .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

const RegisterPage = () => {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const checkEmailExists = debounce(async (email: string) => {
    if (!email || !email.includes('@')) return;
    
    try {
      const response = await authAPI.checkEmail(email);
      if (response.data.exists) {
        setEmailExists(true);
        toast.error('Cet email existe déjà');
      } else {
        setEmailExists(false);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
    }
  }, 500);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'email') {
        checkEmailExists(value.email || '');
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (emailExists) {
      toast.error('Cet email existe déjà');
      return;
    }
    
    try {
      setIsLoading(true);
      await register(data.nom, data.email, data.password);
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <RegistrationChecker>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8">
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
                  className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-xl"
                >
                  <UserPlus className="h-10 w-10 text-white" />
                </motion.div>
                <EnhancedCardTitle>Inscription</EnhancedCardTitle>
                <EnhancedCardDescription>
                  Créez votre compte en quelques étapes
                </EnhancedCardDescription>
              </EnhancedCardHeader>
              
              <EnhancedCardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="nom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Nom complet</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <EnhancedInput placeholder="Votre nom" {...field} className="pl-12" />
                              <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <EnhancedInput placeholder="email@example.com" {...field} className="pl-12" />
                              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                              {emailExists && (
                                <div className="absolute right-4 top-3.5">
                                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <EnhancedInput
                                type={showPassword ? "text" : "password"}
                                placeholder="********"
                                {...field}
                                className="pl-12 pr-12"
                              />
                              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1 h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                onClick={() => setShowPassword(!showPassword)}
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
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Confirmer le mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <EnhancedInput
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="********"
                                {...field}
                                className="pl-12 pr-12"
                              />
                              <Shield className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1 h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                      className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" 
                      disabled={emailExists || isLoading}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        "S'inscrire"
                      )}
                    </Button>
                  </form>
                </Form>
              </EnhancedCardContent>
              
              <EnhancedCardFooter>
                <div className="text-sm text-gray-600 dark:text-gray-400 w-full text-center">
                  Déjà un compte ?{' '}
                  <Link 
                    to="/login" 
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-colors duration-200"
                  >
                    Se connecter
                  </Link>
                </div>
              </EnhancedCardFooter>
            </EnhancedCard>
          </motion.div>
        </div>
      </RegistrationChecker>
    </Layout>
  );
};

export default RegisterPage;
