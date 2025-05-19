
import React, { createContext, useState, useContext, useEffect } from 'react';
import { productsAPI, Product, panierAPI, favoritesAPI, Cart, ordersAPI, Order } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import { useAuth } from './AuthContext';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreContextType {
  products: Product[];
  favorites: Product[];
  cart: CartItem[];
  selectedCartItems: CartItem[];
  orders: Order[];
  loadingProducts: boolean;
  loadingFavorites: boolean;
  loadingCart: boolean;
  loadingOrders: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  getProductById: (id: string) => Product | undefined;
  fetchProducts: (categoryName?: string) => Promise<void>;
  fetchOrders: () => Promise<void>;
  favoriteCount: number;
  createOrder: (shippingAddress: any, paymentMethod: string) => Promise<Order | null>;
  setSelectedCartItems: (items: CartItem[]) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCartItems, setSelectedCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [loadingCart, setLoadingCart] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { user, isAuthenticated } = useAuth();

  // Vérification périodique des promotions expirées
  useEffect(() => {
    const checkPromotions = () => {
      const now = new Date();
      const updatedProducts = products.map(product => {
        // Si la promotion est expirée, réinitialiser le prix
        if (product.promotion && product.promotionEnd && new Date(product.promotionEnd) < now) {
          return {
            ...product,
            price: product.originalPrice || product.price,
            promotion: null,
            promotionEnd: null
          };
        }
        return product;
      });
      
      // Si des produits ont été mis à jour, mettre à jour l'état
      if (JSON.stringify(updatedProducts) !== JSON.stringify(products)) {
        setProducts(updatedProducts);
      }
    };
    
    // Vérifier toutes les minutes
    const interval = setInterval(checkPromotions, 60000);
    return () => clearInterval(interval);
  }, [products]);

  const fetchProducts = async (categoryName?: string) => {
    setLoadingProducts(true);
    try {
      let response;
      if (categoryName) {
        response = await productsAPI.getByCategory(categoryName);
      } else {
        response = await productsAPI.getAll();
      }
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Format de données incorrect pour les produits');
      }
      
      setProducts(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      toast.error('Erreur lors du chargement des produits');
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchFavorites = async () => {
    if (!isAuthenticated || !user) {
      setFavorites([]);
      setLoadingFavorites(false);
      return;
    }
    
    setLoadingFavorites(true);
    try {
      const response = await favoritesAPI.get(user.id);
      if (response.data && response.data.items && Array.isArray(response.data.items)) {
        setFavorites(response.data.items);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error);
      setFavorites([]);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const fetchCart = async () => {
    if (!isAuthenticated || !user) {
      setCart([]);
      setLoadingCart(false);
      return;
    }
    
    setLoadingCart(true);
    try {
      const response = await panierAPI.get(user.id);
      const cartData = response.data;
      
      if (!cartData || !Array.isArray(cartData.items)) {
        setCart([]);
        return;
      }
      
      const cartItems: CartItem[] = [];
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
      setLoadingCart(false);
    }
  };

  const fetchOrders = async () => {
    if (!isAuthenticated) {
      setOrders([]);
      setLoadingOrders(false);
      return;
    }
    
    setLoadingOrders(true);
    try {
      const response = await ordersAPI.getUserOrders();
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchFavorites();
    fetchCart();
    fetchOrders();
  }, [user]);

  useEffect(() => {
    setSelectedCartItems(cart);
  }, [cart]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!isAuthenticated || !user) {
      toast.error('Vous devez être connecté pour ajouter un produit au panier',
        {
          style: { backgroundColor: 'red', color: 'white' },
        }
      );
      return;
    }
    
    // Check if there's enough stock
    if (product.stock !== undefined && product.stock < quantity) {
      toast.error(`Stock insuffisant. Disponible: ${product.stock}`);
      return;
    }
    
    // Check for existing item in cart
    const existingItemIndex = cart.findIndex(item => item.product.id === product.id);
    const existingQuantity = existingItemIndex >= 0 ? cart[existingItemIndex].quantity : 0;
    
    // Check total quantity against stock
    if (product.stock !== undefined && (existingQuantity + quantity) > product.stock) {
      toast.error(`Stock insuffisant. Disponible: ${product.stock}`);
      return;
    }
    
    try {
      await panierAPI.addItem(user.id, product.id, quantity);
      
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
      await panierAPI.removeItem(user.id, productId);
      setCart(cart.filter(item => item.product.id !== productId));
      toast.info('Produit supprimé du panier');
    } catch (error) {
      console.error("Erreur lors de la suppression du panier:", error);
      toast.error('Erreur lors de la suppression du produit');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated || !user) return;
    
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    // Check stock before updating
    const product = products.find(p => p.id === productId);
    if (product && product.stock !== undefined && quantity > product.stock) {
      toast.error(`Stock insuffisant. Disponible: ${product.stock}`);
      return;
    }
    
    try {
      await panierAPI.updateItem(user.id, productId, quantity);
      
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
      await panierAPI.clear(user.id);
      setCart([]);
    } catch (error) {
      console.error("Erreur lors de la suppression du panier:", error);
      toast.error('Erreur lors de la suppression du panier');
    }
  };

  const toggleFavorite = async (product: Product) => {
    if (!isAuthenticated || !user) {
      toast.error('Vous devez être connecté pour ajouter un produit aux favoris',
        {
          style: { backgroundColor: 'red', color: 'white' },
        }
      );
      return;
    }
    
    const isFav = favorites.some(fav => fav.id === product.id);
    
    try {
      if (isFav) {
        await favoritesAPI.removeItem(user.id, product.id);
        setFavorites(favorites.filter(fav => fav.id !== product.id));
        toast.info('Produit retiré des favoris');
      } else {
        await favoritesAPI.addItem(user.id, product.id);
        setFavorites([...favorites, product]);
        toast.success('Produit ajouté aux favoris');
      }
    } catch (error) {
      console.error("Erreur lors de la gestion des favoris:", error);
      toast.error('Erreur lors de la gestion des favoris');
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav.id === productId);
  };

  const getCartTotal = () => {
    return selectedCartItems.reduce((total, item) => {
      // Utiliser le prix promotionnel si disponible
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  const createOrder = async (shippingAddress: any, paymentMethod: string): Promise<Order | null> => {
    if (!isAuthenticated || !user || selectedCartItems.length === 0) {
      return null;
    }

    // Check stock availability for each item before placing order
    for (const item of selectedCartItems) {
      const currentProduct = products.find(p => p.id === item.product.id);
      if (currentProduct && currentProduct.stock !== undefined && item.quantity > currentProduct.stock) {
        toast.error(`Stock insuffisant pour ${currentProduct.name}. Disponible: ${currentProduct.stock}`);
        return null;
      }
    }

    try {
      const orderItems = selectedCartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price, // Prix déjà avec promotion si applicable
        name: item.product.name,
        image: item.product.image,
        subtotal: item.product.price * item.quantity
      }));
      
      const orderData = {
        items: orderItems,
        shippingAddress,
        paymentMethod
      };
      
      const response = await ordersAPI.create(orderData);
      
      if (response.data) {
        // Update local products with new stock levels
        const updatedProducts = [...products];
        selectedCartItems.forEach(item => {
          const productIndex = updatedProducts.findIndex(p => p.id === item.product.id);
          if (productIndex !== -1 && updatedProducts[productIndex].stock !== undefined) {
            const newStock = Math.max(0, updatedProducts[productIndex].stock! - item.quantity);
            updatedProducts[productIndex] = {
              ...updatedProducts[productIndex],
              stock: newStock,
              isSold: newStock > 0
            };
          }
        });
        setProducts(updatedProducts);
        
        // Refresh data
        await fetchOrders();
        await fetchProducts();
        await clearCart();
        
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      toast.error('Erreur lors de la création de la commande');
      return null;
    }
  };

  const favoriteCount = favorites.length;

  return (
    <StoreContext.Provider value={{
      products,
      favorites,
      cart,
      selectedCartItems,
      orders,
      loadingProducts,
      loadingFavorites,
      loadingCart,
      loadingOrders,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      toggleFavorite,
      isFavorite,
      getProductById,
      fetchProducts,
      fetchOrders,
      favoriteCount,
      createOrder,
      setSelectedCartItems
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export type { Product };
