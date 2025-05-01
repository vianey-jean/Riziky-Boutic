
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import Layout from '@/components/layout/Layout';
import { authAPI } from '@/services/api';
import PasswordStrengthIndicator from '@/components/auth/PasswordStrengthIndicator';
import { CheckCircle, Mail } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const emailFormSchema = z.object({
  email: z.string().email('Email invalide'),
});

const resetFormSchema = z.object({
  email: z.string().email('Email invalide'),
  passwordUnique: z.string().min(1, 'Le code temporaire est requis'),
  newPassword: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères')
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
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type EmailFormValues = z.infer<typeof emailFormSchema>;
type ResetFormValues = z.infer<typeof resetFormSchema>;

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isTempPasswordValid, setIsTempPasswordValid] = useState(false);
  const [showContactAdmin, setShowContactAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: '',
    },
  });
  
  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: {
      email: '',
      passwordUnique: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmitEmail = async (data: EmailFormValues) => {
    try {
      setIsLoading(true);
      
      // Vérifier si l'email existe
      const emailCheckResponse = await authAPI.checkEmail(data.email);
      
      if (!emailCheckResponse.data.exists) {
        toast.error(`Aucun compte trouvé avec l'email ${data.email}`);
        setIsLoading(false);
        return;
      }
      
      setUserEmail(data.email);
      
      // Récupérer l'ID utilisateur
      const userId = emailCheckResponse.data.userId;
      setUserId(userId);
      
      try {
        // Récupérer les informations utilisateur sans authentification
        const response = await fetch(`https://riziky-boutic-server.onrender.com/api/auth/user-temp-password?email=${encodeURIComponent(data.email)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const userData = await response.json();
        
        if (!userData.passwordUnique) {
          // L'utilisateur n'a pas de mot de passe temporaire
          setShowContactAdmin(true);
          toast.error("Aucun code temporaire n'a été défini pour votre compte. Veuillez contacter l'administrateur.");
        } else {
          // L'utilisateur a un mot de passe temporaire
          resetForm.setValue('email', data.email);
          toast.success(`Veuillez saisir le mot de passe à usage unique fourni par l'administrateur.`);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        toast.error("Une erreur s'est produite. Veuillez réessayer plus tard.");
        setShowContactAdmin(true);
      }
    } catch (error) {
      console.error('Erreur de vérification de l\'email:', error);
      toast.error("Une erreur s'est produite. Veuillez réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTempPassword = async () => {
    if (!userId || !userEmail) return;
    
    const tempPassword = resetForm.getValues('passwordUnique');
    if (!tempPassword) return;
    
    try {
      setIsLoading(true);
      
      const response = await fetch(`https://riziky-boutic-server.onrender.com/api/auth/verify-temp-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          tempPassword: tempPassword
        }),
      });
      
      if (!response.ok) {
        toast.error("Code temporaire invalide.");
        setIsTempPasswordValid(false);
        setIsLoading(false);
        return;
      }
      
      const data = await response.json();
      
      if (data.valid) {
        setIsTempPasswordValid(true);
        toast.success("Code temporaire valide. Vous pouvez maintenant définir un nouveau mot de passe.");
      } else {
        setIsTempPasswordValid(false);
        toast.error("Code temporaire invalide.");
      }
    } catch (error) {
      console.error('Erreur de vérification du code temporaire:', error);
      toast.error("Erreur de vérification du code temporaire.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitReset = async (data: ResetFormValues) => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      
      // Appel API pour réinitialiser le mot de passe avec endpoint modifié
      const response = await fetch(`https://riziky-boutic-server.onrender.com/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          passwordUnique: data.passwordUnique,
          newPassword: data.newPassword
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Une erreur s'est produite");
      }
      
      toast.success("Votre mot de passe a été réinitialisé avec succès");
      navigate('/login');
    } catch (error: any) {
      console.error('Erreur de réinitialisation du mot de passe:', error);
      toast.error(error.message || "Une erreur s'est produite lors de la réinitialisation du mot de passe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[70vh]">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Mot de passe oublié</CardTitle>
            <CardDescription>
              {userId && !showContactAdmin
                ? 'Entrez votre code temporaire et créez un nouveau mot de passe'
                : 'Entrez votre adresse email pour commencer la réinitialisation'}
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
                    Aucun code temporaire n'a été défini pour votre compte. Veuillez contacter l'administrateur du site à l'adresse suivante :
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
                          <Input 
                            type="password" 
                            placeholder="********" 
                            {...field} 
                            disabled={!isTempPasswordValid}
                          />
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
                          <Input 
                            type="password" 
                            placeholder="********" 
                            {...field}
                            disabled={!isTempPasswordValid}
                          />
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
                    {isLoading ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
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
