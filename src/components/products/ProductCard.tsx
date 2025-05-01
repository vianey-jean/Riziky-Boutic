
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product, useStore } from '@/contexts/StoreContext';

interface ProductCardProps {
  product: Product;
}
const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const isProductFavorite = isFavorite(product.id);
  const baseImageUrl = `${AUTH_BASE_URL}`;
  
  // Determine which image to display - first image from images array or fallback to image property
  const displayImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : product.image;

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <Link to={`/produit/${product.id}`} className="overflow-hidden">
        <img 
          src={`${baseImageUrl}${displayImage}`} 
          alt={product.name} 
          className="h-48 w-full object-cover transition-transform hover:scale-105" 
        />
      </Link>
      <CardContent className="p-4 flex flex-col flex-grow">
        <Link to={`/produit/${product.id}`} className="block">
          <h3 className="font-medium text-lg mb-1 hover:text-brand-blue transition-colors">{product.name}</h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex-grow"></div>
        
        <div className="flex justify-between items-center mt-2">
          <span className="font-bold">{product.price.toFixed(2)} €</span>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => toggleFavorite(product)}
              className={isProductFavorite ? 'text-red-500' : ''}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              onClick={() => addToCart(product)}
              disabled={!product.isSold || (product.stock !== undefined && product.stock <= 0)}
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
