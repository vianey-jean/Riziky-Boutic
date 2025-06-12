import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, TrendingUp, ArrowRight, Zap, Sparkles, Package, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/contexts/StoreContext';
import { getSecureId } from '@/services/secureIds';

interface TrendingProductsPromptProps {
  products: Product[];
  title?: string;
  dismissKey?: string;
}

interface SectionInfo {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  linkText: string;
  linkPath: string;
  gradient: string;
}

const TrendingProductsPrompt: React.FC<TrendingProductsPromptProps> = ({ 
  products, 
  dismissKey = "trending-products-dismissed"
}) => {
  const location = useLocation();
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem(dismissKey) === 'true';
  });

  const [currentSection, setCurrentSection] = useState<SectionInfo>({
    id: 'featured',
    title: 'Produits populaires',
    icon: TrendingUp,
    linkText: 'Voir plus de produits',
    linkPath: '/populaires',
    gradient: 'from-red-500 to-pink-500'
  });

  const sections: SectionInfo[] = [
    {
      id: 'promotional',
      title: 'Offres promotionnelles',
      icon: Zap,
      linkText: 'Voir toutes les promotions',
      linkPath: '/promotions',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'new-arrivals',
      title: 'Dernières nouveautés',
      icon: Sparkles,
      linkText: 'Voir toutes les nouveautés',
      linkPath: '/nouveautes',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'complete-catalog',
      title: 'Tous les produits',
      icon: Package,
      linkText: 'Voir tous les produits',
      linkPath: '/tous-les-produits',
      gradient: 'from-blue-500 to-cyan-500'
    }
  ];

  useEffect(() => {
    const detectVisibleSection = () => {
      const promotionalSection = document.querySelector('[data-section="promotional"]');
      const newArrivalsSection = document.querySelector('[data-section="new-arrivals"]');
      const completeCatalogSection = document.querySelector('[data-section="complete-catalog"]');

      const isInViewport = (element: Element | null) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementMiddle = rect.top + rect.height / 2;
        return elementMiddle >= 0 && elementMiddle <= windowHeight;
      };

      if (isInViewport(promotionalSection)) {
        setCurrentSection(sections[0]);
      } else if (isInViewport(newArrivalsSection)) {
        setCurrentSection(sections[1]);
      } else if (isInViewport(completeCatalogSection)) {
        setCurrentSection(sections[2]);
      }
    };

    detectVisibleSection();

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          detectVisibleSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', detectVisibleSection, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', detectVisibleSection);
    };
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(dismissKey, 'true');
    setIsDismissed(true);
  };

  // N'afficher que sur la page d'accueil
  if (location.pathname !== '/' || products.length === 0 || isDismissed) {
    return null;
  }

  const IconComponent = currentSection.icon;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed bottom-4 right-4 z-50 max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ duration: 0.4, type: "spring", damping: 25 }}
        key={currentSection.id}
      >
        {/* En-tête avec gradient */}
        <div className={`bg-gradient-to-r ${currentSection.gradient} p-4`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-white">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                <IconComponent className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg">{currentSection.title}</h3>
            </div>
            <motion.button 
              onClick={handleDismiss}
              className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/20"
              aria-label="Fermer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
        
        {/* Contenu des produits */}
        <div className="p-4">
          <div className="space-y-3">
            {products.slice(0, 3).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={`/produit/${getSecureId(product.id)}`}
                  className="flex items-center p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl transition-all duration-300 hover:shadow-md group"
                >
                  <div className="relative">
                    <img 
                      src={`${import.meta.env.VITE_API_BASE_URL}${product.image || (product.images && product.images[0])}`} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    {product.promotion && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold">%</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 text-left">
                    <p className="text-sm font-semibold line-clamp-1 group-hover:text-red-600 transition-colors">
                      {product.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {product.promotion && (
                        <span className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 rounded-full font-medium">
                          -{product.promotion}%
                        </span>
                      )}
                      <div className="flex items-center">
                        <span className="text-sm font-bold text-red-600">
                          {product.price.toFixed(2)} €
                        </span>
                        {/* Étoiles pour les produits populaires */}
                        <div className="flex ml-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ x: 3 }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* Lien vers plus de produits */}
          <motion.div 
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link 
              to={currentSection.linkPath}
              className={`inline-flex items-center text-sm bg-gradient-to-r ${currentSection.gradient} text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium`}
            >
              <Heart className="h-4 w-4 mr-2" />
              {currentSection.linkText}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TrendingProductsPrompt;
