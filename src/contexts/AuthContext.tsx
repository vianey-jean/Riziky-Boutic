
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authAPI, User } from '../services/api';
import { UpdateProfileData } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
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
  const { toast } = useToast();

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
  }, []);

  const setRedirectAfterLogin = (path: string) => {
    localStorage.setItem('redirectAfterLogin', path);
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log("Tentative de connexion avec:", { email });
      const response = await authAPI.login({ email, password });
      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user);
     toast({
  title: 'Connexion réussie',
  className: 'bg-green-500 text-white', // fond vert + texte blanc
  variant: 'default',
});

      // Vérifier s'il y a une redirection à faire
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectPath;
      } else {
        // Navigation via window.location pour éviter les problèmes de hooks
        window.location.href = '/';
      }
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      
      const errorMessage = error.response?.data?.message || "Erreur de connexion";
      toast({
        title: errorMessage,
        variant: 'destructive',
      });

      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('maintenanceAdminBypass'); // Supprimer le marqueur admin
    localStorage.removeItem('redirectAfterLogin'); // Nettoyer la redirection
    setUser(null);
    toast({
      title: 'Vous êtes déconnecté',
      variant: 'destructive',
    });

    // Navigation vers l'accueil lors de la déconnexion
    window.location.href = '/';
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

      // Vérifier s'il y a une redirection à faire
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectPath;
      } else {
        // Navigation via window.location pour éviter les problèmes de hooks
        window.location.href = '/';
      }
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
