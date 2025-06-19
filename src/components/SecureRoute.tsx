
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRealRoute, isValidSecureId, getEntityType, getRealId } from '@/services/secureIds';
import NotFound from '@/pages/NotFound';
import { toast } from '@/components/ui/sonner';

interface SecureRouteProps {
  children: React.ReactNode;
}

const SecureRoute: React.FC<SecureRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.substring(1); // Enlever le / initial
  const [isValidPath, setIsValidPath] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Routes publiques autorisées (non sécurisées)
    const publicRoutes = [
      'flash-sale',
      'products',
      'categories',
      'home',
      'contact',
      'about',
      'login',
      'register',
      'cart',
      'favorites',
      'profile',
      'orders',
      'checkout'
    ];

    // Vérifier si c'est une route publique
    const isPublicRoute = publicRoutes.some(route => path.startsWith(route));
    
    if (isPublicRoute) {
      console.log('Route publique autorisée:', path);
      setIsValidPath(true);
      return;
    }

    // Vérifier si c'est une route sécurisée connue
    const realPath = getRealRoute(path);
    const realOrderId = getRealId(path);
    
    console.log('Secure Route Check:', { path, realPath, realOrderId });
    
    // Si c'est un ID de commande sécurisé (ID réel commence par ORD-)
    if (!realPath && realOrderId && realOrderId.startsWith('ORD-')) {
      console.log('Valid order ID found:', realOrderId);
      setIsValidPath(true);
      return;
    }
    
    // Vérification pour les routes statiques sécurisées
    if (realPath) {
      console.log('Valid static route found:', realPath);
      setIsValidPath(true);
      return;
    }
    
    // Si aucune correspondance n'est trouvée
    console.log('Route invalide détectée:', path);
    toast.error("Ce lien n'est plus valide");
    navigate('/not-found', { replace: true });
    setIsValidPath(false);
  }, [path, navigate]);

  // Afficher un chargement pendant la vérification
  if (isValidPath === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Vérification de l'accès sécurisé...</p>
        </div>
      </div>
    );
  }
  
  // Si la route est invalide, ne rien afficher (la redirection est en cours)
  if (isValidPath === false) {
    return null;
  }
  
  // Si la route est sécurisée, afficher le contenu enfant
  return <>{children}</>;
};

export default SecureRoute;
