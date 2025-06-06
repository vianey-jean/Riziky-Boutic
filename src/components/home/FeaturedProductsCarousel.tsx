
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/contexts/StoreContext';
import { getSecureProductId } from '@/services/secureIds';
import { Star, Heart, ShoppingCart } from 'lucide-react';

interface FeaturedProductsCarouselProps {
  products: Product[];
}

const FeaturedProductsCarousel: React.FC<FeaturedProductsCarouselProps> = ({ products }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const PRODUCT_PLACEHOLDER_IMAGE = '/placeholder.svg';

  const getSecureImageUrl = (imagePath: string) => {
    if (!imagePath) return PRODUCT_PLACEHOLDER_IMAGE;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  const getSecureProductUrl = (productId: string) => {
    return `/${getSecureProductId(productId, 'product')}`;
  };

  if (products.length === 0) return null;

  return (
    <motion.div 
      className="mb-16"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
          Nos Produits Vedettes
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto rounded-full"></div>
        <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
          Découvrez notre sélection de produits capillaires premium, choisis pour leur qualité exceptionnelle
        </p>
      </motion.div>

      <Carousel className="relative">
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product, index) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="h-full"
              >
                <Card className="h-full overflow-hidden bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                  <CardContent className="p-0 h-full flex flex-col">
                    <Link to={getSecureProductUrl(product.id)} className="block h-full">
                      <div className="relative overflow-hidden">
                        {/* Badge promotion */}
                        {product.promotion && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                            className="absolute top-3 right-3 z-10 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                          >
                            -{product.promotion}%
                          </motion.div>
                        )}

                        {/* Image du produit */}
                        <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
                          <motion.img
                            src={getSecureImageUrl(product.image)}
                            alt={`${product.name} - Produit capillaire premium`}
                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                            onError={e => {
                              const target = e.target as HTMLImageElement;
                              target.src = PRODUCT_PLACEHOLDER_IMAGE;
                            }}
                            whileHover={{ scale: 1.05 }}
                          />
                          
                          {/* Overlay avec actions */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                          >
                            <div className="flex space-x-2">
                              <motion.button
                                className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Heart className="h-4 w-4 text-red-500" />
                              </motion.button>
                              <motion.button
                                className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <ShoppingCart className="h-4 w-4 text-blue-500" />
                              </motion.button>
                            </div>
                          </motion.div>
                        </div>

                        {/* Informations du produit */}
                        <div className="p-6">
                          <motion.h3 
                            className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-red-600 transition-colors duration-300"
                            whileHover={{ x: 5 }}
                          >
                            {product.name}
                          </motion.h3>
                          
                          {/* Étoiles de notation */}
                          <div className="flex items-center mb-3">
                            {[...Array(5)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                              >
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              </motion.div>
                            ))}
                            <span className="text-sm text-gray-500 ml-2">(4.8)</span>
                          </div>

                          {/* Prix */}
                          <div className="flex items-center gap-3">
                            {product.promotion ? (
                              <motion.div 
                                className="flex items-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                              >
                                <span className="text-lg font-bold text-red-600">
                                  {product.price.toFixed(2)} €
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                  {typeof product.originalPrice === 'number'
                                    ? product.originalPrice.toFixed(2)
                                    : product.price.toFixed(2)} €
                                </span>
                              </motion.div>
                            ) : (
                              <motion.span 
                                className="text-lg font-bold text-gray-900 dark:text-white"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                              >
                                {product.price.toFixed(2)} €
                              </motion.span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation buttons avec style amélioré */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <CarouselPrevious 
            className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
            data-carousel-previous 
          />
          <CarouselNext 
            className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
            data-carousel-next 
          />
        </motion.div>
      </Carousel>
    </motion.div>
  );
};

export default FeaturedProductsCarousel;
