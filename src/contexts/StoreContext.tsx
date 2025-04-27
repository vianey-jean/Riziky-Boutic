import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';

// Types
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isSold: boolean;
  stock?: number;
  promotion?: number;
  promotionEnd?: string;
  originalPrice?: number;
  dateAjout?: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type Order = {
  id: string;
  items: CartItem[];
  total: number;
  status: 'en attente' | 'expédiée' | 'livrée';
  date: Date;
};

type StoreContextType = {
  products: Product[];
  cart: CartItem[];
  favorites: Product[];
  orders: Order[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  getCartTotal: () => number;
  createOrder: () => Order | null;
};

// Sample products data
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Écouteurs Sans Fil',
    description: 'Écouteurs sans fil avec annulation de bruit active et autonomie de 20 heures.',
    price: 79.99,
    originalPrice: 79.99,
    image: '/placeholder.svg',
    category: 'Électronique',
    isSold: true,
    stock: 15,
    dateAjout: '2025-04-20T10:00:00.000Z'
  },
  {
    id: '2',
    name: 'Montre Connectée',
    description: 'Montre connectée avec suivi de la santé et notifications intelligentes.',
    price: 117.00,
    originalPrice: 129.99,
    image: '/placeholder.svg',
    category: 'Électronique',
    isSold: true,
    stock: 8,
    promotion: 10,
    promotionEnd: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    dateAjout: '2025-04-23T10:00:00.000Z'
  },
  {
    id: '3',
    name: 'Caméra Sport HD',
    description: 'Caméra sport étanche avec vidéo 4K et stabilisation d\'image.',
    price: 149.99,
    image: '/placeholder.svg',
    category: 'Électronique',
    isSold: true,
  },
  {
    id: '4',
    name: 'Sac à Dos de Randonnée',
    description: 'Sac à dos imperméable avec multiples compartiments et support dorsal.',
    price: 59.99,
    image: '/placeholder.svg',
    category: 'Plein Air',
    isSold: true,
  },
  {
    id: '5',
    name: 'Chaussures de Course',
    description: 'Chaussures légères avec semelle amortissante et respiration optimale.',
    price: 89.99,
    image: '/placeholder.svg',
    category: 'Sport',
    isSold: true,
  },
  {
    id: '6',
    name: 'Collier en Argent',
    description: 'Collier en argent sterling avec pendentif élégant.',
    price: 45.99,
    image: '/placeholder.svg',
    category: 'Bijoux',
    isSold: true,
  },
  {
    id: '7',
    name: 'Enceinte Portable',
    description: 'Enceinte Bluetooth étanche avec 24 heures d\'autonomie.',
    price: 69.99,
    image: '/placeholder.svg',
    category: 'Électronique',
    isSold: false,
  },
  {
    id: '8',
    name: 'Tablette 10 pouces',
    description: 'Tablette tactile avec écran haute résolution et processeur rapide.',
    price: 199.99,
    image: '/placeholder.svg',
    category: 'Électronique',
    isSold: true,
  },
];

// Create context
const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore doit être utilisé dans un StoreProvider');
  return context;
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const addToCart = (product: Product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return currentCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...currentCart, { product, quantity: 1 }];
      }
    });
    
    toast.success("Produit ajouté au panier!");
  };

  const removeFromCart = (productId: string) => {
    setCart(currentCart => currentCart.filter(item => item.product.id !== productId));
    toast.info("Produit supprimé du panier");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(currentCart => 
      currentCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleFavorite = (product: Product) => {
    setFavorites(currentFavorites => {
      const isFav = currentFavorites.some(fav => fav.id === product.id);
      
      if (isFav) {
        toast.info("Retiré des favoris");
        return currentFavorites.filter(fav => fav.id !== product.id);
      } else {
        toast.success("Ajouté aux favoris!");
        return [...currentFavorites, product];
      }
    });
  };

  const isFavorite = (productId: string) => {
    return favorites.some(product => product.id === productId);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const createOrder = (): Order | null => {
    if (cart.length === 0) return null;
    
    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: [...cart],
      total: getCartTotal(),
      status: 'en attente',
      date: new Date()
    };
    
    setOrders(currentOrders => [order, ...currentOrders]);
    clearCart();
    toast.success("Commande créée avec succès!");
    return order;
  };

  const value = {
    products,
    cart,
    favorites,
    orders,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleFavorite,
    isFavorite,
    getCartTotal,
    createOrder,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};
