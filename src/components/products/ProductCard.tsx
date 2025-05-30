import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Clock, Star, Eye } from 'lucide-react';
import { Product, useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { getSecureId } from '@/services/secureIds';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { reviewsAPI } from '@/services/api';
import StarRating from '@/components/reviews/StarRating';
import { toast } from '@/components/ui/sonner';
import QuickViewModal from '@/components/products/QuickViewModal';

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
  
  useEffect(() => {
    const fetchProductReviews = async () => {
      try {
        const response = await reviewsAPI.getProductReviews(product.id);
        const reviews = response.data;
        
        if (reviews && reviews.length > 0) {
          // Calculate average rating from product and delivery ratings
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
      toast.error("Vous devez être connecté pour ajouter un produit au panier", {
        style: { backgroundColor: '#EF4444', color: 'white', fontWeight: 'bold' },
        duration: 4000,
        position: 'top-center',
      });
      return;
    }
    
    if (!product.isSold || (product.stock !== undefined && product.stock <= 0)) {
      toast.error("Ce produit est en rupture de stock");
      return;
    }
    
    addToCart(product);
    toast.success("Produit ajouté au panier");
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  useEffect(() => {
    if (isHovered && displayImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isHovered, displayImages.length]);

  const heightClasses = {
    small: 'h-[300px]',
    medium: 'h-[380px]',
    large: 'h-[450px]'
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImageIndex(0);
        }}
        className={featured ? 'z-10 scale-105' : ''}
      >
        <Card className={`overflow-hidden ${heightClasses[size]} flex flex-col border border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 rounded-xl hover:shadow-lg transition-all duration-300 ${featured ? 'shadow-md ring-1 ring-red-200 dark:ring-red-900' : ''}`}>
          <div className="relative h-[60%] bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
            <Link to={`/${secureId}`} className="block h-full">
              {displayImages.length > 0 ? (
                <motion.img 
                  src={getImageUrl(displayImages[currentImageIndex])} 
                  alt={`Photo de ${product.name}`} 
                  className="w-full h-full object-contain transition-opacity duration-300"
                  loading="lazy"
                  onError={(e) => {
                    console.log("Erreur de chargement d'image, utilisation du placeholder");
                    const target = e.target as HTMLImageElement;
                    target.src = PLACEHOLDER_IMAGE;
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={currentImageIndex}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
                  <ShoppingCart className="h-12 w-12 text-neutral-400" />
                </div>
              )}
            </Link>
            
            {isPromotionActive && (
              <div className="absolute top-0 left-0 right-0 flex items-center justify-between">
                <Badge className="m-2 bg-red-600 text-white px-2 py-1 text-xs font-bold">
                  -{product.promotion}%
                </Badge>
                {product.promotionEnd && (
                  <div className="m-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> {getPromotionTimeLeft(product.promotionEnd)}
                  </div>
                )}
              </div>
            )}
            
            {product.dateAjout && new Date().getTime() - new Date(product.dateAjout).getTime() < 7 * 24 * 60 * 60 * 1000 && (
              <Badge className="absolute top-2 left-2 bg-blue-600 text-white">Nouveau</Badge>
            )}
            
            {featured && (
              <Badge className="absolute top-2 right-2 bg-amber-500 text-white">Recommandé</Badge>
            )}
            
            <div className={`absolute bottom-0 left-0 right-0 p-2 flex justify-between bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleFavoriteToggle}
                className="rounded-full bg-white/90 hover:bg-white text-neutral-700 hover:text-red-600 backdrop-blur-sm"
                title={isProductFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Heart className={`h-4 w-4 ${isProductFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleQuickView}
                className="rounded-full bg-white/90 hover:bg-white text-neutral-700 hover:text-blue-600 backdrop-blur-sm"
                title="Vue rapide"
              >
                <Eye className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleQuickAdd}
                disabled={!product.isSold || (product.stock !== undefined && product.stock <= 0)}
                className="rounded-full bg-white/90 hover:bg-white text-neutral-700 hover:text-green-600 backdrop-blur-sm"
                title="Ajouter au panier"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <CardContent className="p-4 flex flex-col flex-grow">
            <Link to={`/${secureId}`} className="block">
              <h3 className="font-medium text-lg mb-1 hover:text-red-600 transition-colors line-clamp-2 text-left">{product.name}</h3>
            </Link>
            
            <div className="flex items-center mt-1 mb-2">
              <StarRating rating={averageRating} size={14} />
              <span className="text-xs text-neutral-500 ml-1">({reviewCount})</span>
            </div>
            
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-3 line-clamp-2 text-left">{product.description}</p>
            <div className="flex-grow"></div>
            
            <div className="flex justify-between items-end mt-2 text-left">
              <div>
                {isPromotionActive ? (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500 line-through">
                        {typeof product.originalPrice === 'number'
                          ? product.originalPrice.toFixed(2)
                          : product.price.toFixed(2)}{' '}
                        €
                      </p>
                      <p className="font-bold text-red-600">{product.price.toFixed(2)} €</p>
                    </div>
                  </div>
                ) : (
                  <p className="font-bold">{product.price.toFixed(2)} €</p>
                )}
                
                {product.stock !== undefined && (
                  <div className="mt-1">
                    {product.stock === 0 || !product.isSold ? (
                      <p className="text-red-500 text-xs">En rupture de stock</p>
                    ) : product.stock <= 5 ? (
                      <p className="text-orange-500 text-xs">Plus que {product.stock} en stock</p>
                    ) : (
                      <p className="text-orange-500 text-xs">Plus que {product.stock} en stock</p>
                    )}
                  </div>
                )}
              </div>
              
              <Button
                size="sm"
                variant="outline"
                className="h-8 bg-red-50 text-red-700 hover:bg-red-100 border-red-200 hover:border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 dark:border-red-900/50"
                onClick={handleQuickAdd}
                disabled={!product.isSold || (product.stock !== undefined && product.stock <= 0)}
              >
                <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                <span>Ajouter</span>
              </Button>
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
