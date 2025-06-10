
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { getSecureId } from '@/services/secureIds';
import { Clock, Zap, Star, Heart, ShoppingCart, Flame } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface PromotionalProductsGridProps {
  products: Product[];
}

const PromotionalProductsGrid: React.FC<PromotionalProductsGridProps> = ({ products }) => {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const { isAuthenticated } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const PRODUCT_PLACEHOLDER_IMAGE = '/placeholder.svg';

  const getSecureImageUrl = (imagePath: string) => {
    if (!imagePath) return PRODUCT_PLACEHOLDER_IMAGE;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  const getSecureProductUrl = (productId: string) => {
    return `/produit/${getSecureId(productId, 'product')}`;
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

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour ajouter un produit au panier");
      return;
    }
    
    addToCart(product);
    toast.success("Produit ajouté au panier");
  };

  const handleToggleFavorite = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour ajouter aux favoris");
      return;
    }
    
    toggleFavorite(product);
    const isCurrentlyFavorite = isFavorite(product.id);
    toast.success(isCurrentlyFavorite ? "Retiré des favoris" : "Ajouté aux favoris");
  };

  if (products.length === 0) return null;

  return (
    <div className="mb-16">
      {/* Section header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Flame className="h-8 w-8 text-red-500 animate-pulse" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Offres Promotionnelles
          </h2>
          <Flame className="h-8 w-8 text-red-500 animate-pulse" />
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Profitez de nos offres exceptionnelles à durée limitée
        </p>
        <div className="mt-4 w-32 h-1 bg-gradient-to-r from-red-500 to-yellow-500 mx-auto rounded-full"></div>
      </div>

      {/* Grid container */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/10 dark:via-orange-900/10 dark:to-yellow-900/10 rounded-3xl"></div>
        
        <div className="relative z-10 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => {
              const timeRemaining = product.promotionEnd ? calculatePromotionTimeRemaining(product.promotionEnd) : null;
              const isUrgent = timeRemaining && timeRemaining !== "Expirée" && 
                               (timeRemaining.includes('h') && parseInt(timeRemaining) < 24);

              return (
                <Card key={product.id} className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-white to-red-50 dark:from-neutral-800 dark:to-red-900/20 relative">
                  {/* Promotional badge */}
                  <div className="absolute top-0 left-0 right-0 z-20">
                    <div className="flex justify-between items-start p-4">
                      <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0 shadow-lg animate-pulse">
                        <Zap className="h-3 w-3 mr-1" />
                        -{product.promotion}%
                      </Badge>
                      {isUrgent && (
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg animate-bounce">
                          <Clock className="h-3 w-3 mr-1" />
                          URGENT
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="relative overflow-hidden">
                    <Link to={getSecureProductUrl(product.id)}>
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-700 dark:to-neutral-800 relative">
                        <img
                          src={getSecureImageUrl(product.image)}
                          alt={`${product.name} en promotion`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={e => {
                            const target = e.target as HTMLImageElement;
                            target.src = PRODUCT_PLACEHOLDER_IMAGE;
                          }}
                        />
                        
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Action buttons overlay */}
                        <div className="absolute inset-0 flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <button 
                            className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
                            onClick={(e) => handleToggleFavorite(e, product)}
                          >
                            <Heart className={`h-5 w-5 ${isFavorite(product.id) ? 'text-red-500 fill-red-500' : 'text-red-500'}`} />
                          </button>
                          <button 
                            className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
                            onClick={(e) => handleAddToCart(e, product)}
                          >
                            <ShoppingCart className="h-5 w-5 text-blue-500" />
                          </button>
                        </div>
                      </div>
                    </Link>

                    {/* Timer countdown */}
                    {product.promotionEnd && timeRemaining && timeRemaining !== "Expirée" && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-center">
                          <div className="text-xs font-medium opacity-90">Se termine dans</div>
                          <div className="text-sm font-bold flex items-center justify-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {timeRemaining}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6 relative">
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 group-hover:from-red-500/10 group-hover:to-orange-500/10 transition-all duration-300"></div>
                    
                    <div className="relative z-10">
                      <Link to={getSecureProductUrl(product.id)}>
                        <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      
                      {/* Rating */}
                      <div className="flex items-center space-x-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">(4.9)</span>
                      </div>

                      {/* Price section */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-bold text-red-600">
                            {product.price.toFixed(2)} €
                          </span>
                          <span className="text-lg text-gray-500 line-through">
                            {typeof product.originalPrice === 'number'
                              ? product.originalPrice.toFixed(2)
                              : product.price.toFixed(2)} €
                          </span>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 px-3 py-2 rounded-lg">
                          <div className="text-sm font-medium text-green-700 dark:text-green-400">
                            💰 Vous économisez {((typeof product.originalPrice === 'number' ? product.originalPrice : product.price) - product.price).toFixed(2)} €
                          </div>
                        </div>
                      </div>

                      {/* Add to cart button */}
                      <button 
                        className="w-full mt-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span>Profiter de l'offre</span>
                      </button>
                    </div>
                  </CardContent>

                  {/* Decorative corner */}
                  <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalProductsGrid;
