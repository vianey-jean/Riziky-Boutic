import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  maxStock?: number;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
}

const QuantitySelector = ({ 
  quantity, 
  onQuantityChange, 
  maxStock, 
  disabled = false,
  size = 'default'
}: QuantitySelectorProps) => {
  const handleDecrease = () => {
    if (quantity > 1 && !disabled) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (!disabled && (maxStock === undefined || quantity < maxStock)) {
      onQuantityChange(quantity + 1);
    }
  };

  const buttonSizeClasses = {
    sm: 'h-6 w-6',
    default: 'h-8 w-8', 
    lg: 'h-10 w-10'
  };

  const textSizeClasses = {
    sm: 'text-sm px-2',
    default: 'text-base px-3',
    lg: 'text-lg px-4'
  };

  return (
    <div className="flex items-center space-x-1 bg-background border rounded-lg">
  {/* Bouton pour diminuer la quantité (rouge et gras) */}
  <Button
    variant="ghost"
    size="icon"
    className={`${buttonSizeClasses[size]} hover:bg-red-200 text-red-600 font-bold`}
    onClick={handleDecrease}
    disabled={disabled || quantity <= 1}
  >
    <Minus className="h-4 w-4" />
  </Button>

  {/* Affichage de la quantité */}
  <div
    className={`${textSizeClasses[size]} font-bold text-center min-w-[2rem] flex items-center justify-center`}
  >
    {quantity}
  </div>

  {/* Bouton pour augmenter la quantité (vert et gras) */}
  <Button
    variant="ghost"
    size="icon"
    className={`${buttonSizeClasses[size]} hover:bg-green-200 text-green-600 font-bold`}
    onClick={handleIncrease}
    disabled={disabled || (maxStock !== undefined && quantity >= maxStock)}
  >
    <Plus className="h-4 w-4" />
  </Button>
</div>

  );
};

export default QuantitySelector;