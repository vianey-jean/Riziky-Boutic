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
import { Eye, EyeOff, CheckCircle, Mail } from 'lucide-react';
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

  const toggleNewPasswordVisibility  = () => setShowNewPassword(!showNewPassword);
  const togglePasswordConfirmVisibility = () => setShowConfirmPassword(!showConfirmPassword);
  
  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[70vh]">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Mot de passe oublié</CardTitle>
            <CardDescription>
              {userId && !showContactAdmin
                ? 'Entrez le code temporaire et créez un nouveau mot de passe'
                : 'Entrez votre adresse email pour commencer'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!userId ? (
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Vérification..." : "Continuer"}
                  </Button>
                </form>
              </Form>
            ) : showContactAdmin ? (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <Mail className="h-4 w-4" />
                  <AlertTitle>Code temporaire non trouvé</AlertTitle>
                  <AlertDescription>
                    Aucun code temporaire n'a été défini pour votre compte. Contactez l'administrateur :
                  </AlertDescription>
                </Alert>
                <div className="flex items-center justify-center p-4 bg-muted rounded-md">
                  <a href="mailto:vianey.jean@ymail.com" className="text-blue-600 font-medium hover:underline">
                    vianey.jean@ymail.com
                  </a>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setUserId(null);
                    setShowContactAdmin(false);
                    emailForm.reset();
                  }}
                >
                  Retour
                </Button>
              </div>
            ) : (
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(onSubmitReset)} className="space-y-4">
                  <FormField
                    control={resetForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" disabled {...field} />
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
                        <FormLabel>Code temporaire</FormLabel>
                        <div className="flex space-x-2">
                          <FormControl>
                            <Input
                              placeholder="Code temporaire"
                              {...field}
                              disabled={isTempPasswordValid}
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
                            >
                              Vérifier
                            </Button>
                          ) : (
                            <CheckCircle className="h-10 w-10 text-green-500" />
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
                        <FormLabel>Nouveau mot de passe</FormLabel>
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
                        <FormLabel>Confirmer le mot de passe</FormLabel>
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
                    className="w-full"
                    disabled={isLoading || !isTempPasswordValid}
                  >
                    {isLoading ? "Réinitialisation..." : "Réinitialiser"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter>
            <div className="text-sm text-muted-foreground w-full text-center">
              <Link to="/login" className="text-blue-600 hover:underline">
                Retour à la connexion
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;
