
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginMaintenanceAdminPage from '@/pages/LoginMaintenanceAdminPage';

interface MaintenanceCheckerProps {
  children: React.ReactNode;
}

const MaintenanceChecker: React.FC<MaintenanceCheckerProps> = ({ children }) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    checkMaintenanceMode();
  }, []);

  const checkMaintenanceMode = async () => {
    try {
      // Utiliser la nouvelle route publique
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public-settings/general`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Paramètres maintenance récupérés:', data);
        setIsMaintenanceMode(data?.maintenanceMode || false);
      } else {
        console.error('Erreur API paramètres:', response.status, response.statusText);
        setIsMaintenanceMode(false);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du mode maintenance:', error);
      setIsMaintenanceMode(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    console.log('Clic sur bouton connexion administrateur - affichage page maintenance');
    setShowAdminLogin(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  // Permettre l'accès aux pages de connexion et admin même en mode maintenance
  const isLoginPage = location.pathname.includes('login') || location.pathname.includes('auth');
  const isAdminPage = location.pathname.includes('admin');

  // Si l'utilisateur est authentifié comme admin, toujours permettre l'accès
  if (isAuthenticated && isAdmin) {
    return <>{children}</>;
  }

  if (isMaintenanceMode && !isLoginPage && !isAdminPage) {
    // Si on doit afficher la page de connexion admin
    if (showAdminLogin) {
      return <LoginMaintenanceAdminPage />;
    }

    // Sinon afficher la page de maintenance normale
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center text-orange-600">
              Mode Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Alert>
              <AlertDescription>
                Le site est actuellement en maintenance. Seuls les administrateurs peuvent se connecter.
              </AlertDescription>
            </Alert>
            <Button onClick={handleAdminLogin} className="w-full">
              Connexion Administrateur
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default MaintenanceChecker;
