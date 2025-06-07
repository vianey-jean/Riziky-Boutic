
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
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
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
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
      <div className="flex justify-center items-center min-h-[70vh]">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>Accédez à votre compte</CardDescription>
          </CardHeader>

          <CardContent>
            {step === 'email' ? (
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="email@example.com"
                              onChange={(e) => field.onChange(e.target.value.trim())}
                            />
                            <Mail className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Chargement..." : "Continuer"}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <p className="text-sm text-green-600 mb-4">
                    Connecté en tant que : <strong>{userEmail}</strong>
                </p>

                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                              placeholder="********"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0"
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? (
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
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Connexion..." : "Se connecter"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => setStep('email')}
                    disabled={isLoading}
                  >
                    Modifier l'email
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Mot de passe oublié ?
            </Link>
            <div className="text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                S'inscrire
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage;
