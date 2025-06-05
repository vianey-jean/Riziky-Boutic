import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authAPI, User } from '../services/api';
import { UpdateProfileData } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string, redirectTo?: string) => Promise<void>;
  logout: () => void;
  register: (nom: string, email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  setRedirectAfterLogin: (path: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectAfterLogin, setRedirectAfterLoginState] = useState<string | null>(null);
  const { toast } = useToast();

  const setRedirectAfterLogin = (path: string) => {
    setRedirectAfterLoginState(path);
    localStorage.setItem('redirectAfterLogin', path);
  };

  const clearRedirectAfterLogin = () => {
    setRedirectAfterLoginState(null);
    localStorage.removeItem('redirectAfterLogin');
  };

  const validateToken = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return false;
    }
    
    try {
      const response = await authAPI.verifyToken();
      if (response.data && response.data.valid) {
        setUser(response.data.user);
        return true;
      }
    } catch (error) {
      console.error("Erreur de vérification du token:", error);
      localStorage.removeItem('authToken');
    }
    
    setLoading(false);
    return false;
  };

  useEffect(() => {
    const verifyToken = async () => {
      await validateToken();
      setLoading(false);
    };

    verifyToken();

    // Récupérer la redirection sauvegardée s'il y en a une
    const savedRedirect = localStorage.getItem('redirectAfterLogin');
    if (savedRedirect) {
      setRedirectAfterLoginState(savedRedirect);
    }
  }, []);

  const login = async (email: string, password: string, redirectTo?: string): Promise<void> => {
    try {
      console.log("Tentative de connexion avec:", { email });
      
      // Vérifier d'abord le mode maintenance
      const isMaintenanceMode = await checkMaintenanceMode();
      console.log("Mode maintenance:", isMaintenanceMode);
      
      // Faire la connexion
      const response = await authAPI.login({ email, password });
      console.log("Réponse de connexion:", response.data.user?.role);
      
      // En mode maintenance, seuls les admins peuvent se connecter
      if (isMaintenanceMode && response.data.user?.role !== 'admin') {
        toast({
          title: 'Accès refusé',
          description: 'Seuls les administrateurs peuvent se connecter en mode maintenance',
          variant: 'destructive',
        });
        throw new Error('Seuls les administrateurs peuvent se connecter en mode maintenance');
      }
      
      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user);
      
      toast({
        title: 'Connexion réussie',
        variant: 'default',
      });

      // Déterminer la redirection
      let targetUrl = '/';
      
      // 1. Si une redirection spécifique est demandée
      if (redirectTo) {
        targetUrl = redirectTo;
      }
      // 2. Si une redirection était sauvegardée (favori, panier, etc.)
      else if (redirectAfterLogin) {
        targetUrl = redirectAfterLogin;
        clearRedirectAfterLogin();
      }
      // 3. Mode maintenance : admin vers paramètres, autre vers home
      else if (isMaintenanceMode && response.data.user.role === 'admin') {
        targetUrl = '/admin/parametres';
      }
      // 4. Mode normal : admin vers dashboard, client vers home
      else if (!isMaintenanceMode && response.data.user.role === 'admin') {
        targetUrl = '/admin';
      }
      
      console.log('Redirection vers:', targetUrl);
      window.location.href = targetUrl;
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      
      const errorMessage = error.response?.data?.message || error.message || "Erreur de connexion";
      toast({
        title: 'Erreur de connexion',
        description: errorMessage,
        variant: 'destructive',
      });

      throw error;
    }
  };

  // Vérifier le mode maintenance avec la nouvelle API publique
  const checkMaintenanceMode = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public-settings/general`);
      if (response.ok) {
        const data = await response.json();
        console.log('Mode maintenance vérifié:', data?.maintenanceMode);
        return data?.maintenanceMode || false;
      }
      return false;
    } catch (error) {
      console.error('Erreur vérification mode maintenance:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    clearRedirectAfterLogin();
    setUser(null);
    toast({
      title: 'Vous êtes déconnecté',
      variant: 'destructive',
    });

    // Navigation via window.location pour éviter les problèmes de hooks
    window.location.href = '/login';
  };

  const register = async (nom: string, email: string, password: string) => {
    try {
      const response = await authAPI.register({ nom, email, password });
      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user);
      toast({
        title: 'Inscription réussie',
        variant: 'default',
      });

      // Navigation via window.location pour éviter les problèmes de hooks
      window.location.href = '/';
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'inscription';
      toast({
        title: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authAPI.forgotPassword(email);
    } catch (error) {
      console.error("Erreur de demande de réinitialisation:", error);
      toast({
        title: 'Une erreur est survenue',
        variant: 'destructive',
      });
     
      throw error;
    }
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      await authAPI.resetPassword({ email, passwordUnique: code, newPassword });
    } catch (error) {
      console.error("Erreur de réinitialisation de mot de passe:", error);
      toast({
        title: 'Une erreur est survenue',
        variant: 'destructive',
      });
      
      throw error;
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');
      
      const isTokenValid = await validateToken();
      if (!isTokenValid) {
        toast({
          title: 'Votre session a expiré, veuillez vous reconnecter',
          variant: 'destructive',
        });
        window.location.href = '/login';
        throw new Error('Session expirée');
      }
      
      const response = await authAPI.updateProfile(user.id, data);
      setUser(prev => prev ? { ...prev, ...response.data } : null);
      toast({
        title: 'Profil mis à jour avec succès',
        variant: 'default',
      });
     
    } catch (error: any) {
      console.error("Erreur de mise à jour du profil:", error);
      toast({
        title: error.response?.data?.message || 'Erreur lors de la mise à jour du profil',
        variant: 'destructive',
      });
     
      throw error;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');
      
      const isTokenValid = await validateToken();
      if (!isTokenValid) {
        toast({
          title: 'Votre session a expiré, veuillez vous reconnecter',
          variant: 'destructive',
        });
        window.location.href = '/login';
        throw new Error('Session expirée');
      }
      
      await authAPI.updatePassword(user.id, currentPassword, newPassword);
      toast({
        title: 'Mot de passe mis à jour avec succès',
        variant: 'default',
      });
      
    } catch (error: any) {
      console.error("Erreur de mise à jour du mot de passe:", error);
      toast({
        title: error.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe',
        variant: 'destructive',
      });
     
      throw error;
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    updateProfile,
    updatePassword,
    setRedirectAfterLogin,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé avec AuthProvider');
  }
  return context;
};
