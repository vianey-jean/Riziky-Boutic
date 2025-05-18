
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authAPI, User, UpdateProfileData } from '../services/api';
import { toast } from '@/components/ui/sonner';
import { useNavigate, NavigateFunction } from 'react-router-dom';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Création d'un hook de navigation qui est sûr à utiliser
const NavigationContext = createContext<NavigateFunction | null>(null);

export const useAuthNavigate = () => {
  const navigate = useContext(NavigationContext);
  if (!navigate) {
    // Fallback pour les cas où useNavigate n'est pas disponible
    return (path: string) => {
      window.location.href = path;
    };
  }
  return navigate;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log("Tentative de connexion avec:", { email });
      const response = await authAPI.login({ email, password });
      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user);
      toast.success('Connexion réussie', {
        style: { backgroundColor: 'green', color: 'white' },
      });

      navigate('/');
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      
      // Vérifier si l'erreur vient de l'API et contient un message
      const errorMessage = error.response?.data?.message || "Erreur de connexion";
      toast.error(errorMessage, {
        style: { backgroundColor: 'red', color: 'white' },
      });

      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    toast.info('Vous êtes déconnecté', {
      style: { backgroundColor: 'red', color: 'white' },
    });

    navigate('/login');
  };

  const register = async (nom: string, email: string, password: string) => {
    try {
      const response = await authAPI.register({ nom, email, password });
      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user);
      toast.success('Inscription réussie', {
        style: { backgroundColor: 'green', color: 'white' },
      });

      navigate('/');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'inscription';
      toast.error(errorMessage);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authAPI.forgotPassword(email);
      // Le message de confirmation est géré par le composant
    } catch (error) {
      console.error("Erreur de demande de réinitialisation:", error);
      toast.error('Une erreur est survenue', {
        style: { backgroundColor: 'red', color: 'white' },
      });
     
      throw error;
    }
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      await authAPI.resetPassword({ email, passwordUnique: code, newPassword });
      // Le message de confirmation est géré par le composant
    } catch (error) {
      console.error("Erreur de réinitialisation de mot de passe:", error);
      toast.error('Une erreur est survenue', {
        style: { backgroundColor: 'red', color: 'white' },
      });
      
      throw error;
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');
      
      // Vérifier la validité du token avant la mise à jour du profil
      const isTokenValid = await validateToken();
      if (!isTokenValid) {
        toast.error('Votre session a expiré, veuillez vous reconnecter', {
          style: { backgroundColor: 'red', color: 'white' },
        });
        navigate('/login');
        throw new Error('Session expirée');
      }
      
      const response = await authAPI.updateProfile(user.id, data);
      setUser(prev => prev ? { ...prev, ...response.data } : null);
      toast.success('Profil mis à jour avec succès', {
        style: { backgroundColor: 'green', color: 'white' },
      });
     
    } catch (error: any) {
      console.error("Erreur de mise à jour du profil:", error);
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil', {
        style: { backgroundColor: 'red', color: 'white' },
      });
     
      throw error;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');
      
      // Vérifier la validité du token avant la mise à jour du mot de passe
      const isTokenValid = await validateToken();
      if (!isTokenValid) {
        toast.error('Votre session a expiré, veuillez vous reconnecter', {
          style: { backgroundColor: 'red', color: 'white' },
        });
        navigate('/login');
        throw new Error('Session expirée');
      }
      
      await authAPI.updatePassword(user.id, currentPassword, newPassword);
      toast.success('Mot de passe mis à jour avec succès', {
        style: { backgroundColor: 'green', color: 'white' },
      });
      
    } catch (error: any) {
      console.error("Erreur de mise à jour du mot de passe:", error);
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe', {
        style: { backgroundColor: 'red', color: 'white' },
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
  };

  return (
    <NavigationContext.Provider value={navigate}>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </NavigationContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé avec AuthProvider');
  }
  return context;
};
