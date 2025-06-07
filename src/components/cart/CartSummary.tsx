
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, CheckCircle } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { formatPrice } from '@/lib/utils';

interface CartSummaryProps {
  onCheckout?: () => void;
  showCheckoutButton?: boolean;
  isCompact?: boolean;
  selectedItems?: Record<string, boolean>;
}

const CartSummary: React.FC<CartSummaryProps> = ({ 
  onCheckout, 
  showCheckoutButton = true,
  isCompact = false,
  selectedItems = {}
}) => {
  const { cart } = useStore();
  
  // Filtrer les produits sélectionnés
  const selectedCartItems = cart ? cart.filter(item => selectedItems[item.product.id]) : [];
  
  const subtotal = selectedCartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const itemCount = selectedCartItems.reduce((count, item) => count + item.quantity, 0);
  
  // Vérifier si des articles sont sélectionnés
  const hasSelectedItems = selectedCartItems.length > 0;
  
  return (
    <div className={`bg-white ${isCompact ? 'p-4' : 'p-6'} rounded-lg shadow`}>
      <h2 className={`${isCompact ? 'text-lg' : 'text-xl'} font-semibold mb-4`}>Récapitulatif</h2>
      
      {!hasSelectedItems ? (
        <div className="text-center py-4">
          <ShoppingBag className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-muted-foreground">Aucun produit sélectionné</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {itemCount} {itemCount > 1 ? 'articles' : 'article'} sélectionné{itemCount > 1 ? 's' : ''}
              </span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            
            {selectedCartItems.some(item => item.product.promotion) && (
              <div className="flex items-center py-1">
                <Badge variant="destructive" className="mr-2">Promo</Badge>
                <span className="text-sm">Prix promotionnels appliqués</span>
              </div>
            )}
            
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Frais de livraison calculés à l'étape suivante</p>
            </div>
          </div>
          
          {showCheckoutButton && (
            <div className="mt-6">
              <Button 
                className="w-full" 
                size="lg"
                onClick={onCheckout}
                disabled={!hasSelectedItems}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Commander
              </Button>
              <div className="flex justify-center mt-3">
                <Link to="/" className="text-sm text-brand-blue hover:underline">
                  Continuer vos achats
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CartSummary;
