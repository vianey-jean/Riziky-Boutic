
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRealRoute, isValidSecureId, getEntityType } from '@/services/secureIds';
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
    // Vérifier si c'est une route sécurisée connue
    const realPath = getRealRoute(path);
    const isValidId = isValidSecureId(path);
    
    console.log('Secure Route Check:', { path, realPath, isValid: isValidId });
    
    if (!realPath && !isValidId) {
      console.log('Route invalide détectée:', path);
      toast.error("Ce lien n'est plus valide");
      navigate('/not-found', { replace: true });
      setIsValidPath(false);
    } else {
      setIsValidPath(true);
    }
  }, [path, navigate]);

  // Afficher un chargement pendant la vérification
  if (isValidPath === null) {
    return <div className="flex items-center justify-center min-h-screen">Vérification de l'accès...</div>;
  }
  
  // Si la route est invalide, ne rien afficher (la redirection est en cours)
  if (isValidPath === false) {
    return null;
  }
  
  // Si la route est sécurisée, afficher le contenu enfant
  return <>{children}</>;
};

export default SecureRoute;
