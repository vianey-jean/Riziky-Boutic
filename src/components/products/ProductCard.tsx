import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Clock, Star, Eye, Share2, Zap } from 'lucide-react';
import { Product, useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { getSecureId } from '@/services/secureIds';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { reviewsAPI } from '@/services/api';
import StarRating from '@/components/reviews/StarRating';
import { notificationService } from '@/services/NotificationService';
import QuickViewModal from '@/components/products/QuickViewModal';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface ProductCardProps {
  product: Product;
  size?: 'small' | 'medium' | 'large';
  featured?: boolean;
}

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PLACEHOLDER_IMAGE = '/placeholder.svg';

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  size = 'medium',
  featured = false
}) => {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const { isAuthenticated } = useAuth();
  const isProductFavorite = isFavorite(product.id);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(isProductFavorite);
  
  useEffect(() => {
    const fetchProductReviews = async () => {
      try {
        const response = await reviewsAPI.getProductReviews(product.id);
        const reviews = response.data;
        
        if (reviews && reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => {
            return sum + ((review.productRating + review.deliveryRating) / 2);
          }, 0);
          
          setAverageRating(totalRating / reviews.length);
          setReviewCount(reviews.length);
        }
      } catch (error) {
        console.error("Error fetching reviews for product:", product.id, error);
      }
    };
    
    fetchProductReviews();
  }, [product.id]);
  
  const secureId = getSecureId(product.id, 'product');
  
  const displayImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image ? [product.image] : [];
    
  const getPromotionTimeLeft = (endDate: string) => {
    if (!endDate) return "";
    
    const end = new Date(endDate);
    const now = new Date();
    const diffInMs = end.getTime() - now.getTime();
    
    if (diffInMs <= 0) return "Expirée";
    
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffInDays > 0) {
      return `${diffInDays}j ${diffInHours}h`;
    } else {
      const diffInMins = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffInHours}h ${diffInMins}m`;
    }
  };
  
  const isPromotionActive = product.promotion && 
    product.promotionEnd && 
    new Date(product.promotionEnd) > new Date();

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return PLACEHOLDER_IMAGE;
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    return `${AUTH_BASE_URL}${imagePath}`;
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      notificationService.error("Connexion requise", "Vous devez être connecté pour ajouter un produit au panier");
      return;
    }
    
    if (!product.isSold || (product.stock !== undefined && product.stock <= 0)) {
      notificationService.error("Rupture de stock", "Ce produit n'est plus disponible");
      return;
    }
    
    addToCart(product);
    notificationService.addToCart(product.name);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      notificationService.error("Connexion requise", "Vous devez être connecté pour ajouter aux favoris");
      return;
    }
    
    setIsWishlisted(!isWishlisted);
    toggleFavorite(product);
    
    if (isWishlisted) {
      notificationService.removeFromFavorites(product.name);
    } else {
      notificationService.addToFavorites(product.name);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.origin + `/produit/${secureId}`
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/produit/${secureId}`);
      notificationService.success("Lien copié", "Le lien du produit a été copié dans le presse-papiers");
    }
  };

  useEffect(() => {
    if (isHovered && displayImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setCurrentImageIndex(0);
    }
  }, [isHovered, displayImages.length]);

  const heightClasses = {
    small: 'h-[320px]',
    medium: 'h-[400px]',
    large: 'h-[480px]'
  };

  const discountPercentage = isPromotionActive ? product.promotion : 0;
  const originalPrice = typeof product.originalPrice === 'number' ? product.originalPrice : product.price;
  const savings = isPromotionActive ? (originalPrice - product.price) : 0;

  return (
    <>
      <motion.div 
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative ${featured ? 'z-10' : ''}`}
      >
        <Card className={`overflow-hidden ${heightClasses[size]} flex flex-col border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-black ${featured ? 'ring-2 ring-gradient-to-r from-red-500 to-pink-500 shadow-2xl' : ''}`}>
          {/* Image Container with Enhanced Effects */}
          <div className="relative h-[65%] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-900 overflow-hidden rounded-t-2xl">
            <Link to={`/produit/${secureId}`} className="block h-full">
              <AnimatePresence mode="wait">
                {displayImages.length > 0 ? (
                  <motion.img 
                    key={currentImageIndex}
                    src={getImageUrl(displayImages[currentImageIndex])} 
                    alt={`Photo de ${product.name}`} 
                    className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = PLACEHOLDER_IMAGE;
                    }}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-900">
                    <ShoppingCart className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </AnimatePresence>
            </Link>
            
            {/* Enhanced Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {isPromotionActive && (
                <motion.div
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="relative"
                >
                  <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 text-sm font-bold rounded-full shadow-lg">
                    <Zap className="h-3 w-3 mr-1" />
                    -{product.promotion}%
                  </Badge>
                </motion.div>
              )}
              
              {product.dateAjout && new Date().getTime() - new Date(product.dateAjout).getTime() < 7 * 24 * 60 * 60 * 1000 && (
                <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 text-sm font-bold rounded-full shadow-lg">
                  Nouveau
                </Badge>
              )}
              
              {featured && (
                <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 text-sm font-bold rounded-full shadow-lg animate-pulse">
                  ⭐ Top
                </Badge>
              )}
            </div>

            {/* Timer for promotions */}
            {isPromotionActive && product.promotionEnd && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-3 right-3 bg-black/80 text-white px-3 py-1 rounded-full text-xs flex items-center backdrop-blur-sm"
              >
                <Clock className="h-3 w-3 mr-1 animate-pulse" />
                {getPromotionTimeLeft(product.promotionEnd)}
              </motion.div>
            )}
            
            {/* Enhanced Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 left-4 right-4 flex justify-between items-center gap-2"
            >
              <div className="flex gap-2">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      onClick={handleFavoriteToggle}
                      className="rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-red-500 backdrop-blur-sm shadow-lg transition-all duration-300 transform hover:scale-110"
                    >
                      <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''} transition-all duration-300`} />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-auto p-2">
                    <p className="text-sm">{isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}</p>
                  </HoverCardContent>
                </HoverCard>
                
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleQuickView}
                  className="rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-blue-500 backdrop-blur-sm shadow-lg transition-all duration-300 transform hover:scale-110"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleShare}
                  className="rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-green-500 backdrop-blur-sm shadow-lg transition-all duration-300 transform hover:scale-110"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                onClick={handleQuickAdd}
                disabled={!product.isSold || (product.stock !== undefined && product.stock <= 0)}
                className="rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 px-4"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </motion.div>

            {/* Image indicators */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {displayImages.slice(0, 5).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex ? 'bg-white shadow-lg' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Enhanced Product Info */}
          <CardContent className="p-4 flex flex-col flex-grow bg-white dark:bg-neutral-900">
            <Link to={`/produit/${secureId}`} className="block group">
              <h3 className="font-semibold text-lg mb-2 hover:text-red-600 transition-colors line-clamp-2 text-left group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-pink-500">
                {product.name}
              </h3>
            </Link>
            
            {/* Rating with enhanced styling */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <StarRating rating={averageRating} size={16} />
                <span className="text-sm text-gray-500 ml-2">({reviewCount})</span>
              </div>
              {averageRating > 4.5 && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                  Excellent
                </Badge>
              )}
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2 text-left leading-relaxed">
              {product.description}
            </p>
            
            <div className="flex-grow"></div>
            
            {/* Enhanced Price Section */}
            <div className="space-y-2">
              {isPromotionActive ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500 line-through">
                        {originalPrice.toFixed(2)} €
                      </p>
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        -{discountPercentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xl text-red-600">
                      {product.price.toFixed(2)} €
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      Économisez {savings.toFixed(2)} €
                    </p>
                  </div>
                </div>
              ) : (
                <p className="font-bold text-xl text-gray-900 dark:text-white">
                  {product.price.toFixed(2)} €
                </p>
              )}
              
              {/* Stock Status */}
              {product.stock !== undefined && (
                <div className="mt-2">
                  {product.stock === 0 || !product.isSold ? (
                    <p className="text-red-500 text-sm font-medium">❌ Rupture de stock</p>
                  ) : product.stock <= 5 ? (
                    <p className="text-orange-500 text-sm font-medium">
                      ⚠️ Plus que {product.stock} en stock
                    </p>
                  ) : (
                    <p className="text-green-500 text-sm font-medium">✅ En stock</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};

export default ProductCard;
