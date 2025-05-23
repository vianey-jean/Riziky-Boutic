
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import CartSummary from '@/components/cart/CartSummary';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { formatPrice } from '@/lib/utils';

// 🔁 URL de base récupérée depuis le .env
const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  const getSelectedItems = () => {
    if (!cart) return [];
    return cart.filter(item => selectedItems[item.product.id]);
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

        {!isAuthenticated ? (
          <div className="text-center py-16 border rounded-lg bg-gray-50">
            <div className="mb-4">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-medium mb-3">Connectez-vous pour voir votre panier</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Connectez-vous pour accéder à votre panier et profiter d'une expérience personnalisée
            </p>
            <Button asChild size="lg">
              <Link to="/login">Se connecter</Link>
            </Button>
          </div>
        ) : cart && cart.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Articles dans votre panier</h2>
                
                <div className="space-y-5">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex flex-col sm:flex-row border-b pb-5">
                      <div className="flex items-center mb-4 sm:mb-0">
                        <Checkbox 
                          checked={selectedItems[item.product.id] || false}
                          onCheckedChange={(checked) => handleSelectItem(item.product.id, checked === true)}
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
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
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
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-16 border rounded-lg bg-gray-50">
            <div className="mb-4">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-medium mb-3">Votre panier est vide</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Ajoutez des produits à votre panier pour commencer votre commande
            </p>
            <Button asChild size="lg" className="bg-red-800 hover:bg-red-700">
              <Link to="/">Découvrir nos produits</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
