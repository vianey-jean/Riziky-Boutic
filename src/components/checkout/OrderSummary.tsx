import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Percent, Truck, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { StoreCartItem } from '@/types/cart';

interface OrderSummaryProps {
  selectedCartItems: StoreCartItem[];
  subtotal: number;
  discountedSubtotal: number;
  hasPromoDiscount: boolean;
  taxAmount: number;
  deliveryPrice: number;
  deliveryCity: string;
  orderTotal: number;
  codePromo: string;
  verifyingCode: boolean;
  verifiedPromo: any;
  step: 'shipping' | 'payment';
  allProductsOnPromotion: boolean;
  hasNonPromotionProduct: boolean;
  calculateItemPrice: (item: StoreCartItem) => number;
  onCodePromoChange: (code: string) => void;
  onVerifyCodePromo: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  selectedCartItems,
  subtotal,
  discountedSubtotal,
  hasPromoDiscount,
  taxAmount,
  deliveryPrice,
  deliveryCity,
  orderTotal,
  codePromo,
  verifyingCode,
  verifiedPromo,
  step,
  allProductsOnPromotion,
  hasNonPromotionProduct,
  calculateItemPrice,
  onCodePromoChange,
  onVerifyCodePromo
}) => {
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  return (
    <motion.div 
      className="lg:col-span-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-200 mb-6 sticky top-4 backdrop-blur-sm">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Récapitulatif
          </h2>
        </div>
        
        <div className="space-y-6 mb-8">
          {selectedCartItems.map((item, index) => (
            <motion.div 
              key={item.product.id} 
              className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="relative">
                <img 
                  src={`${AUTH_BASE_URL}${
                    item.product.images && item.product.images.length > 0 
                      ? item.product.images[0] 
                      : item.product.image
                  }`} 
                  alt={item.product.name} 
                  className="w-16 h-16 object-cover rounded-xl shadow-md" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `${AUTH_BASE_URL}/uploads/placeholder.jpg`;
                  }}
                />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-grow">
                <p className="font-semibold line-clamp-2 text-sm text-gray-800">{item.product.name}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-600">
                    {item.quantity} × {formatPrice(item.product.price)}
                  </span>
                  {verifiedPromo && verifiedPromo.valid && item.product.id === verifiedPromo.productId && (
                    <span className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full">
                      -{verifiedPromo.pourcentage}%
                    </span>
                  )}
                  {item.product.promotion && item.product.promotion > 0 && (
                    <span className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full">
                      Promo -{item.product.promotion}%
                    </span>
                  )}
                </div>
              </div>
              <p className="font-bold text-sm whitespace-nowrap text-gray-900">
                {formatPrice(calculateItemPrice(item))}
              </p>
            </motion.div>
          ))}
        </div>
        
        <div className="border-t-2 border-gradient-to-r from-gray-200 to-gray-100 pt-6 space-y-4">
          <div className="flex justify-between text-gray-600">
            <p className="font-medium">Sous-total</p>
            <p className="font-semibold">{formatPrice(subtotal)}</p>
          </div>
          
          {hasPromoDiscount && (
            <motion.div 
              className="flex justify-between text-green-600"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="flex items-center font-medium">
                <Percent className="h-4 w-4 mr-2" />
                Remise code promo
              </p>
              <p className="font-semibold">-{formatPrice(subtotal - discountedSubtotal)}</p>
            </motion.div>
          )}


          <div className="flex justify-between text-gray-600">
            <p className="flex items-center font-medium">
              <Truck className="h-4 w-4 mr-2" />
              Livraison ({deliveryCity || 'Non sélectionné'})
            </p>
            <p className="font-semibold">
              {deliveryPrice === 0 && !deliveryCity ? 'Non calculé' : 
               deliveryPrice === 0 ? 'Gratuit' : formatPrice(deliveryPrice)}
            </p>
          </div>
          
          {/* Section Code Promo avec design amélioré */}
          {step === 'shipping' && !allProductsOnPromotion && hasNonPromotionProduct && (
            <motion.div 
              className="py-6 border-t border-b bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 rounded-2xl p-6 -mx-2 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="font-bold mb-4 text-gray-800 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <Percent className="h-4 w-4 text-white" />
                </div>
                Code Promotion
              </div>
              <div className="flex space-x-3">
                <Input
                  placeholder="Entrez votre code"
                  value={codePromo}
                  onChange={(e) => onCodePromoChange(e.target.value)}
                  disabled={verifiedPromo !== null || verifyingCode}
                  className="border-yellow-300 focus:border-yellow-500 rounded-xl h-12"
                />
                <Button 
                  onClick={onVerifyCodePromo}
                  disabled={!codePromo || verifiedPromo !== null || verifyingCode}
                  variant="outline"
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 rounded-xl h-12 px-6"
                >
                  {verifyingCode ? 'Vérification...' : 'Appliquer'}
                </Button>
              </div>
              {verifiedPromo && verifiedPromo.valid && (
                <motion.div 
                  className="mt-4 flex items-center text-sm text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Code appliqué : {verifiedPromo.pourcentage}% de réduction
                </motion.div>
              )}
            </motion.div>
          )}
          
          <motion.div 
            className="flex justify-between font-bold text-2xl pt-6 border-t-2 border-gray-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-gray-900">Total TTC</p>
            <p className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              {formatPrice(orderTotal)}
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Informations de sécurité */}
      <motion.div 
        className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-3xl border border-blue-200 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <h3 className="font-bold text-blue-900 text-lg">Paiement sécurisé</h3>
        </div>
        <ul className="text-sm space-y-3 text-blue-800">
          {[
            'Cryptage SSL 256 bits',
            'Données bancaires protégées',
            'Livraison assurée',
            'Retours gratuits 30 jours'
          ].map((item, index) => (
            <motion.li 
              key={index}
              className="flex items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <CheckCircle className="h-4 w-4 mr-3 text-green-500" />
              {item}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default OrderSummary;