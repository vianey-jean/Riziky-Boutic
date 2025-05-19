
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product, useStore } from '@/contexts/StoreContext';
import { getSecureId } from '@/services/secureIds';

interface ProductCardProps {
  product: Product;
}

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PLACEHOLDER_IMAGE = '/placeholder.svg';

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const isProductFavorite = isFavorite(product.id);
  
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
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative">
        <Link to={`/${secureId}`} className="overflow-hidden">
          <img 
            src={getImageUrl(displayImage)} 
            alt={`Photo de ${product.name}`} 
            className="h-48 w-full object-contain transition-transform hover:scale-105" 
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
            <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{product.promotion}%
            </div>
            {product.promotionEnd && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {getPromotionTimeLeft(product.promotionEnd)}
              </div>
            )}
          </>
        )}
      </div>
      <CardContent className="p-4 flex flex-col flex-grow">
        <Link to={`/${secureId}`} className="block">
          <h3 className="font-medium text-lg mb-1 hover:text-brand-blue transition-colors">{product.name}</h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex-grow"></div>
        
        <div className="flex justify-between items-center mt-2">
          {product.promotion ? (
            <div className="flex items-center gap-2">
              <p className="mt-1 text-sm text-gray-500 line-through">
                {typeof product.originalPrice === 'number'
                  ? product.originalPrice.toFixed(2)
                  : product.price.toFixed(2)}{' '}
                    €
              </p>
              <p className="mt-1 font-bold ">{product.price.toFixed(2)} €</p>
            </div>
          ) : (
            <p className="mt-1 font-bold">{product.price.toFixed(2)} €</p>
          )}
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => toggleFavorite(product)}
              className={isProductFavorite ? 'text-red-500' : ''}
              aria-label={isProductFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
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
      </CardContent>
    </Card>
  );
};

export default ProductCard;
