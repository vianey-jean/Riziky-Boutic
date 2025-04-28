
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, loadingCart, setSelectedCartItems } = useStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    // Par défaut, sélectionner tous les articles du panier
    const initialSelection = cart.reduce((acc, item) => {
      acc[item.product.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setSelectedItems(initialSelection);
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

  const getSelectedTotal = () => {
    return cart
      .filter(item => selectedItems[item.product.id])
      .reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    const selectedProducts = cart.filter(item => selectedItems[item.product.id]);
    setSelectedCartItems(selectedProducts);
    navigate('/paiement');
  };

  if (loadingCart) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Votre Panier</h1>
          <div className="text-center py-10">Chargement de votre panier...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Votre Panier</h1>
        
        {!isAuthenticated ? (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <div className="mb-4">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">Connectez-vous pour voir votre panier</h2>
            <p className="text-muted-foreground mb-6">Vous devez être connecté pour accéder à votre panier</p>
            <Button asChild>
              <Link to="/login">Se connecter</Link>
            </Button>
          </div>
        ) : cart.length > 0 ? (
          <>
            <div className="mb-8">
              {cart.map((item) => (
                <div key={item.product.id} className="flex flex-col sm:flex-row border-b py-4">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <Checkbox 
                      checked={selectedItems[item.product.id] || false}
                      onCheckedChange={(checked) => handleSelectItem(item.product.id, checked === true)}
                      className="mr-3"
                      id={`select-${item.product.id}`}
                    />
                    <div className="sm:w-20">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-auto object-cover rounded" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 sm:ml-6 flex flex-col sm:flex-row justify-between">
                    <div>
                      <h3 className="font-medium">
                        <Link to={`/produit/${item.product.id}`} className="hover:text-brand-blue">
                          {item.product.name}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.product.price.toFixed(2)} € par unité
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 sm:mt-0">
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="text"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) handleQuantityChange(item.product.id, val);
                          }}
                          className="h-8 w-12 rounded-none text-center p-0"
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center ml-4 sm:ml-10">
                        <span className="font-medium mr-4">
                          {(item.product.price * item.quantity).toFixed(2)} €
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  className="text-sm"
                  onClick={() => {
                    // Sélectionner ou désélectionner tous les articles
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
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between mb-4">
                <span>Sous-total</span>
                <span>{getSelectedTotal().toFixed(2)} €</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Livraison</span>
                <span>Calculé à l'étape suivante</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>{getSelectedTotal().toFixed(2)} €</span>
              </div>
              
              <div className="mt-6">
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handleCheckout}
                  disabled={Object.values(selectedItems).filter(Boolean).length === 0}
                >
                  Procéder au paiement
                </Button>
                <div className="flex justify-center mt-4">
                  <Link to="/" className="text-brand-blue hover:underline text-sm flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    Continuer vos achats
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <div className="mb-4">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">Votre panier est vide</h2>
            <p className="text-muted-foreground mb-6">Ajoutez des produits à votre panier pour commander</p>
            <Button asChild>
              <Link to="/">Explorer nos produits</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
