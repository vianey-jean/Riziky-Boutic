
import { useState, useEffect } from 'react';
import { StoreCartItem } from '@/types/cart';
import { Product } from '@/types/product';
import { cartAPI, productsAPI } from '@/services/api';
import { notificationService } from '@/services/NotificationService';
import { useAuth } from '@/contexts/AuthContext';

export const useCart = () => {
  const [cart, setCart] = useState<StoreCartItem[]>([]);
  const [selectedCartItems, setSelectedCartItems] = useState<StoreCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated || !user) {
      setCart([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await cartAPI.get(user.id);
      const cartData = response.data;
      
      if (!cartData || !Array.isArray(cartData.items)) {
        setCart([]);
        setLoading(false);
        return;
      }
      
      const cartItems: StoreCartItem[] = [];
      for (const item of cartData.items) {
        try {
          const productResponse = await productsAPI.getById(item.productId);
          if (productResponse.data) {
            cartItems.push({
              product: productResponse.data,
              quantity: item.quantity
            });
          }
        } catch (err) {
          console.error(`Erreur lors du chargement du produit ${item.productId}:`, err);
          notificationService.error('Erreur', `Impossible de charger un produit du panier`);
        }
      }
      
      setCart(cartItems);
    } catch (error) {
      console.error("Erreur lors du chargement du panier:", error);
      notificationService.error('Erreur', 'Impossible de charger votre panier');
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCart();
    } else {
      setCart([]);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    setSelectedCartItems([...cart]);
  }, [cart]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!isAuthenticated || !user) {
      notificationService.error('Connexion requise', 'Vous devez être connecté pour ajouter un produit au panier');
      return;
    }
    
    if (product.stock !== undefined && product.stock < quantity) {
      notificationService.stockInsufficient(product.stock);
      return;
    }
    
    const existingItemIndex = cart.findIndex(item => item.product.id === product.id);
    const existingQuantity = existingItemIndex >= 0 ? cart[existingItemIndex].quantity : 0;
    
    if (product.stock !== undefined && (existingQuantity + quantity) > product.stock) {
      notificationService.stockInsufficient(product.stock);
      return;
    }
    
    try {
      await cartAPI.addItem(user.id, product.id, quantity);
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += quantity;
        setCart(updatedCart);
      } else {
        setCart([...cart, { product, quantity }]);
      }
      
      notificationService.addToCart(product.name);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      notificationService.error('Erreur', 'Impossible d\'ajouter le produit au panier');
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated || !user) return;
    
    const product = cart.find(item => item.product.id === productId)?.product;
    
    try {
      await cartAPI.removeItem(user.id, productId);
      setCart(cart.filter(item => item.product.id !== productId));
      if (product) {
        notificationService.removeFromCart(product.name);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du panier:", error);
      notificationService.error('Erreur', 'Impossible de supprimer le produit du panier');
    }
  };

  const updateQuantity = async (productId: string, quantity: number, products: Product[]) => {
    if (!isAuthenticated || !user) return;
    
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product && product.stock !== undefined && quantity > product.stock) {
      notificationService.stockInsufficient(product.stock);
      return;
    }
    
    try {
      await cartAPI.updateItem(user.id, productId, quantity);
      
      const updatedCart = cart.map(item => {
        if (item.product.id === productId) {
          return { ...item, quantity };
        }
        return item;
      });
      
      setCart(updatedCart);
      notificationService.success('Quantité mise à jour', 'La quantité a été modifiée dans votre panier');
    } catch (error) {
      console.error("Erreur lors de la mise à jour du panier:", error);
      notificationService.error('Erreur', 'Impossible de modifier la quantité');
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      await cartAPI.clear(user.id);
      setCart([]);
      notificationService.success('Panier vidé', 'Votre panier a été vidé avec succès');
    } catch (error) {
      console.error("Erreur lors de la suppression du panier:", error);
      notificationService.error('Erreur', 'Impossible de vider le panier');
    }
  };

  const getCartTotal = () => {
    return selectedCartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  return {
    cart,
    selectedCartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    setSelectedCartItems,
    fetchCart
  };
};
