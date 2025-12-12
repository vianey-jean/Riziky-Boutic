
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { authAPI } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShoppingBag } from 'lucide-react';
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
      await login(userEmail, data.password);
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
              Connectez-vous à votre compte
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Connexion
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                {step === 'email' ? 'Entrez votre adresse email' : 'Entrez votre mot de passe'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {step === 'email' ? (
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Adresse email
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                placeholder="votre@email.com"
                                onChange={(e) => field.onChange(e.target.value.trim())}
                                className="pl-12 h-12 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500 rounded-xl"
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
                      className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Vérification...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Continuer
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                      <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                        Connecté en tant que : <span className="font-bold">{userEmail}</span>
                      </p>
                    </div>

                    <FormField
                      control={passwordForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Mot de passe
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                className="pl-12 pr-12 h-12 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500 rounded-xl"
                              />
                              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1.5 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                onClick={togglePasswordVisibility}
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
                    
                    <div className="space-y-3">
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Connexion...
                          </div>
                        ) : (
                          'Se connecter'
                        )}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300"
                        onClick={() => setStep('email')}
                        disabled={isLoading}
                      >
                        ← Modifier l'email
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-6">
              <Link 
                to="/forgot-password" 
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium hover:underline transition-colors"
              >
                Mot de passe oublié ?
              </Link>
              <div className="text-sm text-center text-gray-600 dark:text-gray-400">
                Pas encore de compte ?{" "}
                <Link 
                  to="/register" 
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold hover:underline transition-colors"
                >
                  S'inscrire maintenant
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
