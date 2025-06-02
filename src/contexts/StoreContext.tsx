
import React, { createContext, useContext } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { useOrders } from '@/hooks/useOrders';
import { Product } from '@/types/product';
import { StoreCartItem } from '@/types/cart';
import { Order } from '@/types/order';

interface StoreContextType {
  products: Product[];
  favorites: Product[];
  cart: StoreCartItem[];
  selectedCartItems: StoreCartItem[];
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
  createOrder: (
    shippingAddress: any, 
    paymentMethod: string, 
    codePromo?: {code: string, productId: string, pourcentage: number}
  ) => Promise<Order | null>;
  setSelectedCartItems: (items: StoreCartItem[]) => void;
  fetchCart: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    products, 
    loading: loadingProducts, 
    fetchProducts, 
    getProductById 
  } = useProducts();

  const {
    cart,
    selectedCartItems,
    loading: loadingCart,
    addToCart,
    removeFromCart,
    updateQuantity: updateCartQuantity,
    clearCart,
    getCartTotal,
    setSelectedCartItems,
    fetchCart
  } = useCart();

  const {
    favorites,
    loading: loadingFavorites,
    toggleFavorite,
    isFavorite,
    favoriteCount
  } = useFavorites();

  const {
    orders,
    loading: loadingOrders,
    fetchOrders,
    createOrder: createNewOrder
  } = useOrders();

  const updateQuantity = (productId: string, quantity: number) => {
    updateCartQuantity(productId, quantity, products);
  };

  const createOrder = async (
    shippingAddress: any,
    paymentMethod: string,
    codePromo?: { code: string; productId: string; pourcentage: number }
  ): Promise<Order | null> => {
    const result = await createNewOrder(shippingAddress, paymentMethod, selectedCartItems, codePromo);
    
    if (result) {
      // Recharger le panier pour refléter les suppressions
      await fetchCart();
      
      // Vider les items sélectionnés
      setSelectedCartItems([]);
      
      // Mettre à jour les produits pour refléter le stock actualisé
      fetchProducts();
    }
    
    return result;
  };

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
      setSelectedCartItems,
      fetchCart
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
