
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, MessageSquareText } from 'lucide-react';

interface WelcomePromptProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onClose?: () => void;
  dismissKey?: string;
  delay?: number;
}

const WelcomePrompt: React.FC<WelcomePromptProps> = ({
  title = "Bienvenue sur Riziky Boutique",
  message = "Découvrez notre gamme de produits capillaires de luxe. Pour toute question, notre équipe est disponible pour vous aider.",
  buttonText = "D'accord, merci",
  onClose,
  dismissKey = "welcome-prompt-dismissed",
  delay = 3000
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Vérifier si le message a déjà été fermé
    const isDismissed = localStorage.getItem(dismissKey) === 'true';
    
    if (!isDismissed) {
      // Afficher après un délai
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [delay, dismissKey]);
  
  const handleClose = () => {
    localStorage.setItem(dismissKey, 'true');
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-40 max-w-sm bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800 p-4"
        >
          <button 
            onClick={handleClose} 
            className="absolute top-2 right-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            <X className="h-4 w-4" />
          </button>
          
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
            className="w-full bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
          >
            {buttonText}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomePrompt;
