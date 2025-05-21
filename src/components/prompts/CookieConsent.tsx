
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);
  
  // Vérifier si l'utilisateur a déjà donné son consentement
  useEffect(() => {
    const consentGiven = localStorage.getItem('cookie-consent');
    if (!consentGiven) {
      // Afficher la bannière après un petit délai pour éviter de l'afficher immédiatement au chargement
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'all');
    setShowConsent(false);
  };
  
  const acceptEssential = () => {
    localStorage.setItem('cookie-consent', 'essential');
    setShowConsent(false);
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
                    onClick={acceptEssential}
                  >
                    Accepter uniquement les cookies essentiels
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
