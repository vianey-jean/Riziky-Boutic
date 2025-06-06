
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, Package, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    promotion?: number;
    stock?: number;
  };
  quantity: number;
}

interface CartItemCardProps {
  item: CartItem;
  isSelected: boolean;
  onSelectItem: (productId: string, checked: boolean) => void;
  onQuantityChange: (productId: string, newQuantity: number) => void;
  onRemove: (productId: string) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  isSelected,
  onSelectItem,
  onQuantityChange,
  onRemove
}) => {
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 py-6 border-b border-gray-200/50 last:border-b-0"
    >
      <div className="flex items-center space-x-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Checkbox 
            checked={isSelected}
            onCheckedChange={(checked) => onSelectItem(item.product.id, checked === true)}
            className="border-2 border-blue-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            id={`select-${item.product.id}`}
          />
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shadow-lg"
        >
          <img 
            src={`${AUTH_BASE_URL}/${item.product.image.startsWith('/') ? item.product.image.slice(1) : item.product.image}`} 
            alt={item.product.name} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `${AUTH_BASE_URL}/uploads/placeholder.jpg`;
            }}
          />
          {item.product.promotion && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-red-500 text-white text-xs font-bold shadow-lg">
                -{item.product.promotion}%
              </Badge>
            </div>
          )}
        </motion.div>
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <h3 className="font-semibold text-lg line-clamp-2 hover:text-blue-600 transition-colors duration-200">
            <Link to={`/produit/${item.product.id}`} className="hover:underline">
              {item.product.name}
            </Link>
          </h3>
          
          <div className="flex items-center space-x-3 mt-2">
            <span className="text-blue-600 font-medium">{formatPrice(item.product.price)} par unité</span>
            {item.product.promotion && (
              <Badge variant="destructive" className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                -{item.product.promotion}%
              </Badge>
            )}
          </div>
          
          {item.product.stock !== undefined && (
            <div className="flex items-center space-x-2 mt-2">
              <Package className="w-4 h-4" />
              <p className="text-sm">
                {item.product.stock > 5 ? (
                  <span className="text-green-600 font-medium flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    En stock
                  </span>
                ) : item.product.stock > 0 ? (
                  <span className="text-amber-600 font-medium flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Plus que {item.product.stock} en stock
                  </span>
                ) : (
                  <span className="text-red-600 font-medium flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Rupture de stock
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 rounded-l-lg border-gray-300 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
              onClick={() => onQuantityChange(item.product.id, item.quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <Input
              type="text"
              value={item.quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) onQuantityChange(item.product.id, val);
              }}
              className="h-10 w-16 rounded-none text-center border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 rounded-r-lg border-gray-300 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
              onClick={() => onQuantityChange(item.product.id, item.quantity + 1)}
              disabled={item.product.stock !== undefined && item.quantity >= item.product.stock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                {formatPrice(item.product.price * item.quantity)}
              </div>
              <div className="text-sm text-gray-500">
                Total pour {item.quantity} {item.quantity > 1 ? 'articles' : 'article'}
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item.product.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItemCard;
