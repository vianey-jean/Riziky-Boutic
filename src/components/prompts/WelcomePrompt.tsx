import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, MessageSquareText, Minus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getSecureRoute } from '@/services/secureIds';

interface WelcomePromptProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onClose?: () => void;
  dismissKey?: string;
  delay?: number;
}

const WelcomePrompt: React.FC<WelcomePromptProps> = ({
  title = "Bienvenue sur Riziky Boutic",
  message = "Découvrez notre gamme de produits capillaires de luxe. Pour toute question, notre équipe est disponible pour vous aider via le Chat",
  buttonText = " Vers Service Client, Chat",
  onClose,
  dismissKey = "welcome-prompt-dismissed",
  delay = 3000
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'état minimisé depuis localStorage
    const minimizedState = localStorage.getItem("welcomePromptMinimized");
    if (minimizedState === "true") {
      setIsMinimized(true);
      setIsVisible(true); // visible mais minimisé
    }

    // Ne pas afficher sur la page service-client
    const currentPath = window.location.pathname;
    const isServiceClientPage = currentPath.includes('/service-client');

    if (isAuthenticated) {
      // Si connecté, ne jamais afficher le prompt
      setIsVisible(false);
    } else if (!isServiceClientPage && minimizedState !== "true") {
      // Si pas connecté ET pas sur la page service-client ET pas minimisé
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);

      return () => clearTimeout(timer);
    } else if (isServiceClientPage) {
      // Si pas connecté mais sur la page service-client, ne pas afficher
      setIsVisible(false);
    }
  }, [delay, isAuthenticated]);

  const handleClose = () => {
    setIsVisible(false);

    // Rediriger vers la page service client sécurisée
    const secureServiceRoute = getSecureRoute('/service-client');
    if (secureServiceRoute) {
      navigate(secureServiceRoute);
    }

    if (onClose) onClose();
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    localStorage.setItem("welcomePromptMinimized", "true");
  };

  const handleReopen = () => {
    setIsMinimized(false);
    localStorage.setItem("welcomePromptMinimized", "false");
    setIsVisible(true);
  };

  return (
    <AnimatePresence>
      {isVisible && !isMinimized && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-40 max-w-sm bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800 p-4"
        >
          {/* Boutons de fermeture et minimisation */}
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={handleMinimize}
              className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={handleClose}
              className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-start mb-3">
            <div className="flex-shrink-0 mr-3 mt-1">
              <MessageSquareText className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">{title}</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">{message}</p>
            </div>
          </div>

          <Button
            onClick={handleClose}
            className="w-full bg-green-100 text-neutral-900 font-bold hover:bg-green-200 dark:bg-green-800 dark:text-neutral-100 dark:hover:bg-green-700"
          >
            {buttonText}
          </Button>
        </motion.div>
      )}

      {/* Version minimisée (petit bouton flottant) */}
      {isVisible && isMinimized && (
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          onClick={handleReopen}
          className="fixed bottom-4 right-4 z-40 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700"
        >
          <MessageSquareText className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default WelcomePrompt;
