
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Cookie, X, ExternalLink, Shield } from 'lucide-react';
import { toast } from "sonner";

// Interface pour les préférences de cookies
interface CookiePreferences {
  essential: boolean;
  performance: boolean;
  functional: boolean;
  targeting: boolean;
  consentDate: string;
  version: string;
}

// Version actuelle de la politique de cookies - à incrémenter lors des changements majeurs
const COOKIE_POLICY_VERSION = "1.0";

const CookieConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Toujours activé car essentiel
    performance: false,
    functional: false,
    targeting: false,
    consentDate: new Date().toISOString(),
    version: COOKIE_POLICY_VERSION
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
        
        // Vérifier si la version de la politique a changé
        if (typeof savedPreferences === 'object' && savedPreferences.version !== COOKIE_POLICY_VERSION) {
          // Si la version a changé, demander à nouveau le consentement
          setShowConsent(true);
        } else if (typeof savedPreferences === 'object') {
          setPreferences(savedPreferences);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des préférences de cookies:', error);
        // En cas d'erreur, demander à nouveau le consentement
        setShowConsent(true);
      }
    }
  }, []);
  
  const savePreferences = (prefs: CookiePreferences) => {
    // Ajouter la date et la version à l'enregistrement
    const prefsToSave = {
      ...prefs,
      consentDate: new Date().toISOString(),
      version: COOKIE_POLICY_VERSION
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(prefsToSave));
    setPreferences(prefsToSave);
    setShowConsent(false);
    
    // Appliquer les préférences (fictif - à implémenter selon les besoins)
    applyConsentPreferences(prefsToSave);
    
    // Afficher un toast de confirmation
    toast.success("Vos préférences de cookies ont été enregistrées", {
      description: "Vous pouvez les modifier à tout moment via l'icône cookie en bas de page",
      duration: 5000,
    });
  };
  
  const applyConsentPreferences = (prefs: CookiePreferences) => {
    // Dans cette fonction, on appliquerait les préférences aux différents services
    // Par exemple, activer/désactiver Google Analytics, etc.
    console.log("Applying consent preferences:", prefs);
    
    // Google Analytics (exemple)
    if (prefs.performance) {
      // Activer GA
      console.log("Google Analytics enabled");
    } else {
      // Désactiver GA
      console.log("Google Analytics disabled");
    }
    
    // Facebook Pixel (exemple)
    if (prefs.targeting) {
      // Activer Facebook Pixel
      console.log("Facebook Pixel enabled");
    } else {
      // Désactiver Facebook Pixel
      console.log("Facebook Pixel disabled");
    }
  };
  
  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      performance: true,
      functional: true,
      targeting: true,
      consentDate: new Date().toISOString(),
      version: COOKIE_POLICY_VERSION
    };
    savePreferences(allAccepted);
  };
  
  const acceptEssential = () => {
    const essentialOnly = {
      essential: true,
      performance: false,
      functional: false,
      targeting: false,
      consentDate: new Date().toISOString(),
      version: COOKIE_POLICY_VERSION
    };
    savePreferences(essentialOnly);
  };
  
  const saveCustomPreferences = () => {
    savePreferences({
      ...preferences,
      essential: true, // Toujours garder les cookies essentiels
      consentDate: new Date().toISOString(),
      version: COOKIE_POLICY_VERSION
    });
  };
  
  const togglePreference = (type: keyof Omit<CookiePreferences, 'consentDate' | 'version'>) => {
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
                
                <div className="flex items-center gap-1 mb-4 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-2 rounded-md">
                  <Shield className="h-4 w-4" />
                  <span>Conforme au RGPD et à la directive ePrivacy</span>
                </div>
                
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Nous utilisons des cookies pour améliorer votre expérience de navigation, 
                  personnaliser le contenu et les publicités, fournir des fonctionnalités de 
                  médias sociaux et analyser notre trafic. Nous partageons également des informations 
                  sur votre utilisation de notre site avec nos partenaires. Vous avez le droit de contrôler vos données personnelles.
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
                        aria-label="Accepter les cookies de performance"
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
                        aria-label="Accepter les cookies fonctionnels"
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
                        aria-label="Accepter les cookies de publicité"
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
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-500">
                  <Link 
                    to="/politique-cookies" 
                    className="flex items-center hover:text-neutral-700 dark:hover:text-neutral-200"
                  >
                    Politique de cookies <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                  <span>•</span>
                  <Link 
                    to="/politique-confidentialite" 
                    className="flex items-center hover:text-neutral-700 dark:hover:text-neutral-200"
                  >
                    Politique de confidentialité <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                  <span>•</span>
                  <Link 
                    to="/mentions-legales" 
                    className="flex items-center hover:text-neutral-700 dark:hover:text-neutral-200"
                  >
                    Mentions légales <ExternalLink className="h-3 w-3 ml-1" />
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
