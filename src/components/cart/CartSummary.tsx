
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, CheckCircle, Tag, CreditCard } from 'lucide-react';
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-white/95 backdrop-blur-sm ${isCompact ? 'p-4' : 'p-8'} rounded-2xl shadow-xl border border-white/20`}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <h2 className={`${isCompact ? 'text-lg' : 'text-2xl'} font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent`}>
          Récapitulatif
        </h2>
      </div>
      
      {!hasSelectedItems ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-8"
        >
          <div className="p-4 bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">Aucun produit sélectionné</p>
          <p className="text-sm text-gray-500 mt-1">Sélectionnez des articles pour continuer</p>
        </motion.div>
      ) : (
        <>
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200/50"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800 font-medium">
                    {itemCount} {itemCount > 1 ? 'articles' : 'article'} sélectionné{itemCount > 1 ? 's' : ''}
                  </span>
                </div>
                <span className="font-semibold text-blue-900">{formatPrice(subtotal)}</span>
              </div>
            </motion.div>
            
            {selectedCartItems.some(item => item.product.promotion) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex items-center justify-center py-3"
              >
                <Badge variant="destructive" className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
                  <Tag className="w-3 h-3 mr-1" />
                  Prix promotionnels appliqués
                </Badge>
              </motion.div>
            )}
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="border-t border-gray-200 pt-4 mt-4"
            >
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span className="text-gray-800">Total</span>
                  <span className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2 text-center">
                  Frais de livraison calculés à l'étape suivante
                </p>
              </div>
            </motion.div>
          </div>
          
          {showCheckoutButton && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8"
            >
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
                size="lg"
                onClick={onCheckout}
                disabled={!hasSelectedItems}
              >
                <CheckCircle className="mr-2 h-5 w-5" /> 
                Procéder au paiement
              </Button>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex justify-center mt-4"
              >
                <Link 
                  to="/" 
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 font-medium"
                >
                  Continuer vos achats
                </Link>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default CartSummary;
