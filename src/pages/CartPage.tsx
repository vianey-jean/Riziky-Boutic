
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/loading-spinner';
import CartSummary from '@/components/cart/CartSummary';
import CartItemCard from '@/components/cart/CartItemCard';
import EmptyCartMessage from '@/components/cart/EmptyCartMessage';
import { ShoppingCart, Package, Info } from 'lucide-react';

const CartPage = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    loadingCart, 
    setSelectedCartItems 
  } = useStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (cart && cart.length > 0) {
      const initialSelection = cart.reduce((acc, item) => {
        acc[item.product.id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setSelectedItems(initialSelection);
    }
  }, [cart]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleSelectItem = (productId: string, checked: boolean) => {
    setSelectedItems(prev => ({
      ...prev,
      [productId]: checked
    }));
  };

  const handleCheckout = () => {
    const selectedProducts = cart.filter(item => selectedItems[item.product.id]);
    setSelectedCartItems(selectedProducts);
    navigate('/paiement');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (loadingCart) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="container mx-auto px-4 py-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center mb-8">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                  <ShoppingCart className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Votre Panier
              </h1>
              <div className="flex justify-center py-16">
                <LoadingSpinner text="Chargement de votre panier..." />
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-24">
          <div className="absolute inset-0 bg-black/20"></div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 relative z-10"
          >
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <ShoppingCart className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Votre Panier
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
                Finalisez votre sélection et procédez au paiement en toute sécurité
              </p>
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto"
          >
            {!isAuthenticated || !cart || cart.length === 0 ? (
              <motion.div variants={itemVariants}>
                <EmptyCartMessage isAuthenticated={isAuthenticated} />
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div variants={itemVariants} className="lg:col-span-2">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Articles dans votre panier
                      </h2>
                    </div>
                    
                    <div className="space-y-6">
                      {cart.map((item, index) => (
                        <motion.div
                          key={item.product.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="relative"
                        >
                          <div className="bg-gradient-to-r from-white to-gray-50/50 rounded-xl p-6 border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300">
                            <CartItemCard
                              item={item}
                              isSelected={selectedItems[item.product.id] || false}
                              onSelectItem={handleSelectItem}
                              onQuantityChange={handleQuantityChange}
                              onRemove={removeFromCart}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="mt-8 flex justify-end"
                    >
                      <Button 
                        variant="outline" 
                        className="text-sm bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:from-blue-100 hover:to-purple-100 transition-all duration-300"
                        onClick={() => {
                          const allSelected = cart.every(item => selectedItems[item.product.id]);
                          const newSelection = cart.reduce((acc, item) => {
                            acc[item.product.id] = !allSelected;
                            return acc;
                          }, {} as Record<string, boolean>);
                          setSelectedItems(newSelection);
                        }}
                      >
                        {cart.every(item => selectedItems[item.product.id]) 
                          ? "Désélectionner tout" 
                          : "Sélectionner tout"}
                      </Button>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    variants={itemVariants}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200/50 shadow-sm"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Info className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="mb-2 text-blue-800 font-medium">Informations de livraison</p>
                        <p className="text-sm text-blue-700 mb-1">Livraison offerte à partir de 50€ d'achat.</p>
                        <p className="text-sm text-blue-700">Les frais de livraison sont calculés à l'étape suivante.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="lg:col-span-1">
                  <div className="sticky top-24">
                    <CartSummary 
                      onCheckout={handleCheckout}
                      selectedItems={selectedItems}
                    />
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
