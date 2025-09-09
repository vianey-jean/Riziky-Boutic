import { useState, useEffect } from 'react';
import { StoreCartItem } from '@/types/cart';
import { Product } from '@/types/product';
import { cartAPI, productsAPI } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import { io } from 'socket.io-client';

export const useCart = () => {
  const [cart, setCart] = useState<StoreCartItem[]>([]);
  const [selectedCartItems, setSelectedCartItems] = useState<StoreCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, setRedirectAfterLogin } = useAuth();

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
        }
      }
      
      setCart(cartItems);
    } catch (error) {
      console.error("Erreur lors du chargement du panier:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCart();
      
      // Connexion Socket.IO pour synchronisation en temps réel
      const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000');
      
      // Authentifier l'utilisateur auprès du socket
      socket.emit('authenticate', user);
      
      // Écouter les mises à jour de stock
      socket.on('stock-updated', (data: { productId: string; stock: number }) => {
        setCart(prevCart => 
          prevCart.map(item => {
            if (item.product.id === data.productId) {
              const updatedProduct = { ...item.product, stock: data.stock };
              
              // Si le produit est en rupture de stock, afficher un toast
              if (data.stock <= 0) {
                toast.warning(`${item.product.name} est maintenant en rupture de stock`, {
                  style: { backgroundColor: '#F59E0B', color: 'white', fontWeight: 'bold' },
                  duration: 5000,
                  position: 'top-center',
                });
              }
              
              return { ...item, product: updatedProduct };
            }
            return item;
          })
        );
      });
      
      // Nettoyer la connexion lors du démontage du composant
      return () => {
        socket.disconnect();
      };
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
      setRedirectAfterLogin('/panier');
      toast.error('Vous devez être connecté pour ajouter un produit au panier', {
        style: { backgroundColor: '#EF4444', color: 'white', fontWeight: 'bold' },
        duration: 4000,
        position: 'top-center',
      });
      return;
    }
    
    if (product.stock !== undefined && product.stock < quantity) {
      toast.error(`Stock insuffisant. Disponible: ${product.stock}`);
      return;
    }
    
    const existingItemIndex = cart.findIndex(item => item.product.id === product.id);
    const existingQuantity = existingItemIndex >= 0 ? cart[existingItemIndex].quantity : 0;
    
    if (product.stock !== undefined && (existingQuantity + quantity) > product.stock) {
      toast.error(`Stock insuffisant. Disponible: ${product.stock}`);
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
      
      toast.success('Produit ajouté au panier');
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      toast.error('Erreur lors de l\'ajout au panier');
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated || !user) return;
    
    try {
      await cartAPI.removeItem(user.id, productId);
      setCart(cart.filter(item => item.product.id !== productId));
      toast.info('Produit supprimé du panier');
    } catch (error) {
      console.error("Erreur lors de la suppression du panier:", error);
      toast.error('Erreur lors de la suppression du produit');
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
      toast.error(`Stock insuffisant. Disponible: ${product.stock}`);
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
    } catch (error) {
      console.error("Erreur lors de la mise à jour du panier:", error);
      toast.error('Erreur lors de la mise à jour de la quantité');
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      await cartAPI.clear(user.id);
      setCart([]);
    } catch (error) {
      console.error("Erreur lors de la suppression du panier:", error);
      toast.error('Erreur lors de la suppression du panier');
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
