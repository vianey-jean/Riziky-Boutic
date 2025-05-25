
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/loading-spinner';
import CartSummary from '@/components/cart/CartSummary';
import CartItemCard from '@/components/cart/CartItemCard';
import EmptyCartMessage from '@/components/cart/EmptyCartMessage';

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

  if (loadingCart) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Chargement de votre panier..." />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>

        {!isAuthenticated || !cart || cart.length === 0 ? (
          <EmptyCartMessage isAuthenticated={isAuthenticated} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Articles dans votre panier</h2>
                
                <div className="space-y-5">
                  {cart.map((item) => (
                    <CartItemCard
                      key={item.product.id}
                      item={item}
                      isSelected={selectedItems[item.product.id] || false}
                      onSelectItem={handleSelectItem}
                      onQuantityChange={handleQuantityChange}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    className="text-sm"
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
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-muted-foreground">
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">ℹ️</div>
                  <div>
                    <p className="mb-1">Livraison offerte à partir de 50€ d'achat.</p>
                    <p>Les frais de livraison sont calculés à l'étape suivante.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <CartSummary 
                onCheckout={handleCheckout}
                selectedItems={selectedItems}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
