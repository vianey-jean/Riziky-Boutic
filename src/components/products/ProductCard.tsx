
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Star, Clock } from 'lucide-react';
import { Product, useStore } from '@/contexts/StoreContext';
import { getSecureId } from '@/services/secureIds';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { reviewsAPI } from '@/services/api';
import StarRating from '@/components/reviews/StarRating';

interface ProductCardProps {
  product: Product;
}

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PLACEHOLDER_IMAGE = '/placeholder.svg';

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const isProductFavorite = isFavorite(product.id);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  
  // Fetch reviews to calculate ratings
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
  
  // Générer un ID sécurisé pour le produit (sera persistant grâce aux améliorations)
  const secureId = getSecureId(product.id, 'product');
  
  // Determine which image to display - first image from images array or fallback to image property
  const displayImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : product.image;
    
  // Calculate time left for promotion
  const getPromotionTimeLeft = (endDate: string) => {
    if (!endDate) return "";
    
    const end = new Date(endDate);
    const now = new Date();
    const diffInMs = end.getTime() - now.getTime();
    
    if (diffInMs <= 0) return "Expirée";
    
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMins = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffInHours}h ${diffInMins}m`;
  };
  
  const isPromotionActive = product.promotion && 
    product.promotionEnd && 
    new Date(product.promotionEnd) > new Date();

  // Fonction pour construire l'URL de l'image de manière sécurisée
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return PLACEHOLDER_IMAGE;
    
    // Si l'image commence déjà par http, c'est une URL complète
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Sinon, on ajoute le BASE_URL
    return `${AUTH_BASE_URL}${imagePath}`;
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden h-full flex flex-col border border-gray-200 hover:border-red-200 hover:shadow-md transition-all">
        <div className="relative">
          <Link to={`/${secureId}`} className="overflow-hidden block">
            <img 
              src={getImageUrl(displayImage)} 
              alt={`Photo de ${product.name}`} 
              className="h-52 w-full object-contain transition-transform hover:scale-105 p-2" 
              loading="lazy"
              onError={(e) => {
                console.log("Erreur de chargement d'image, utilisation du placeholder");
                const target = e.target as HTMLImageElement;
                target.src = PLACEHOLDER_IMAGE;
              }}
            />
          </Link>
          
          {isPromotionActive && (
            <>
              <Badge className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                -{product.promotion}%
              </Badge>
              {product.promotionEnd && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> {getPromotionTimeLeft(product.promotionEnd)}
                </div>
              )}
            </>
          )}
          
          {product.dateAjout && new Date().getTime() - new Date(product.dateAjout).getTime() < 7 * 24 * 60 * 60 * 1000 && (
            <Badge className="absolute top-2 left-2 bg-blue-600 text-white">Nouveau</Badge>
          )}
        </div>
        <CardContent className="p-4 flex flex-col flex-grow">
          <Link to={`/${secureId}`} className="block">
            <h3 className="font-medium text-lg mb-1 hover:text-red-600 transition-colors line-clamp-1">{product.name}</h3>
          </Link>
          
          <div className="flex items-center mt-1 mb-2">
            <StarRating rating={averageRating} size={16} />
            <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
          </div>
          
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
          <div className="flex-grow"></div>
          
          <div className="flex justify-between items-center mt-2">
            {product.promotion ? (
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
                {(product as any).freeShipping && (
                  <span className="text-xs text-green-600 mt-1">Livraison gratuite</span>
                )}
              </div>
            ) : (
              <div className="flex flex-col">
                <p className="font-bold">{product.price.toFixed(2)} €</p>
                {(product as any).freeShipping && (
                  <span className="text-xs text-green-600 mt-1">Livraison gratuite</span>
                )}
              </div>
            )}
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => toggleFavorite(product)}
                className={isProductFavorite ? 'text-red-500 hover:text-red-600 hover:bg-red-50' : 'hover:text-red-500 hover:bg-red-50'}
                aria-label={isProductFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Heart className={`h-4 w-4 ${isProductFavorite ? 'fill-red-500' : ''}`} />
              </Button>
              <Button
                size="icon"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => addToCart(product)}
                disabled={!product.isSold || (product.stock !== undefined && product.stock <= 0)}
                aria-label="Ajouter au panier"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {(!product.isSold || (product.stock !== undefined && product.stock <= 0)) && (
            <p className="text-destructive text-xs mt-2">En rupture de stock</p>
          )}
          
          {product.stock !== undefined && product.stock > 0 && product.stock <= 5 && (
            <p className="text-orange-600 text-xs mt-2">Plus que {product.stock} en stock</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
