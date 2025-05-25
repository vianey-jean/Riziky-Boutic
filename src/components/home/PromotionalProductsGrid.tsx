
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/contexts/StoreContext';
import { getSecureProductId } from '@/services/secureIds';

interface PromotionalProductsGridProps {
  products: Product[];
}

const PromotionalProductsGrid: React.FC<PromotionalProductsGridProps> = ({ products }) => {
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
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-red-800">Offres Promotionnelles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <Card key={product.id} className="overflow-hidden h-full flex flex-col">
            <div className="relative">
              <Link to={getSecureProductUrl(product.id)}>
                <img
                  src={getSecureImageUrl(product.image)}
                  alt={`${product.name} en promotion`}
                  className="h-48 w-full object-contain"
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.src = PRODUCT_PLACEHOLDER_IMAGE;
                  }}
                />
              </Link>
              <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                -{product.promotion}%
              </div>
              {product.promotionEnd && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  Expire dans: {calculatePromotionTimeRemaining(product.promotionEnd)}
                </div>
              )}
            </div>
            <CardContent className="p-4 flex-grow">
              <Link to={getSecureProductUrl(product.id)}>
                <h3 className="font-medium text-lg mb-1">{product.name}</h3>
              </Link>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-sm text-gray-500 line-through">
                  {typeof product.originalPrice === 'number'
                    ? product.originalPrice.toFixed(2)
                    : product.price.toFixed(2)}{' '}
                  €
                </p>
                <p className="font-bold text-red-600">
                  {product.price.toFixed(2)} €
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PromotionalProductsGrid;
