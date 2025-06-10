
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import MaintenancePage from '@/pages/MaintenancePage';
import LoadingFallback from './LoadingFallback';

interface MaintenanceCheckerProps {
  children: React.ReactNode;
}

const MaintenanceChecker: React.FC<MaintenanceCheckerProps> = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  
  const { data: siteSettings, isLoading, refetch } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      console.log('=== VÉRIFICATION MODE MAINTENANCE ===');
      console.log('URL de l\'API:', `${API_BASE_URL}/api/site-settings`);
      const response = await axios.get(`${API_BASE_URL}/api/site-settings`);
      console.log('Réponse complète des paramètres:', response.data);
      return response.data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
  });

  // Recharger les paramètres à chaque changement de route
  useEffect(() => {
    console.log('=== CHANGEMENT DE ROUTE ===');
    console.log('Route actuelle:', location.pathname);
    refetch();
  }, [location.pathname, refetch]);

  if (isLoading) {
    console.log('Chargement des paramètres en cours...');
    return <LoadingFallback />;
  }

  // Vérifier les paramètres de maintenance
  const isMaintenanceMode = siteSettings?.system?.maintenanceMode;
  
  // Vérifier si l'utilisateur est un admin connecté via maintenance-login
  const isMaintenanceAdmin = localStorage.getItem('maintenanceAdminBypass') === 'true';
  
  console.log('=== ÉTAT DU MODE MAINTENANCE ===');
  console.log('maintenanceMode dans les paramètres:', isMaintenanceMode);
  console.log('Type de maintenanceMode:', typeof isMaintenanceMode);
  console.log('Route actuelle:', location.pathname);
  console.log('Utilisateur connecté:', !!user);
  console.log('Est admin:', isAdmin);
  console.log('Admin bypass maintenance:', isMaintenanceAdmin);
  
  // NOUVELLE LOGIQUE: Si l'admin a le flag maintenanceAdminBypass, on le laisse passer même si le contexte n'est pas encore mis à jour
  if (isMaintenanceAdmin) {
    console.log('>>> ADMIN CONNECTÉ VIA MAINTENANCE - BYPASS MODE MAINTENANCE <<<');
    return <>{children}</>;
  }
  
  // Décision de redirection
  console.log('=== DÉCISION DE REDIRECTION ===');
  console.log('Mode maintenance actif:', isMaintenanceMode);
  console.log('Page actuelle:', location.pathname);
  console.log('Est sur page maintenance-login:', location.pathname === '/maintenance-login');
  
  // Si le mode maintenance est activé ET qu'on n'est pas sur la page de connexion maintenance
  if (isMaintenanceMode === true && location.pathname !== '/maintenance-login') {
    console.log('>>> REDIRECTION VERS PAGE MAINTENANCE (TOUS UTILISATEURS) <<<');
    return <MaintenancePage />;
  }

  // Si le mode maintenance est désactivé ET qu'on est sur la page maintenance-login, rediriger vers l'accueil
  if (isMaintenanceMode === false && location.pathname === '/maintenance-login') {
    console.log('>>> MODE MAINTENANCE DÉSACTIVÉ - REDIRECTION VERS ACCUEIL <<<');
    window.location.href = '/';
    return <LoadingFallback />;
  }

  console.log('>>> ACCÈS AUTORISÉ À LA PAGE DEMANDÉE <<<');
  return <>{children}</>;
};

export default MaintenanceChecker;
