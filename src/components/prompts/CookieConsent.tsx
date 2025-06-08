import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Cookie, X, ExternalLink, Shield, Sparkles, Lock } from 'lucide-react';
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
          className="fixed inset-x-0 bottom-0 z-50 p-3"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, type: "spring", damping: 25 }}
        >
          <div className="max-w-3xl mx-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 relative overflow-hidden">
            {/* Éléments décoratifs animés - réduits */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full translate-y-10 -translate-x-10"></div>
            
            <div className="flex items-start relative z-10">
              <motion.div 
                className="hidden sm:flex h-12 w-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 items-center justify-center flex-shrink-0 mr-4 shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", damping: 15 }}
              >
                <Cookie className="h-6 w-6 text-white" />
              </motion.div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-lg font-bold mb-1 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                      Notre site utilise des cookies
                    </h3>
                  </motion.div>
                  <motion.button 
                    onClick={dismiss} 
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 ml-2"
                    aria-label="Fermer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
                
                <motion.div 
                  className="flex items-center gap-2 mb-4 text-xs bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 p-2 rounded-lg border border-blue-200 dark:border-blue-800"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Shield className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    <span className="font-medium">Conforme au RGPD</span>
                  </div>
                </motion.div>
                
                <motion.p 
                  className="text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Nous utilisons des cookies pour améliorer votre expérience et analyser notre trafic.
                </motion.p>
                
                {showDetails && (
                  <motion.div 
                    className="mb-4 space-y-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {[
                      { key: 'essential', title: 'Cookies essentiels', desc: 'Nécessaires au fonctionnement', disabled: true, color: 'from-green-500 to-emerald-500' },
                      { key: 'performance', title: 'Cookies de performance', desc: 'Analyse des visites', disabled: false, color: 'from-blue-500 to-cyan-500' },
                      { key: 'functional', title: 'Cookies fonctionnels', desc: 'Préférences utilisateur', disabled: false, color: 'from-purple-500 to-violet-500' },
                      { key: 'targeting', title: 'Cookies de publicité', desc: 'Publicités personnalisées', disabled: false, color: 'from-orange-500 to-red-500' }
                    ].map((cookie, index) => (
                      <motion.div 
                        key={cookie.key}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 bg-gradient-to-r ${cookie.color} rounded-lg flex items-center justify-center`}>
                            <Sparkles className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{cookie.title}</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">{cookie.desc}</p>
                          </div>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={preferences[cookie.key as keyof typeof preferences] as boolean} 
                          disabled={cookie.disabled}
                          onChange={() => !cookie.disabled && togglePreference(cookie.key as keyof Omit<CookiePreferences, 'consentDate' | 'version'>)} 
                          className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                          aria-label={`Accepter les ${cookie.title.toLowerCase()}`}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-3 items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button 
                    variant="default" 
                    className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-lg px-6 py-2 font-semibold text-sm"
                    onClick={acceptAll}
                  >
                    <Cookie className="h-4 w-4 mr-2" />
                    Accepter tous
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 transition-all duration-300 rounded-lg px-4 py-2 font-medium text-sm"
                    onClick={showDetails ? saveCustomPreferences : acceptEssential}
                  >
                    {showDetails ? 'Enregistrer' : 'Essentiels uniquement'}
                  </Button>
                  
                  <Button
                    variant="link"
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 font-medium"
                  >
                    {showDetails ? 'Masquer' : 'Personnaliser'}
                  </Button>
                </motion.div>
                
                <motion.div 
                  className="mt-4 flex flex-wrap gap-3 text-xs text-neutral-500 dark:text-neutral-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {[
                    { to: "/politique-cookies", text: "Politique de cookies" },
                    { to: "/politique-confidentialite", text: "Confidentialité" },
                    { to: "/mentions-legales", text: "Mentions légales" }
                  ].map((link, index) => (
                    <Link 
                      key={index}
                      to={link.to} 
                      className="flex items-center hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      {link.text} <ExternalLink className="h-2 w-2 ml-1" />
                    </Link>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
