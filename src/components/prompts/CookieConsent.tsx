
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';
import { toast } from "sonner";

// Interface pour les préférences de cookies
interface CookiePreferences {
  essential: boolean;
  performance: boolean;
  functional: boolean;
  targeting: boolean;
}

const CookieConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Toujours activé car essentiel
    performance: false,
    functional: false,
    targeting: false
  });
  
  // Vérifier si l'utilisateur a déjà donné son consentement
  useEffect(() => {
    const consentGiven = localStorage.getItem('cookie-consent');
    if (!consentGiven) {
      // Afficher la bannière après un petit délai pour éviter de l'afficher immédiatement au chargement
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      try {
        // Charger les préférences sauvegardées
        const savedPreferences = JSON.parse(consentGiven);
        if (typeof savedPreferences === 'object') {
          setPreferences(savedPreferences);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des préférences de cookies:', error);
      }
    }
  }, []);
  
  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    setPreferences(prefs);
    setShowConsent(false);
    
    // Afficher un toast de confirmation
    toast.success("Vos préférences de cookies ont été enregistrées", {
      description: "Vous pouvez les modifier à tout moment via le lien en bas de page",
      duration: 5000,
    });
  };
  
  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      performance: true,
      functional: true,
      targeting: true
    };
    savePreferences(allAccepted);
  };
  
  const acceptEssential = () => {
    const essentialOnly = {
      essential: true,
      performance: false,
      functional: false,
      targeting: false
    };
    savePreferences(essentialOnly);
  };
  
  const saveCustomPreferences = () => {
    savePreferences({
      ...preferences,
      essential: true // Toujours garder les cookies essentiels
    });
  };
  
  const togglePreference = (type: keyof CookiePreferences) => {
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  const dismiss = () => {
    setShowConsent(false);
  };
  
  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-50 p-4"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex items-start">
              <div className="hidden sm:flex h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 items-center justify-center flex-shrink-0 mr-4">
                <Cookie className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold mb-2">Notre site utilise des cookies</h3>
                  <button onClick={dismiss} className="text-neutral-400 hover:text-neutral-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Nous utilisons des cookies pour améliorer votre expérience de navigation, 
                  personnaliser le contenu et les publicités, fournir des fonctionnalités de 
                  médias sociaux et analyser notre trafic. Nous partageons également des informations 
                  sur votre utilisation de notre site avec nos partenaires.
                </p>
                
                {showDetails ? (
                  <div className="mb-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Cookies essentiels</p>
                        <p className="text-sm text-neutral-500">Nécessaires au fonctionnement du site</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={preferences.essential} 
                        disabled 
                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Cookies de performance</p>
                        <p className="text-sm text-neutral-500">Analyse des visites pour améliorer le site</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={preferences.performance} 
                        onChange={() => togglePreference('performance')} 
                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Cookies fonctionnels</p>
                        <p className="text-sm text-neutral-500">Se souvenir de vos préférences</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={preferences.functional} 
                        onChange={() => togglePreference('functional')} 
                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Cookies de publicité</p>
                        <p className="text-sm text-neutral-500">Personnalisation des publicités</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={preferences.targeting} 
                        onChange={() => togglePreference('targeting')} 
                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                    </div>
                  </div>
                ) : null}
                
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <Button 
                    variant="default" 
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700" 
                    onClick={acceptAll}
                  >
                    Accepter tous les cookies
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto" 
                    onClick={showDetails ? saveCustomPreferences : acceptEssential}
                  >
                    {showDetails ? 'Enregistrer mes préférences' : 'Accepter uniquement les cookies essentiels'}
                  </Button>
                  
                  <Button
                    variant="link"
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                  >
                    {showDetails ? 'Masquer les détails' : 'Personnaliser mes choix'}
                  </Button>
                  
                  <Link 
                    to="/politique-cookies" 
                    className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 underline"
                  >
                    En savoir plus
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
