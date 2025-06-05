
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { authAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Shield, Lock, ArrowLeft } from 'lucide-react';
import PasswordStrengthIndicator from '@/components/auth/PasswordStrengthIndicator';
import { getSecureRoute } from '@/services/secureIds';

// ✅ Validation schemas
const emailSchema = z.object({
  email: z.string().email('Email invalide'),
});
const passwordSchema = z.object({
  password: z.string().min(1, 'Mot de passe requis'),
});

const LoginMaintenanceAdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
      console.log('Vérification email:', normalizedEmail);
      const response = await authAPI.checkEmail(normalizedEmail);
      console.log('Réponse checkEmail:', response.data);

      if (response.data.exists) {
        setUserEmail(normalizedEmail);
        setUserName(response.data.user.nom || 'Utilisateur');
        setStep('password');
        toast({
          title: "✅ Email vérifié",
          description: `Bienvenue ${response.data.user.nom || 'Utilisateur'}`,
          className: "bg-green-500 text-white border-green-600",
        });
      } else {
        toast({
          title: "❌ Erreur",
          description: "Cet email n'existe pas",
          variant: "destructive",
          className: "bg-red-500 text-white border-red-600",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email:", error);
      toast({
        title: "❌ Erreur",
        description: "Erreur lors de la vérification de l'email",
        variant: "destructive",
        className: "bg-red-500 text-white border-red-600",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Gestion soumission mot de passe
  const onPasswordSubmit = async (data: { password: string }) => {
    try {
      setIsLoading(true);
      console.log('Tentative de connexion pour:', userEmail);
      
      const response = await authAPI.login({ email: userEmail, password: data.password });
      console.log('Réponse login:', response.data);
      
      // Vérifier que c'est un admin
      if (response.data.user.role !== 'admin') {
        toast({
          title: "❌ Accès refusé",
          description: "Cette email n'est pas admin et vérifiez bien votre identifiant",
          variant: "destructive",
          className: "bg-red-500 text-white border-red-600",
        });
        return;
      }

      // Stocker le token
      localStorage.setItem('authToken', response.data.token);
      
      toast({
        title: "✅ Connexion réussie",
        description: "Redirection vers les paramètres",
        className: "bg-green-500 text-white border-green-600",
      });

      console.log('Redirection vers /admin/parametres');
      
      // Forcer la redirection en utilisant window.location
      const secureRoute = getSecureRoute('/admin/parametres');
      window.location.href = secureRoute;
      
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      const errorMessage = error.response?.data?.message || "Mot de passe incorrect";
      toast({
        title: "❌ Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
        className: "bg-red-500 text-white border-red-600",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <Card className="w-full max-w-md relative backdrop-blur-sm bg-white/10 border-white/20 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Mode Maintenance
            </CardTitle>
            <CardDescription className="text-gray-300 mt-2">
              Accès réservé aux administrateurs
            </CardDescription>
          </div>
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
                      <FormLabel className="text-gray-200 font-medium">Adresse Email</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            {...field}
                            placeholder="admin@example.com"
                            className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:bg-white/20 focus:border-purple-400 transition-all duration-300 pl-12"
                            onChange={(e) => field.onChange(e.target.value.trim())}
                          />
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Vérification...</span>
                    </div>
                  ) : (
                    "Continuer"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-green-200 text-sm">
                      Connecté en tant que : <strong className="text-green-100">{userEmail}</strong>
                    </p>
                  </div>
                </div>

                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200 font-medium">Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Votre mot de passe"
                            className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:bg-white/20 focus:border-purple-400 transition-all duration-300 pl-12 pr-12"
                          />
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-10 w-10 text-gray-400 hover:text-white"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-300" />
                      <PasswordStrengthIndicator password={field.value} />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Connexion...</span>
                      </div>
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                    onClick={() => setStep('email')}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Modifier l'email
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginMaintenanceAdminPage;
