
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/contexts/StoreContext';
import ProductCard from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || products.length <= effectiveSlidesToShow) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const maxIndex = Math.max(0, products.length - effectiveSlidesToShow);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, products.length]);

  const effectiveSlidesToShow = isMobile ? 1 : Math.min(slidesToShow, 4);
  const maxIndex = Math.max(0, products.length - effectiveSlidesToShow);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => Math.max(prev - 1, 0));
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="my-16 py-12 px-4 bg-gradient-to-br from-white via-red-50/20 to-pink-50/20 dark:from-neutral-900 dark:via-red-950/10 dark:to-pink-950/10 rounded-3xl shadow-2xl border border-red-100/20 dark:border-red-900/20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-red-200/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full blur-lg"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 text-center md:text-left"
        >
          <div className="mb-6 md:mb-0">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-full">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                {title}
              </h2>
              <TrendingUp className="h-6 w-6 text-red-500 animate-bounce" />
            </div>
            {description && (
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
          
          {seeAllLink && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                asChild 
                variant="outline" 
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-8 py-3"
              >
                <a href={seeAllLink}>
                  Voir tout
                  <ChevronRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Slider */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl" ref={sliderRef}>
            <motion.div 
              className="flex gap-6"
              animate={{ 
                x: `calc(-${currentIndex * (100 / effectiveSlidesToShow)}% - ${currentIndex * 1.5}rem)` 
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.6 
              }}
              style={{ width: `calc(${products.length * (100 / effectiveSlidesToShow)}% + ${(products.length - 1) * 1.5}rem)` }}
            >
              {products.map((product, index) => (
                <motion.div 
                  key={product.id} 
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / products.length}% - 1.5rem)` }}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard 
                    product={product} 
                    featured={index < 2} // First 2 products are featured
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Enhanced Navigation Buttons */}
          <AnimatePresence>
            {currentIndex > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 z-20"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 bg-white/90 hover:bg-white dark:bg-black/90 dark:hover:bg-black rounded-full shadow-2xl border-2 border-red-200 hover:border-red-300 transition-all duration-300 hover:scale-110"
                  onClick={handlePrev}
                  aria-label="Produits précédents"
                >
                  <ChevronLeft className="h-6 w-6 text-red-600" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {currentIndex < maxIndex && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 z-20"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 bg-white/90 hover:bg-white dark:bg-black/90 dark:hover:bg-black rounded-full shadow-2xl border-2 border-red-200 hover:border-red-300 transition-all duration-300 hover:scale-110"
                  onClick={handleNext}
                  aria-label="Produits suivants"
                >
                  <ChevronRight className="h-6 w-6 text-red-600" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Pagination Indicators */}
        {maxIndex > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mt-8 gap-3"
          >
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`relative overflow-hidden transition-all duration-300 ${
                  currentIndex === i 
                    ? 'w-8 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full' 
                    : 'w-3 h-3 bg-gray-300 dark:bg-gray-700 rounded-full hover:bg-red-300 dark:hover:bg-red-700'
                }`}
                onClick={() => goToSlide(i)}
                aria-label={`Aller à la page ${i + 1}`}
              >
                {currentIndex === i && (
                  <motion.div
                    className="absolute inset-0 bg-white/30 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Auto-play indicator */}
        <div className="flex justify-center mt-4">
          <motion.div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs transition-all duration-300 ${
              isAutoPlaying 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isAutoPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`} />
            {isAutoPlaying ? 'Lecture automatique' : 'Lecture en pause'}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSlider;
