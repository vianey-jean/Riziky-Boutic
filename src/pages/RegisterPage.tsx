
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, User, Lock, ShoppingBag, UserPlus } from 'lucide-react';
import { debounce } from 'lodash';
import PasswordStrengthIndicator from '@/components/auth/PasswordStrengthIndicator';

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
      <div className="min-h-[90vh] bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-red-950/20 dark:via-neutral-950 dark:to-red-950/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header with Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-lg mb-4">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Riziky Boutique
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Créez votre compte pour commencer
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent flex items-center justify-center gap-2">
                <UserPlus className="h-6 w-6 text-red-600" />
                Inscription
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                Rejoignez notre communauté de beauté
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="nom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Nom complet
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="Votre nom complet" 
                              {...field} 
                              className="pl-12 h-12 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500 rounded-xl"
                            />
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
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Adresse email
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="votre@email.com" 
                              {...field} 
                              className="pl-12 h-12 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500 rounded-xl"
                            />
                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                        {emailExists && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            Cet email est déjà utilisé
                          </p>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Mot de passe
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              {...field}
                              className="pl-12 pr-12 h-12 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500 rounded-xl"
                            />
                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1.5 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
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
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Confirmer le mot de passe
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              {...field}
                              className="pl-12 pr-12 h-12 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500 rounded-xl"
                            />
                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1.5 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
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

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
                    disabled={emailExists || isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Création du compte...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Créer mon compte
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="pt-6">
              <div className="text-sm text-center text-gray-600 dark:text-gray-400 w-full">
                Déjà un compte ?{' '}
                <Link 
                  to="/login" 
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold hover:underline transition-colors"
                >
                  Se connecter
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
