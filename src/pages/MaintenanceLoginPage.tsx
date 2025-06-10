import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, ShoppingBag, LogIn, Wrench } from 'lucide-react';
import { debounce } from 'lodash';
import axios from 'axios';
import { getSecureRoute } from '@/services/secureIds';

const emailSchema = z.object({
  email: z.string().email('Email invalide'),
});

const passwordSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

const MaintenanceLoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const checkEmailAndRole = debounce(async (email: string) => {
    if (!email || !email.includes('@')) return;
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${API_BASE_URL}/api/users/check-email-role`, { email });
      
      if (response.data.exists) {
        setUserRole(response.data.role);
        setUserEmail(email);
        
        if (response.data.role === 'admin') {
          setShowPasswordField(true);
          passwordForm.setValue('email', email);
        } else if (response.data.role === 'client') {
          toast.error('Seuls les administrateurs peuvent se connecter si le site est en mode de maintenance. Veuillez attendre svp.');
          setTimeout(() => {
            navigate('/maintenance');
          }, 2000);
        }
      } else {
        toast.error('Email non trouvé');
        setShowPasswordField(false);
        setUserRole(null);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
      toast.error('Erreur lors de la vérification de l\'email');
    }
  }, 500);

  useEffect(() => {
    const subscription = emailForm.watch((value, { name }) => {
      if (name === 'email') {
        checkEmailAndRole(value.email || '');
      }
    });
    return () => subscription.unsubscribe();
  }, [emailForm]);

  const onEmailSubmit = async (data: z.infer<typeof emailSchema>) => {
    // L'email est déjà vérifié par le debounce
  };

  const onPasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    if (userRole !== 'admin') {
      toast.error('Accès refusé');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await authAPI.login({ email: data.email, password: data.password });
      
      if (response.data.user.role === 'admin') {
        toast.success('Connexion réussie');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Marquer que cet admin s'est connecté via la page maintenance
        localStorage.setItem('maintenanceAdminBypass', 'true');
        
        // Redirection vers la page d'accueil
        navigate('/');
      } else {
        toast.error('Accès administrateur requis');
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      if (error.response?.status === 401) {
        toast.error('Mot de passe incorrect');
        passwordForm.reset({ email: userEmail, password: '' });
      } else {
        toast.error('Erreur de connexion');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-red-950/20 dark:via-neutral-950 dark:to-red-950/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-lg mb-4">
            <ShoppingBag className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Riziky Boutique
          </h1>
          <div className="flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400">
            <Wrench className="h-4 w-4" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Accès administrateur - Mode maintenance
            </p>
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <LogIn className="h-6 w-6 text-red-600" />
              Connexion Admin
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              Connectez-vous avec vos identifiants administrateur
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!showPasswordField ? (
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-5">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Adresse email administrateur
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="admin@email.com" 
                              {...field} 
                              className="pl-12 h-12 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500 rounded-xl"
                            />
                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            ) : (
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5">
                  <FormField
                    control={passwordForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Email administrateur confirmé
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              {...field} 
                              disabled
                              className="pl-12 h-12 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl"
                            />
                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-green-500" />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Mot de passe administrateur
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
                        Connexion...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" />
                        Se connecter
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>

          <CardFooter className="pt-6">
            <div className="text-sm text-center text-gray-600 dark:text-gray-400 w-full">
              <Link 
                to="/" 
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold hover:underline transition-colors"
              >
                ← Retour à la page de maintenance
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default MaintenanceLoginPage;
