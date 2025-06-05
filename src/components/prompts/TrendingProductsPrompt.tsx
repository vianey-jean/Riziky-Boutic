
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, TrendingUp, ArrowRight, Zap, Sparkles, Package } from 'lucide-react';
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
        className="fixed bottom-4 right-4 z-50 max-w-sm bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        key={currentSection.id}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center text-red-600 dark:text-red-400">
              <IconComponent className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">{currentSection.title}</h3>
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
            {displayedProducts.map(product => (
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
                  <div className="flex items-center space-x-2">
                    {product.promotion && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                        -{product.promotion}%
                      </span>
                    )}
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {product.price.toFixed(2)} €
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-3 text-center">
            <Link 
              to={currentSection.linkPath}
              className="inline-flex items-center text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              {currentSection.linkText}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TrendingProductsPrompt;
