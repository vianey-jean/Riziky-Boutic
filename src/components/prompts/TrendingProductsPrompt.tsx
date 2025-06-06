import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, TrendingUp, ArrowRight, Zap, Sparkles, Package, Star, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/contexts/StoreContext';

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
    linkPath: '/populaires'
  });

  const sections: SectionInfo[] = [
    {
      id: 'featured',
      title: 'Produits populaires',
      icon: TrendingUp,
      linkText: 'Voir plus de produits populaires',
      linkPath: '/populaires'
    },
    {
      id: 'promotional',
      title: 'Offres promotionnelles',
      icon: Zap,
      linkText: 'Voir toutes les promotions',
      linkPath: '/promotions'
    },
    {
      id: 'new-arrivals',
      title: 'Dernières nouveautés',
      icon: Sparkles,
      linkText: 'Voir toutes les nouveautés',
      linkPath: '/nouveautes'
    },
    {
      id: 'complete-catalog',
      title: 'Tous les produits',
      icon: Package,
      linkText: 'Voir tous les produits',
      linkPath: '/tous-les-produits'
    }
  ];

  useEffect(() => {
    const detectVisibleSection = () => {
      // Chercher les sections par leur contenu textuel ou data attributes
      const heroSection = document.querySelector('[class*="hero"]') || document.querySelector('h1');
      const featuredSection = document.querySelector('h2[class*="text-gradient"]') || 
                             Array.from(document.querySelectorAll('h2')).find(h => h.textContent?.includes('populaires') || h.textContent?.includes('Vedettes'));
      const promotionalSection = Array.from(document.querySelectorAll('h2')).find(h => 
        h.textContent?.includes('Offres') || h.textContent?.includes('Promotions') || h.textContent?.includes('Exceptionnelles')
      );
      const newArrivalsSection = Array.from(document.querySelectorAll('h2')).find(h => 
        h.textContent?.includes('Nouveautés') || h.textContent?.includes('Dernières')
      );
      const completeCatalogSection = Array.from(document.querySelectorAll('h2')).find(h => 
        h.textContent?.includes('Catalogue') || h.textContent?.includes('Complet') || h.textContent?.includes('tous')
      );

      const isInViewport = (element: Element | null) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementMiddle = rect.top + rect.height / 2;
        const threshold = windowHeight * 0.4; // 40% du viewport
        return elementMiddle >= 0 && elementMiddle <= windowHeight && rect.top <= threshold;
      };

      // Vérifier les sections dans l'ordre de priorité
      if (isInViewport(completeCatalogSection)) {
        setCurrentSection(sections[3]); // Tous les produits
      } else if (isInViewport(newArrivalsSection)) {
        setCurrentSection(sections[2]); // Nouveautés
      } else if (isInViewport(promotionalSection)) {
        setCurrentSection(sections[1]); // Promotions
      } else if (isInViewport(featuredSection)) {
        setCurrentSection(sections[0]); // Populaires
      }
      // Si on est en haut de page (hero), on garde les produits populaires par défaut
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

  // Filtrer les produits selon la section courante
  const getFilteredProducts = () => {
    switch (currentSection.id) {
      case 'promotional':
        const promotionalProducts = products.filter(product => 
          product.promotion && 
          product.promotionEnd && 
          new Date(product.promotionEnd) > new Date()
        );
        return promotionalProducts.length > 0 ? promotionalProducts.slice(0, 3) : products.slice(0, 3);
      
      case 'new-arrivals':
        const sortedByDate = [...products].sort((a, b) =>
          new Date(b.dateAjout || 0).getTime() - new Date(a.dateAjout || 0).getTime()
        );
        return sortedByDate.slice(0, 3);
      
      case 'complete-catalog':
        return products.slice(0, 3);
      
      default: // featured/popular
        return products.slice(0, 3);
    }
  };

  const displayedProducts = getFilteredProducts();

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="fixed bottom-4 right-4 z-50 max-w-sm"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
        key={currentSection.id}
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-lg">
          {/* En-tête avec gradient selon la section */}
          <div className={`p-4 ${
            currentSection.id === 'featured' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
            currentSection.id === 'promotional' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
            currentSection.id === 'new-arrivals' ? 'bg-gradient-to-r from-purple-500 to-blue-500' :
            'bg-gradient-to-r from-gray-500 to-gray-600'
          }`}>
            <div className="flex justify-between items-center">
              <motion.div 
                className="flex items-center text-white"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="bg-white/20 p-2 rounded-full mr-3">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{currentSection.title}</h3>
                  <div className="flex items-center space-x-1 text-xs opacity-90">
                    <Star className="h-3 w-3" />
                    <span>Tendances actuelles</span>
                  </div>
                </div>
              </motion.div>
              <motion.button 
                onClick={handleDismiss}
                className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                aria-label="Fermer"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="space-y-3">
              {displayedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    to={`/produit/${product.id}`}
                    className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 group border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                  >
                    <div className="relative">
                      <motion.img 
                        src={`${import.meta.env.VITE_API_BASE_URL}${product.image || (product.images && product.images[0])}`} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg shadow-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      />
                      {currentSection.id === 'promotional' && product.promotion && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full font-bold">
                          <Flame className="h-2 w-2" />
                        </div>
                      )}
                      {currentSection.id === 'new-arrivals' && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded-full">
                          <Sparkles className="h-2 w-2" />
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-semibold line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {product.name}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {product.promotion && (
                          <motion.span 
                            className="text-xs bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full font-medium"
                            whileHover={{ scale: 1.05 }}
                          >
                            -{product.promotion}%
                          </motion.span>
                        )}
                        <div className="flex items-center space-x-1">
                          <p className="text-sm font-bold text-red-600 dark:text-red-400">
                            {product.price.toFixed(2)} €
                          </p>
                          {product.promotion && (
                            <p className="text-xs text-gray-500 line-through">
                              {(product.price / (1 - product.promotion / 100)).toFixed(2)} €
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ x: 5 }}
                    >
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link 
                to={currentSection.linkPath}
                className="group flex items-center justify-center text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 py-2 px-4 rounded-xl"
              >
                <span>{currentSection.linkText}</span>
                <motion.div
                  className="ml-2"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TrendingProductsPrompt;
