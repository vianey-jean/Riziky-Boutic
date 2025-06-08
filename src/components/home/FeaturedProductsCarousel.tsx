
import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/contexts/StoreContext';
import { getSecureProductId } from '@/services/secureIds';
import { Star, Heart, ShoppingCart, Sparkles } from 'lucide-react';

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

  const calculatePromotionTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const timeDifference = end.getTime() - now.getTime();
    if (timeDifference <= 0) return "Expirée";
    
    const hoursRemaining = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hoursRemaining}h ${minutesRemaining}m`;
  };

  if (products.length === 0) return null;

  return (
    <div className="mb-16 relative">
      {/* Section header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Sparkles className="h-8 w-8 text-yellow-500" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Nos Produits Vedettes
          </h2>
          <Sparkles className="h-8 w-8 text-yellow-500" />
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Découvrez notre sélection exceptionnelle de produits capillaires premium
        </p>
        <div className="mt-4 w-32 h-1 bg-gradient-to-r from-red-500 to-purple-600 mx-auto rounded-full"></div>
      </div>

      {/* Carousel container with enhanced styling */}
      <div className="relative bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-neutral-900 dark:to-neutral-800 rounded-3xl p-8 shadow-2xl border border-red-100 dark:border-neutral-700">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-pink-500/5 to-purple-500/5 rounded-3xl"></div>
        
        <Carousel className="relative z-10">
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map(product => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
                <div className="p-1">
                  <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-white to-gray-50 dark:from-neutral-800 dark:to-neutral-900">
                    <div className="relative">
                      <Link to={getSecureProductUrl(product.id)} className="block">
                        <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-700 dark:to-neutral-800">
                          <img
                            src={getSecureImageUrl(product.image)}
                            alt={`${product.name} - Produit capillaire premium`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={e => {
                              const target = e.target as HTMLImageElement;
                              target.src = PRODUCT_PLACEHOLDER_IMAGE;
                            }}
                          />
                        </div>
                      </Link>
                      
                      {/* Overlay badges */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                        {product.promotion && (
                          <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white border-0 shadow-lg">
                            -{product.promotion}%
                          </Badge>
                        )}
                        <div className="flex space-x-2">
                          <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer">
                            <Heart className="h-4 w-4 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors" />
                          </div>
                          <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer">
                            <ShoppingCart className="h-4 w-4 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors" />
                          </div>
                        </div>
                      </div>

                      {/* Timer badge for promotions */}
                      {product.promotion && product.promotionEnd && (
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {calculatePromotionTimeRemaining(product.promotionEnd)}
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <Link to={getSecureProductUrl(product.id)} className="block">
                        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      
                      {/* Rating placeholder */}
                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">(4.8)</span>
                      </div>

                      {/* Price section */}
                      <div className="space-y-2">
                        {product.promotion ? (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-3">
                              <span className="text-lg font-bold text-red-600">
                                {product.price.toFixed(2)} €
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                {typeof product.originalPrice === 'number'
                                  ? product.originalPrice.toFixed(2)
                                  : product.price.toFixed(2)} €
                              </span>
                            </div>
                            <div className="text-xs text-green-600 font-medium">
                              Économisez {((typeof product.originalPrice === 'number' ? product.originalPrice : product.price) - product.price).toFixed(2)} €
                            </div>
                          </div>
                        ) : (
                          <div className="text-xl font-bold text-gray-800 dark:text-white">
                            {product.price.toFixed(2)} €
                          </div>
                        )}
                      </div>

                      {/* Quick add button */}
                      <button className="w-full mt-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center space-x-2">
                        <ShoppingCart className="h-4 w-4" />
                        <span>Ajouter au panier</span>
                      </button>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious className="left-4 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-300" />
          <CarouselNext className="right-4 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-300" />
        </Carousel>
      </div>
    </div>
  );
};

export default FeaturedProductsCarousel;
