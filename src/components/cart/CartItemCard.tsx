
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Minus, Plus, Trash2 } from 'lucide-react';
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
    <div className="flex flex-col sm:flex-row border-b pb-5">
      <div className="flex items-center mb-4 sm:mb-0">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={(checked) => onSelectItem(item.product.id, checked === true)}
          className="mr-3"
          id={`select-${item.product.id}`}
        />
        <div className="sm:w-24 h-24">
          <img 
            src={`${AUTH_BASE_URL}/${item.product.image.startsWith('/') ? item.product.image.slice(1) : item.product.image}`} 
            alt={item.product.name} 
            className="w-full h-full object-cover rounded-md" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `${AUTH_BASE_URL}/uploads/placeholder.jpg`;
            }}
          />
        </div>
      </div>

      <div className="flex-1 sm:ml-4 flex flex-col sm:flex-row justify-between">
        <div>
          <h3 className="font-medium line-clamp-2">
            <Link to={`/produit/${item.product.id}`} className="hover:text-brand-blue">
              {item.product.name}
            </Link>
          </h3>
          <div className="text-sm text-muted-foreground mt-1 flex items-center">
            <span>{formatPrice(item.product.price)} par unité</span>
            {item.product.promotion && (
              <span className="ml-2 text-red-600 text-xs bg-red-50 px-1.5 py-0.5 rounded">
                -{item.product.promotion}%
              </span>
            )}
          </div>
          {item.product.stock !== undefined && (
            <p className="text-xs text-muted-foreground mt-1">
              {item.product.stock > 5 ? (
                <span className="text-green-600">En stock</span>
              ) : item.product.stock > 0 ? (
                <span className="text-amber-600">Plus que {item.product.stock} en stock</span>
              ) : (
                <span className="text-red-600">Rupture de stock</span>
              )}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 sm:mt-0">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-r-none"
              onClick={() => onQuantityChange(item.product.id, item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="text"
              value={item.quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) onQuantityChange(item.product.id, val);
              }}
              className="h-8 w-12 rounded-none text-center p-0"
            />
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-l-none"
              onClick={() => onQuantityChange(item.product.id, item.quantity + 1)}
              disabled={item.product.stock !== undefined && item.quantity >= item.product.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center ml-6 sm:ml-12">
            <span className="font-medium mr-4 whitespace-nowrap">
              {formatPrice(item.product.price * item.quantity)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item.product.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
