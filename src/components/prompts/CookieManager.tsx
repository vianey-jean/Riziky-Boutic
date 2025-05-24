
import React from 'react';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';
import { toast } from 'sonner';

interface CookieManagerProps {
  className?: string;
  position?: 'footer' | 'fixed';
}

const CookieManager: React.FC<CookieManagerProps> = ({ className = '', position = 'footer' }) => {
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
    <>
      {position === 'footer' ? (
        <Button 
          variant="ghost" 
          size="sm" 
          className={`text-xs flex items-center gap-1 ${className}`}
          onClick={openCookieSettings}
        >
          <Cookie className="h-3 w-3" />
          <span>Gérer les cookies</span>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 left-4 z-50 rounded-full h-10 w-10 shadow-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
          onClick={openCookieSettings}
          aria-label="Gérer les cookies"
        >
          <Cookie className="h-5 w-5" />
        </Button>
      )}
    </>
  );
};

export default CookieManager;
