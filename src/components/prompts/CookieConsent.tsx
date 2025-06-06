
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Cookie, X, ExternalLink, Shield, Lock, Eye, Target } from 'lucide-react';
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
          transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
        >
          <motion.div 
            className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-lg"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            {/* En-tête avec gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
              <div className="flex items-center justify-between">
                <motion.div 
                  className="flex items-center space-x-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="bg-white/20 p-2 rounded-full">
                    <Cookie className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Gestion des Cookies</h3>
                </motion.div>
                <motion.button 
                  onClick={dismiss} 
                  className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            <div className="p-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 mb-4 text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-3 rounded-xl border border-green-200 dark:border-green-800"
              >
                <Shield className="h-5 w-5" />
                <span className="font-medium">Conforme au RGPD et à la directive ePrivacy</span>
                <Lock className="h-4 w-4 ml-auto" />
              </motion.div>
              
              <motion.p 
                className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Nous utilisons des cookies pour améliorer votre expérience de navigation, 
                personnaliser le contenu et les publicités, fournir des fonctionnalités de 
                médias sociaux et analyser notre trafic. <span className="font-semibold text-blue-600 dark:text-blue-400">Vous avez le contrôle total sur vos données personnelles.</span>
              </motion.p>
              
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 space-y-4 overflow-hidden"
                  >
                    <div className="grid gap-4">
                      <motion.div 
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-500 p-2 rounded-full">
                            <Shield className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold">Cookies essentiels</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Nécessaires au fonctionnement du site</p>
                          </div>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={preferences.essential} 
                          disabled 
                          className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-not-allowed"
                        />
                      </motion.div>
                      
                      <motion.div 
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-500 p-2 rounded-full">
                            <Eye className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold">Cookies de performance</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Analyse des visites pour améliorer le site</p>
                          </div>
                        </div>
                        <motion.input 
                          type="checkbox" 
                          checked={preferences.performance} 
                          onChange={() => togglePreference('performance')} 
                          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                          aria-label="Accepter les cookies de performance"
                        />
                      </motion.div>
                      
                      <motion.div 
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-purple-500 p-2 rounded-full">
                            <Cookie className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold">Cookies fonctionnels</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Se souvenir de vos préférences</p>
                          </div>
                        </div>
                        <motion.input 
                          type="checkbox" 
                          checked={preferences.functional} 
                          onChange={() => togglePreference('functional')} 
                          className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                          aria-label="Accepter les cookies fonctionnels"
                        />
                      </motion.div>
                      
                      <motion.div 
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-orange-500 p-2 rounded-full">
                            <Target className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold">Cookies de publicité</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Personnalisation des publicités</p>
                          </div>
                        </div>
                        <motion.input 
                          type="checkbox" 
                          checked={preferences.targeting} 
                          onChange={() => togglePreference('targeting')} 
                          className="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                          aria-label="Accepter les cookies de publicité"
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 items-center mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="default" 
                    className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg border-none" 
                    onClick={acceptAll}
                  >
                    Accepter tous les cookies
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold px-6 py-3 rounded-xl" 
                    onClick={showDetails ? saveCustomPreferences : acceptEssential}
                  >
                    {showDetails ? 'Enregistrer mes préférences' : 'Accepter uniquement les essentiels'}
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="link"
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    {showDetails ? 'Masquer les détails' : 'Personnaliser mes choix'}
                  </Button>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link 
                    to="/politique-cookies" 
                    className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg"
                  >
                    Politique de cookies <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link 
                    to="/politique-confidentialite" 
                    className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg"
                  >
                    Politique de confidentialité <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link 
                    to="/mentions-legales" 
                    className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg"
                  >
                    Mentions légales <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
