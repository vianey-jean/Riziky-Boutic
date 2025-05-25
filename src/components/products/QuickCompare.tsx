
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, X, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/contexts/StoreContext';

interface QuickCompareProps {
  products: Product[];
  onRemoveProduct: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

const QuickCompare: React.FC<QuickCompareProps> = ({ 
  products, 
  onRemoveProduct, 
  onAddToCart 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (products.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <GitCompare className="h-5 w-5 text-blue-600" />
            <span className="font-medium">
              Comparer ({products.length}/3)
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Réduire' : 'Développer'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={products.length < 2}
              className="text-blue-600 hover:text-blue-700"
            >
              Comparer maintenant
            </Button>
          </div>
        </div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
                {products.map((product) => (
                  <Card key={product.id} className="p-4 relative">
                    <button
                      onClick={() => onRemoveProduct(product.id)}
                      className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    
                    <div className="space-y-3">
                      <img
                        src={product.image ? `${import.meta.env.VITE_API_BASE_URL}${product.image}` : '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-32 object-contain"
                      />
                      
                      <div>
                        <h4 className="font-medium text-sm line-clamp-2">
                          {product.name}
                        </h4>
                        
                        <div className="flex items-center mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className="h-3 w-3 text-yellow-400 fill-current" 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">(4.5)</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-red-600">
                            {product.price.toFixed(2)} €
                          </span>
                          {product.promotion && (
                            <Badge variant="destructive">
                              -{product.promotion}%
                            </Badge>
                          )}
                        </div>
                        
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => onAddToCart(product)}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {/* Slots vides */}
                {[...Array(3 - products.length)].map((_, index) => (
                  <Card key={`empty-${index}`} className="p-4 border-dashed border-2 border-gray-200">
                    <div className="h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <GitCompare className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Ajouter un produit</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default QuickCompare;
