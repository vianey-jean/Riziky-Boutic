
# Documentation du Code - Riziky-Boutic

## 📋 Guide de Navigation du Code

Cette documentation fournit un aperçu détaillé de l'organisation et de la structure du code source.

---

## 🔧 Configuration du Projet

### Fichiers de Configuration Principaux

#### `main.tsx` - Point d'entrée de l'application
```typescript
// Polyfill pour la compatibilité
window.global = window;

// Configuration des providers globaux
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <App />
          <CookieManager position="fixed" />
          <Toaster />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
```

#### `index.css` - Styles globaux et variables CSS
```css
/* Variables CSS pour les thèmes */
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 0 72.2% 50.6%;
  /* ... autres variables */
}

/* Classes utilitaires personnalisées */
.shimmer-effect {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

---

## 🏗️ Architecture des Composants

### Composants de Layout

#### `Navbar.tsx` - Navigation principale
```typescript
// Structure de navigation responsive avec gestion d'état
const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart, favoriteCount } = useStore();
  
  // Logique de gestion mobile/desktop
  const isMobile = useIsMobile();
  
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Logo et marque */}
      <div className="flex items-center">
        <Link to="/">
          <img src="/images/Logo/Logo.png" alt="Riziky-Boutic" />
        </Link>
      </div>
      
      {/* Navigation adaptative */}
      {isMobile ? <MobileNavigation /> : <DesktopNavigation />}
    </nav>
  );
};
```

#### `CategoriesDropdown.tsx` - Menu des catégories adaptatif
```typescript
// Affichage conditionnel basé sur le nombre de catégories
const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({ categories }) => {
  // Si moins de 8 catégories : affichage direct
  if (categories.length < 8) {
    return (
      <div className="flex items-center justify-center space-x-4 flex-wrap">
        {categories.map(cat => (
          <Link 
            key={cat.id}
            to={`/categorie/${cat.name}`}
            className="text-red-900 font-bold hover:text-red-600 capitalize"
          >
            {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
          </Link>
        ))}
      </div>
    );
  }
  
  // Si 8+ catégories : menu dropdown avec hamburger
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Menu className="h-4 w-4 mr-2" />
          Toutes les catégories
        </Button>
      </DropdownMenuTrigger>
      {/* ... contenu du menu */}
    </DropdownMenu>
  );
};
```

### Composants Produits

#### `ProductCard.tsx` - Carte produit interactive
```typescript
// Carte produit avec gestion des favoris et panier
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  
  // Calcul des prix avec promotions
  const displayPrice = product.promotion 
    ? product.price * (1 - product.promotion / 100)
    : product.price;
    
  return (
    <Card className="product-card">
      {/* Image avec overlay d'actions */}
      <div className="relative group">
        <img 
          src={product.images?.[0] || product.image} 
          alt={product.name}
          className="product-image"
        />
        
        {/* Actions rapides (survol) */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
          <Button onClick={() => toggleFavorite(product)}>
            <Heart className={isFavorite(product.id) ? "fill-red-500" : ""} />
          </Button>
          <Button onClick={() => addToCart(product)}>
            <ShoppingCart />
          </Button>
        </div>
      </div>
      
      {/* Informations produit */}
      <CardContent>
        <h3 className="font-semibold">{product.name}</h3>
        <div className="flex items-center justify-between">
          <div className="price-display">
            {product.promotion && (
              <span className="line-through text-gray-500">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="text-red-600 font-bold">
              {formatPrice(displayPrice)}
            </span>
          </div>
          <Badge variant={product.stock > 0 ? "default" : "destructive"}>
            {product.stock > 0 ? "En stock" : "Rupture"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 🔧 Hooks Personnalisés

### `useProducts.ts` - Gestion des produits
```typescript
export const useProducts = (categoryName?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupération des produits avec gestion d'erreurs
  const fetchProducts = async (categoryName?: string) => {
    setLoading(true);
    try {
      let response;
      if (categoryName) {
        response = await productsAPI.getByCategory(categoryName);
      } else {
        response = await productsAPI.getAll();
      }
      
      // Validation du format de données
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Format de données incorrect pour les produits');
      }
      
      setProducts(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      toast.error('Erreur lors du chargement des produits');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Vérification périodique des promotions expirées
  useEffect(() => {
    const checkPromotions = () => {
      const now = new Date();
      const updatedProducts = products.map(product => {
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
      
      if (JSON.stringify(updatedProducts) !== JSON.stringify(products)) {
        setProducts(updatedProducts);
      }
    };
    
    const interval = setInterval(checkPromotions, 60000);
    return () => clearInterval(interval);
  }, [products]);

  return { products, loading, fetchProducts, getProductById };
};
```

### `useCart.ts` - Gestion du panier
```typescript
export const useCart = () => {
  const [cart, setCart] = useState<StoreCartItem[]>([]);
  const [selectedCartItems, setSelectedCartItems] = useState<StoreCartItem[]>([]);
  const { user, isAuthenticated } = useAuth();

  // Ajout au panier avec validation stock
  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!isAuthenticated || !user) {
      toast.error('Vous devez être connecté pour ajouter un produit au panier');
      return;
    }
    
    // Vérification du stock disponible
    if (product.stock !== undefined && product.stock < quantity) {
      toast.error(`Stock insuffisant. Disponible: ${product.stock}`);
      return;
    }
    
    const existingItemIndex = cart.findIndex(item => item.product.id === product.id);
    const existingQuantity = existingItemIndex >= 0 ? cart[existingItemIndex].quantity : 0;
    
    // Vérification du stock total (existant + nouveau)
    if (product.stock !== undefined && (existingQuantity + quantity) > product.stock) {
      toast.error(`Stock insuffisant. Disponible: ${product.stock}`);
      return;
    }
    
    try {
      await cartAPI.addItem(user.id, product.id, quantity);
      
      // Mise à jour de l'état local
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

  // Calcul du total avec items sélectionnés
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
    setSelectedCartItems
  };
};
```

---

## 🌐 Services API

### Structure des Services

#### `apiClient.ts` - Configuration Axios centralisée
```typescript
// Client API avec intercepteurs pour authentification
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter automatiquement le token JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs d'authentification
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### `products.service.ts` - Service produits
```typescript
export const productsService = {
  // Récupérer tous les produits avec pagination optionnelle
  getAll: (page?: number, limit?: number) => 
    apiClient.get<Product[]>('/products', { 
      params: { page, limit } 
    }),
  
  // Récupérer produits par catégorie avec validation
  getByCategory: (categoryName: string) => {
    if (!categoryName || categoryName.trim() === '') {
      throw new Error('Nom de catégorie requis');
    }
    return apiClient.get<Product[]>(`/products/category/${encodeURIComponent(categoryName)}`);
  },
  
  // Recherche de produits avec filtres
  search: (query: string, filters?: ProductFilters) => 
    apiClient.post<Product[]>('/products/search', { query, filters }),
  
  // Produits en promotion actuelle
  getPromotional: () => apiClient.get<Product[]>('/products/promotional'),
  
  // Nouveautés basées sur date d'ajout
  getNewArrivals: (limit: number = 8) => 
    apiClient.get<Product[]>(`/products/new-arrivals?limit=${limit}`),
  
  // Produits les plus favoris
  getMostFavorited: (limit: number = 8) => 
    apiClient.get<Product[]>(`/products/most-favorited?limit=${limit}`),
};
```

---

## 🎯 Contextes React

### `AuthContext.tsx` - Gestion de l'authentification
```typescript
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Validation automatique du token au démarrage
  const validateToken = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return false;
    }
    
    try {
      const response = await authAPI.verifyToken();
      if (response.data && response.data.valid) {
        setUser(response.data.user);
        return true;
      }
    } catch (error) {
      console.error("Erreur de vérification du token:", error);
      localStorage.removeItem('authToken');
    }
    
    setLoading(false);
    return false;
  };

  // Connexion avec gestion d'erreurs détaillée
  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log("Tentative de connexion avec:", { email });
      const response = await authAPI.login({ email, password });
      
      // Sauvegarde sécurisée du token
      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user);
      
      toast({
        title: 'Connexion réussie',
        variant: 'default',
      });

      // Navigation sécurisée
      window.location.href = '/';
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      
      const errorMessage = error.response?.data?.message || "Erreur de connexion";
      toast({
        title: errorMessage,
        variant: 'destructive',
      });

      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
    login,
    logout,
    register,
    // ... autres méthodes
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### `StoreContext.tsx` - État global du magasin
```typescript
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Intégration de tous les hooks métier
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
    setSelectedCartItems
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

  // Logique de création de commande avec nettoyage du panier
  const createOrder = async (
    shippingAddress: any,
    paymentMethod: string,
    codePromo?: { code: string; productId: string; pourcentage: number }
  ): Promise<Order | null> => {
    const result = await createNewOrder(shippingAddress, paymentMethod, selectedCartItems, codePromo);
    
    if (result) {
      // Supprimer seulement les produits commandés du panier
      const remainingCartItems = cart.filter(cartItem => 
        !selectedCartItems.some(selectedItem => selectedItem.product.id === cartItem.product.id)
      );
      
      setSelectedCartItems([]);
      fetchProducts(); // Actualiser les stocks
    }
    
    return result;
  };

  return (
    <StoreContext.Provider value={{
      // État
      products,
      favorites,
      cart,
      selectedCartItems,
      orders,
      // Loading states
      loadingProducts,
      loadingFavorites,
      loadingCart,
      loadingOrders,
      // Actions
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
```

---

## 🛠️ Utilitaires et Helpers

### `ecommerce-utils.ts` - Fonctions utilitaires métier
```typescript
// Formatage des prix conforme aux normes européennes
export function formatEuropeanPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(price);
}

// Gestion des statuts de commande avec couleurs
export function getOrderStatusDisplayColor(orderStatus: string): string {
  const normalizedStatus = orderStatus.toLowerCase();
  switch (normalizedStatus) {
    case 'confirmée':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'en préparation':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'en livraison':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'livrée':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'annulée':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

// Validation RGPD des données personnelles
export function validateEuropeanPersonalData(data: {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (data.nom && data.nom.length < 2) {
    errors.push('Le nom doit contenir au moins 2 caractères');
  }
  
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Format d\'email invalide');
  }
  
  if (data.telephone && !/^(\+33|0)[1-9](\d{8})$/.test(data.telephone.replace(/\s/g, ''))) {
    errors.push('Format de téléphone français invalide');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

---

## 📱 Responsive Design et Hooks

### `use-mobile.tsx` - Détection mobile
```typescript
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
```

### `useScrollDetection.ts` - Détection de scroll
```typescript
export const useScrollDetection = (threshold: number = 200, hidePrompts: boolean = false) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (hidePrompts) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHasScrolled(scrollPosition > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, hidePrompts]);

  return hasScrolled;
};
```

---

## 🔄 Patterns et Bonnes Pratiques

### Gestion d'Erreurs
```typescript
// Pattern de gestion d'erreurs avec fallbacks
const handleApiCall = async () => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    console.error("Erreur API:", error);
    
    // Toast utilisateur
    toast.error('Une erreur est survenue');
    
    // Fallback par défaut
    return [];
  }
};
```

### Optimisation Performance
```typescript
// Memoization des composants coûteux
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return heavyComputation(data);
  }, [data]);
  
  return <div>{processedData}</div>;
});

// Debounce pour les recherches
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

### Validation TypeScript Stricte
```typescript
// Interfaces strictes pour la sécurité des types
interface Product {
  id: string;                    // Obligatoire
  name: string;                  // Obligatoire
  price: number;                 // Obligatoire
  stock?: number;                // Optionnel
  images?: string[];             // Optionnel
  promotion?: number;            // Optionnel (pourcentage)
  promotionEnd?: string;         // Optionnel (ISO date)
}

// Guards de type pour validation runtime
const isValidProduct = (obj: any): obj is Product => {
  return obj && 
         typeof obj.id === 'string' && 
         typeof obj.name === 'string' && 
         typeof obj.price === 'number';
};
```

---

Cette documentation couvre l'architecture et les patterns principaux du projet Riziky-Boutic, fournissant une base solide pour comprendre et maintenir le code.
