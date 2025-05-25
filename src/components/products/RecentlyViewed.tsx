
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ProductCard from './ProductCard';
import { Product } from '@/contexts/StoreContext';

interface RecentlyViewedProps {
  onProductClick?: (product: Product) => void;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ onProductClick }) => {
  const [viewedProducts, setViewedProducts] = useState<Product[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Simuler des produits récemment consultés
  useEffect(() => {
    // En réalité, ces données viendraient du localStorage ou d'une API
    const mockRecentProducts: Product[] = [
      {
        id: '1',
        name: 'iPhone 15 Pro',
        description: 'Dernier smartphone Apple',
        price: 1199,
        image: '/placeholder.svg',
        category: 'Électronique',
        isSold: true,
        stock: 5
      },
      {
        id: '2',
        name: 'Samsung Galaxy S24',
        description: 'Smartphone Samsung premium',
        price: 999,
        image: '/placeholder.svg',
        category: 'Électronique',
        isSold: true,
        stock: 3
      }
    ];
    
    setViewedProducts(mockRecentProducts);
    
    // Afficher automatiquement après un délai
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClearHistory = () => {
    setViewedProducts([]);
    setIsVisible(false);
  };

  if (!isVisible || viewedProducts.length === 0) return null;

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 w-80"
    >
      <Card className="p-4 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium">Récemment consultés</h3>
          </div>
          
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearHistory}
              className="text-gray-500 hover:text-gray-700 text-xs"
            >
              Effacer
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {viewedProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-100"
              onClick={() => onProductClick?.(product)}
            >
              <img
                src={product.image || '/placeholder.svg'}
                alt={product.name}
                className="w-12 h-12 object-contain rounded-md"
              />
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">
                  {product.name}
                </h4>
                <p className="text-sm text-red-600 font-medium">
                  {product.price.toFixed(2)} €
                </p>
                {product.stock && product.stock <= 5 && (
                  <p className="text-xs text-orange-500">
                    Plus que {product.stock} en stock
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            Voir tout l'historique
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default RecentlyViewed;
