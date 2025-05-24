
import React from 'react';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';
import { toast } from 'sonner';

interface CookieManagerProps {
  className?: string;
}

const CookieManager: React.FC<CookieManagerProps> = ({ className = '' }) => {
  const openCookieSettings = () => {
    // Effacer les préférences existantes pour forcer l'affichage du consentement
    localStorage.removeItem('cookie-consent');
    
    // Recharger la page pour afficher la bannière de consentement
    toast.info("Configuration des cookies", { 
      description: "Veuillez rafraîchir la page pour accéder aux paramètres des cookies" 
    });
    
    // Rafraîchir la page après une courte pause
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={`text-xs flex items-center gap-1 ${className}`}
      onClick={openCookieSettings}
    >
      <Cookie className="h-3 w-3" />
      <span>Gérer les cookies</span>
    </Button>
  );
};

export default CookieManager;
