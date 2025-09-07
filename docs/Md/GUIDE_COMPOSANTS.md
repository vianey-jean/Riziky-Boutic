# 🎨 Guide des Composants - Riziky-Boutic

## 📋 Vue d'Ensemble des Composants

Ce guide détaille tous les composants utilisés dans la plateforme Riziky-Boutic, leurs fonctionnalités, propriétés, et exemples d'utilisation. Les composants sont organisés par catégories pour faciliter la navigation et la maintenance.

---

## 🔧 Composants UI de Base (Shadcn/UI)

### Button

Composant bouton réutilisable avec différents variants et tailles.

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'cart' | 'buy';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

// Utilisation
<Button variant="cart" size="lg" onClick={handleAddToCart}>
  <ShoppingCart className="mr-2 h-4 w-4" />
  Ajouter au panier
</Button>

<Button variant="buy" size="default">
  Acheter maintenant
</Button>
```

**Variants disponibles :**
- `default` : Style principal
- `destructive` : Actions destructives (supprimer)
- `outline` : Bordure sans fond
- `secondary` : Style secondaire
- `ghost` : Transparent avec hover
- `link` : Style lien
- `cart` : Style spécial panier (vert)
- `buy` : Style achat immédiat (bleu/violet)

### Input

Composant d'entrée avec validation et états.

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
}

// Utilisation
<Input 
  type="email"
  placeholder="Email"
  error={!!errors.email}
  helperText={errors.email?.message}
/>
```

### QuantitySelector (NOUVEAU)

Composant de sélection de quantité avec validation de stock.

```typescript
interface QuantitySelectorProps {
  productId: string;
  maxStock?: number;
  initialQuantity?: number;
  onQuantityChange: (quantity: number) => void;
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
}

// Utilisation
<QuantitySelector
  productId={product.id}
  maxStock={product.stock}
  initialQuantity={1}
  onQuantityChange={(qty) => setSelectedQuantity(qty)}
  size="default"
  disabled={product.stock === 0}
/>
```

**Fonctionnalités :**
- Boutons +/- avec validation
- Désactivation automatique si stock insuffisant
- Styles visuels différenciés (rouge pour -, vert pour +)
- Tailles multiples (sm, default, lg)
- Validation temps réel du stock

### Card

Composant conteneur avec styles cohérents.

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'filled';
}

// Utilisation
<Card className="p-6">
  <CardHeader>
    <CardTitle>Titre de la carte</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Contenu principal
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Dialog

Composant modal pour dialogues et formulaires.

```typescript
// Utilisation
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Ouvrir dialogue</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Titre du dialogue</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Contenu */}
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Annuler
      </Button>
      <Button onClick={handleConfirm}>Confirmer</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 🛒 Composants E-commerce

### ProductCard

Carte produit avec sélecteur de quantité intégré.

```typescript
interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'featured';
  showQuickView?: boolean;
  showQuantitySelector?: boolean; // NOUVEAU
}

// Utilisation
<ProductCard
  product={product}
  variant="default"
  showQuickView={true}
  showQuantitySelector={true}
/>
```

**Fonctionnalités :**
- Image avec lazy loading
- Badge promotion/rupture de stock
- Sélecteur de quantité intégré
- Boutons d'action (panier, favoris)
- Vue rapide (QuickView)
- Responsive design

**Structure interne :**
```typescript
const ProductCard = ({ product, variant = 'default', showQuantitySelector = true }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { addToCart } = useCart();
  
  const handleAddToCart = async () => {
    await addToCart(product.id, selectedQuantity);
    toast.success(`${selectedQuantity} ${product.name} ajouté(s) au panier`);
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      {/* Image produit */}
      <div className="relative overflow-hidden">
        <OptimizedImage src={product.images[0]} alt={product.name} />
        {product.promotion && <Badge>-{product.promotion}%</Badge>}
      </div>
      
      {/* Informations produit */}
      <CardContent>
        <h3>{product.name}</h3>
        <p className="text-muted-foreground">{product.price}€</p>
        
        {/* Sélecteur de quantité */}
        {showQuantitySelector && (
          <QuantitySelector
            productId={product.id}
            maxStock={product.stock}
            onQuantityChange={setSelectedQuantity}
          />
        )}
      </CardContent>
      
      {/* Actions */}
      <CardFooter>
        <Button 
          variant="cart" 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  );
};
```

### ProductGrid

Grille de produits responsive avec filtres.

```typescript
interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  variant?: 'grid' | 'list';
  showFilters?: boolean;
}

// Utilisation
<ProductGrid
  products={filteredProducts}
  loading={isLoading}
  variant="grid"
  showFilters={true}
/>
```

**Fonctionnalités :**
- Layout responsive (1-5 colonnes selon écran)
- États de chargement avec skeletons
- Mode grille et liste
- Intégration filtres
- Pagination automatique

### CartItemCard

Composant pour les articles du panier.

```typescript
interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  variant?: 'default' | 'compact';
}

// Utilisation
<CartItemCard
  item={cartItem}
  onUpdateQuantity={handleUpdateQuantity}
  onRemove={handleRemoveItem}
  variant="default"
/>
```

**Fonctionnalités :**
- Image produit miniature
- Sélecteur de quantité intégré
- Calcul automatique du sous-total
- Bouton de suppression avec confirmation
- Animation de suppression

### CartSummary

Résumé du panier avec totaux.

```typescript
interface CartSummaryProps {
  items: CartItem[];
  showCheckoutButton?: boolean;
  showPromoCode?: boolean;
  variant?: 'default' | 'compact';
}

// Utilisation
<CartSummary
  items={cartItems}
  showCheckoutButton={true}
  showPromoCode={true}
  variant="default"
/>
```

**Fonctionnalités :**
- Calcul automatique des totaux
- Application codes promo
- Estimation frais de port
- Bouton de commande
- Affichage économies

### QuickViewModal

Modal de vue rapide produit.

```typescript
interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Utilisation
<QuickViewModal
  product={selectedProduct}
  open={isQuickViewOpen}
  onOpenChange={setIsQuickViewOpen}
/>
```

**Fonctionnalités intégrées :**
- Carrousel d'images
- Sélecteur de quantité
- Ajout au panier direct
- Informations détaillées
- Navigation clavier

---

## 🔐 Composants d'Authentification

### PasswordStrengthIndicator

Indicateur de force du mot de passe.

```typescript
interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

// Utilisation
<PasswordStrengthIndicator
  password={password}
  showRequirements={true}
/>
```

**Critères de validation :**
- Longueur minimale (8 caractères)
- Majuscules et minuscules
- Chiffres
- Caractères spéciaux
- Affichage visuel de la force

### LoginForm

Formulaire de connexion sécurisé.

```typescript
interface LoginFormProps {
  onSuccess?: (user: User) => void;
  redirectTo?: string;
}

// Utilisation
<LoginForm
  onSuccess={(user) => navigate('/dashboard')}
  redirectTo="/products"
/>
```

**Fonctionnalités :**
- Validation temps réel
- Gestion des erreurs
- Option "Se souvenir"
- Lien mot de passe oublié
- Protection contre brute force

---

## 🌐 Composants de Navigation

### Navbar

Barre de navigation principale adaptative.

```typescript
interface NavbarProps {
  variant?: 'default' | 'transparent' | 'fixed';
  showSearchBar?: boolean;
  showCartIcon?: boolean;
}

// Utilisation
<Navbar
  variant="fixed"
  showSearchBar={true}
  showCartIcon={true}
/>
```

**Fonctionnalités intégrées :**
- Menu responsive avec burger
- Barre de recherche
- Compteur panier temps réel
- Menu utilisateur/admin
- Indicateurs de notifications
- Mode sombre/clair

**Structure interne :**
```typescript
const Navbar = ({ variant = 'default', showSearchBar = true, showCartIcon = true }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className={cn("sticky top-0 z-50 bg-background/95 backdrop-blur", variants[variant])}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl">
            <img src="/images/Logo/Logo.png" alt="Riziky-Boutic" className="h-8" />
          </Link>

          {/* Barre de recherche */}
          {showSearchBar && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <AdvancedSearchBar />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Panier */}
            {showCartIcon && (
              <Button variant="ghost" size="icon" asChild>
                <Link to="/cart" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Link>
              </Button>
            )}

            {/* Menu utilisateur */}
            {isAuthenticated ? (
              <UserMenu user={user} onLogout={logout} />
            ) : (
              <Button asChild>
                <Link to="/login">Connexion</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
```

### CategoriesDropdown

Menu déroulant des catégories.

```typescript
interface CategoriesDropdownProps {
  categories: Category[];
  variant?: 'dropdown' | 'mega-menu';
}

// Utilisation
<CategoriesDropdown
  categories={categories}
  variant="mega-menu"
/>
```

### Footer

Pied de page avec liens et informations.

```typescript
interface FooterProps {
  variant?: 'default' | 'minimal';
  showNewsletter?: boolean;
}

// Utilisation
<Footer
  variant="default"
  showNewsletter={true}
/>
```

---

## 💬 Composants Chat (NOUVEAU)

### LiveChatWidget

Widget de chat en temps réel.

```typescript
interface LiveChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
  autoOpen?: boolean;
}

// Utilisation
<LiveChatWidget
  position="bottom-right"
  theme="light"
  autoOpen={false}
/>
```

### ClientServiceChatWidget

Interface de chat côté client.

```typescript
interface ClientServiceChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  userId?: string;
}

// Utilisation
<ClientServiceChatWidget
  isOpen={isChatOpen}
  onToggle={() => setIsChatOpen(!isChatOpen)}
  userId={user?.id}
/>
```

**Fonctionnalités :**
- Messages temps réel via WebSocket
- Upload de fichiers/images
- Enregistrement vocal
- Indicateurs de frappe
- États de lecture
- Historique des conversations

### AdminServiceChatWidget

Interface de chat côté administration.

```typescript
interface AdminServiceChatWidgetProps {
  conversations: Conversation[];
  activeConversation?: string;
  onConversationSelect: (id: string) => void;
}

// Utilisation
<AdminServiceChatWidget
  conversations={conversations}
  activeConversation={activeConversationId}
  onConversationSelect={setActiveConversation}
/>
```

### VoiceRecorder

Composant d'enregistrement vocal pour le chat.

```typescript
interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  maxDuration?: number; // en secondes
}

// Utilisation
<VoiceRecorder
  onRecordingComplete={handleAudioMessage}
  maxDuration={120}
/>
```

### FileUploadButton

Bouton d'upload de fichiers pour le chat.

```typescript
interface FileUploadButtonProps {
  onFileSelect: (files: FileList) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  maxSizePerFile?: number; // en bytes
}

// Utilisation
<FileUploadButton
  onFileSelect={handleFileUpload}
  acceptedTypes={['image/*', 'application/pdf']}
  maxFiles={5}
  maxSizePerFile={10 * 1024 * 1024} // 10MB
/>
```

---

## 🛡️ Composants de Sécurité

### ProtectedRoute

Route protégée par authentification.

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  adminOnly?: boolean;
}

// Utilisation
<ProtectedRoute requireAdmin={true}>
  <AdminDashboard />
</ProtectedRoute>
```

### SecureRoute

Route avec validation d'IDs sécurisés.

```typescript
interface SecureRouteProps {
  children: React.ReactNode;
}

// Utilisation
<SecureRoute>
  <ProductDetail />
</SecureRoute>
```

**Fonctionnalités :**
- Validation automatique des IDs obfusqués
- Redirection vers 404 si ID invalide
- Messages d'erreur sécurisés
- État de chargement pendant validation

---

## 📱 Composants Layout et UI

### Layout

Layout principal de l'application.

```typescript
interface LayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'admin' | 'minimal';
  showHeader?: boolean;
  showFooter?: boolean;
}

// Utilisation
<Layout variant="default" showHeader={true} showFooter={true}>
  <HomePage />
</Layout>
```

### HeroSection

Section héros réutilisable.

```typescript
interface HeroSectionProps {
  title: string;
  description?: string;
  backgroundImage?: string;
  variant?: 'default' | 'gradient' | 'minimal';
  actions?: React.ReactNode;
  icon?: LucideIcon;
}

// Utilisation
<HeroSection
  title="Tous nos Produits"
  description="Découvrez notre collection complète"
  variant="gradient"
  icon={TrendingUp}
  actions={
    <Button variant="cart" size="lg">
      Voir le catalogue
    </Button>
  }
/>
```

### LoadingSpinner

Composant de chargement.

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'dots' | 'bars';
  text?: string;
}

// Utilisation
<LoadingSpinner
  size="lg"
  variant="dots"
  text="Chargement des produits..."
/>
```

### ScrollToTop

Bouton de retour en haut de page.

```typescript
interface ScrollToTopProps {
  showAfter?: number; // pixels
  position?: 'bottom-right' | 'bottom-left';
}

// Utilisation
<ScrollToTop showAfter={500} position="bottom-right" />
```

---

## 🔧 Composants Utilitaires

### PageDataLoader

Composant de chargement de données avec retry.

```typescript
interface PageDataLoaderProps<T> {
  fetchFunction: () => Promise<T>;
  onSuccess: (data: T) => void;
  onMaxRetriesReached: () => void;
  loadingMessage?: string;
  loadingSubmessage?: string;
  errorMessage?: string;
  maxRetries?: number;
  retryDelay?: number;
  children: React.ReactNode;
}

// Utilisation
<PageDataLoader
  fetchFunction={fetchProducts}
  onSuccess={setProducts}
  onMaxRetriesReached={() => setProducts([])}
  loadingMessage="Chargement des produits..."
  maxRetries={3}
>
  <ProductGrid products={products} />
</PageDataLoader>
```

### ErrorBoundary

Gestionnaire global d'erreurs React.

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

// Utilisation
<ErrorBoundary
  fallback={CustomErrorFallback}
  onError={(error, errorInfo) => {
    logger.error('React Error:', { error, errorInfo });
  }}
>
  <App />
</ErrorBoundary>
```

---

## 📊 Composants Analytics et Feedback

### TrustIndicators

Indicateurs de confiance (avis, sécurité, etc.).

```typescript
interface TrustIndicatorsProps {
  showReviews?: boolean;
  showSecurity?: boolean;
  showShipping?: boolean;
  variant?: 'horizontal' | 'vertical';
}

// Utilisation
<TrustIndicators
  showReviews={true}
  showSecurity={true}
  showShipping={true}
  variant="horizontal"
/>
```

### SalesNotification

Notifications d'achat en temps réel.

```typescript
interface SalesNotificationProps {
  enabled?: boolean;
  position?: 'top' | 'bottom';
  duration?: number;
}

// Utilisation
<SalesNotification
  enabled={true}
  position="bottom"
  duration={5000}
/>
```

### ReviewForm

Formulaire d'avis avec photos.

```typescript
interface ReviewFormProps {
  productId: string;
  onSubmit: (review: Review) => void;
  allowPhotos?: boolean;
  maxPhotos?: number;
}

// Utilisation
<ReviewForm
  productId={product.id}
  onSubmit={handleReviewSubmit}
  allowPhotos={true}
  maxPhotos={4}
/>
```

---

## 🎯 Patterns d'Utilisation

### Composants Composés

```typescript
// Pattern de composition pour flexibilité
const ProductCard = ({
  product,
  children,
  ...props
}) => {
  return (
    <Card {...props}>
      <ProductCard.Image product={product} />
      <ProductCard.Content product={product}>
        {children}
      </ProductCard.Content>
      <ProductCard.Actions product={product} />
    </Card>
  );
};

ProductCard.Image = ({ product }) => (
  <div className="relative overflow-hidden">
    <OptimizedImage src={product.images[0]} alt={product.name} />
    {product.promotion && <Badge>Promo</Badge>}
  </div>
);

ProductCard.Content = ({ product, children }) => (
  <CardContent>
    <h3>{product.name}</h3>
    <p>{product.price}€</p>
    {children}
  </CardContent>
);

ProductCard.Actions = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  return (
    <CardFooter>
      <QuantitySelector onQuantityChange={setQuantity} />
      <Button onClick={() => addToCart(product.id, quantity)}>
        Ajouter
      </Button>
    </CardFooter>
  );
};

// Utilisation flexible
<ProductCard product={product}>
  <QuantitySelector maxStock={product.stock} />
  <Button variant="cart">Ajouter au panier</Button>
</ProductCard>
```

### Hooks Intégrés

```typescript
// Hooks spécialisés pour composants
const useProductCard = (product: Product) => {
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const { addToCart, isInCart: checkInCart } = useCart();

  useEffect(() => {
    setIsInCart(checkInCart(product.id));
  }, [product.id, checkInCart]);

  const handleAddToCart = useCallback(async () => {
    await addToCart(product.id, quantity);
    setIsInCart(true);
    toast.success(`${product.name} ajouté au panier`);
  }, [product.id, quantity, addToCart]);

  return {
    quantity,
    setQuantity,
    isInCart,
    handleAddToCart,
    canAddToCart: product.stock > 0 && quantity <= product.stock
  };
};
```

---

## 🎨 Customisation et Thèmes

### Variables CSS Personnalisables

```css
/* Customisation des composants via CSS variables */
.product-card {
  --card-border-radius: var(--radius);
  --card-shadow: var(--shadow-card);
  --card-hover-shadow: var(--shadow-elegant);
  --transition: var(--transition-smooth);
}

.quantity-selector {
  --button-size: 2.5rem;
  --button-color-decrease: var(--destructive);
  --button-color-increase: var(--success);
  --number-font-weight: 600;
}
```

### Configuration de Thème

```typescript
// Configuration centralisée des thèmes
const themeConfig = {
  components: {
    Button: {
      variants: {
        cart: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
        buy: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
      }
    },
    ProductCard: {
      variants: {
        default: 'border-border hover:shadow-lg',
        featured: 'border-primary shadow-md hover:shadow-xl'
      }
    }
  }
};
```

---

Ce guide fournit une documentation complète de tous les composants de la plateforme. Chaque composant est conçu pour être réutilisable, accessible, et facilement customisable selon les besoins du projet.