import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/contexts/StoreContext';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';
import { getSecureCategoryId } from '@/services/secureCategories';

interface FeaturedProductsSliderProps {
  products: Product[];
  title: string;
  description?: string;
  seeAllLink?: string;
  slidesToShow?: number;
}

const FeaturedProductsSlider: React.FC<FeaturedProductsSliderProps> = ({ 
  products, 
  title, 
  description, 
  seeAllLink = '', 
  slidesToShow = 4 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Adapter le nombre de slides à afficher en fonction de la taille de l'écran
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calcul du nombre de slides effectif selon la taille d'écran
  const effectiveSlidesToShow = isMobile ? 1 : Math.min(slidesToShow, 4);
  const maxIndex = Math.max(0, products.length - effectiveSlidesToShow);

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  // Extraire le nom de la catégorie depuis seeAllLink pour générer l'ID sécurisé
  const getCategoryFromLink = (link: string): string => {
    if (!link) return '';
    // Extraire le nom de la catégorie depuis le lien (ex: "/categorie/Perruques" -> "Perruques")
    const parts = link.split('/');
    return parts[parts.length - 1] || '';
  };

  const categoryName = getCategoryFromLink(seeAllLink);
  const secureCategoryLink = categoryName ? `/categorie/${getSecureCategoryId(categoryName)}` : '';

  return (
    <div className="my-12 py-8 px-4 bg-gradient-to-r from-white via-gray-50 to-white dark:from-neutral-900 dark:via-black dark:to-neutral-900 rounded-xl shadow-sm">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
            {description && <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>}
          </div>
          
          {seeAllLink && secureCategoryLink && (
            <Button asChild variant="outline" className="self-end md:self-auto">
              <Link to={secureCategoryLink}>Voir tout</Link>
            </Button>
          )}
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={sliderRef}>
            <motion.div 
              className="flex"
              animate={{ x: `calc(-${currentIndex * 100}% / ${effectiveSlidesToShow})` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ width: `calc(${products.length * 100}% / ${effectiveSlidesToShow})` }}
            >
              {products.map(product => (
                <div 
                  key={product.id} 
                  className="px-2" 
                  style={{ width: `calc(100% / ${products.length})` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </motion.div>
          </div>

          {currentIndex > 0 && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white dark:bg-black rounded-full shadow-lg z-10"
              onClick={handlePrev}
              aria-label="Produits précédents"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}

          {currentIndex < maxIndex && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white dark:bg-black rounded-full shadow-lg z-10"
              onClick={handleNext}
              aria-label="Produits suivants"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Indicateurs de pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              className={`w-2 h-2 rounded-full ${currentIndex === i ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-700'}`}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Aller à la page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductsSlider;
