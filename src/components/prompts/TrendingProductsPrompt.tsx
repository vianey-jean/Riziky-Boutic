
import React, { useState } from 'react';
import { X, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/contexts/StoreContext';

interface TrendingProductsPromptProps {
  products: Product[];
  title?: string;
  dismissKey?: string;
}

const TrendingProductsPrompt: React.FC<TrendingProductsPromptProps> = ({ 
  products, 
  title = "Produits populaires",
  dismissKey = "trending-products-dismissed"
}) => {
  // Vérifier si l'utilisateur a déjà fermé ce prompt
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem(dismissKey) === 'true';
  });

  const handleDismiss = () => {
    localStorage.setItem(dismissKey, 'true');
    setIsDismissed(true);
  };

  // Si aucun produit ou si déjà fermé, ne rien afficher
  if (products.length === 0 || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed bottom-4 right-4 z-50 max-w-sm bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center text-red-600 dark:text-red-400">
              <TrendingUp className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">{title}</h3>
            </div>
            <button 
              onClick={handleDismiss}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {products.slice(0, 3).map(product => (
              <Link 
                key={product.id}
                to={`/produit/${product.id}`}
                className="flex items-center p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <img 
                  src={`${import.meta.env.VITE_API_BASE_URL}${product.image || (product.images && product.images[0])}`} 
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                <div className="ml-3 text-left">
                  <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{product.price.toFixed(2)} €</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-3 text-center">
            <Link 
              to="/categorie/perruques"
              className="inline-flex items-center text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Voir plus de produits
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TrendingProductsPrompt;
