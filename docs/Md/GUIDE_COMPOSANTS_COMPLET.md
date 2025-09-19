# 🧩 Guide des Composants - Riziky-Boutic

## 📋 Table des Matières
- [Système de Design](#système-de-design)
- [Composants UI de Base](#composants-ui-de-base)
- [Composants Métier](#composants-métier)
- [Patterns et Conventions](#patterns-et-conventions)
- [Hooks Personnalisés](#hooks-personnalisés)
- [Guides d'utilisation](#guides-dutilisation)

## 🎨 Système de Design

### Structure du Design System
```
src/components/ui/
├── accordion.tsx            # Accordéons pliables
├── alert-dialog.tsx         # Dialogues d'alerte
├── alert.tsx               # Alertes informatives
├── aspect-ratio.tsx        # Gestion ratios d'aspect
├── avatar.tsx              # Avatars utilisateurs
├── badge.tsx               # Badges et labels
├── breadcrumb.tsx          # Navigation en fil d'Ariane
├── button.tsx              # Boutons avec variants
├── calendar.tsx            # Calendrier date picker
├── card.tsx                # Cartes conteneurs
├── carousel.tsx            # Carrousels d'images
├── category-badge.tsx      # Badges catégories spécialisés
├── chart.tsx               # Graphiques et charts
├── checkbox.tsx            # Cases à cocher
├── collapsible.tsx         # Contenus pliables
├── command.tsx             # Interface commandes
├── context-menu.tsx        # Menus contextuels
├── dialog.tsx              # Dialogues modaux
├── drawer.tsx              # Tiroirs latéraux
├── dropdown-menu.tsx       # Menus déroulants
├── form.tsx                # Composants formulaires
├── hover-card.tsx          # Cartes au survol
├── input-otp.tsx           # Saisie codes OTP
├── input.tsx               # Champs de saisie
├── label.tsx               # Labels formulaires
├── loading-spinner.tsx     # Indicateurs chargement
├── luxury-button.tsx       # Boutons premium
├── luxury-card.tsx         # Cartes premium
├── menubar.tsx             # Barres de menu
├── navigation-menu.tsx     # Menus navigation
├── pagination.tsx          # Pagination résultats
├── popover.tsx             # Popovers informatifs
├── progress.tsx            # Barres de progression
├── quantity-selector.tsx   # Sélecteur quantité
├── radio-group.tsx         # Groupes radio
├── resizable.tsx           # Panneaux redimensionnables
├── scroll-area.tsx         # Zones défilement
├── select.tsx              # Listes déroulantes
├── separator.tsx           # Séparateurs visuels
├── sheet.tsx               # Panneaux latéraux
├── sidebar.tsx             # Barres latérales
├── skeleton.tsx            # Squelettes chargement
├── slider.tsx              # Curseurs valeurs
├── sonner.tsx              # Notifications toast
├── switch.tsx              # Interrupteurs
├── table.tsx               # Tableaux données
├── tabs.tsx                # Onglets navigation
├── textarea.tsx            # Zones texte multiligne
├── toast.tsx               # Notifications
├── toaster.tsx             # Gestionnaire toasts
├── toggle-group.tsx        # Groupes boutons toggle
├── toggle.tsx              # Boutons toggle
├── tooltip.tsx             # Infobulles
└── use-toast.ts            # Hook notifications
```

### Configuration Tailwind avec tokens sémantiques
```css
/* index.css - Variables CSS personnalisées */
:root {
  /* Colors - Palette principale */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  --radius: 0.5rem;

  /* Custom design tokens */
  --gradient-primary: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-foreground)));
  --shadow-luxury: 0 25px 50px -12px hsl(var(--primary) / 0.25);
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... autres variables dark mode */
}
```

### Utilitaire de classes
```typescript
// lib/ecommerce-utils.ts - Utilitaires avec types stricts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine et merge les classes Tailwind CSS
 * Évite les conflits et optimise les classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate un prix en euros avec devise
 * @param price - Prix en centimes ou euros
 * @param showCurrency - Afficher le symbole €
 */
export function formatEuropeanPrice(price: number, showCurrency = true): string {
  const formattedPrice = (price / 100).toFixed(2).replace('.', ',');
  return showCurrency ? `${formattedPrice} €` : formattedPrice;
}

/**
 * Formate une date au format français
 * @param date - Date à formatter
 * @param includeTime - Inclure l'heure
 */
export function formatEuropeanDate(date: string | Date, includeTime = false): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  return dateObj.toLocaleDateString('fr-FR', options);
}
```

## 🔘 Composants UI de Base

### Button Component
```tsx
// components/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Variants de boutons avec design system cohérent
 * Chaque variant suit les tokens de couleur définis
 */
const buttonVariants = cva(
  // Classes de base communes à tous les boutons
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Bouton principal - couleur primary
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        // Bouton destructeur - couleur destructive
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // Bouton contour - border avec couleurs sémantiques
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        // Bouton secondaire - couleur secondary
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // Bouton fantôme - transparent avec hover
        ghost: "hover:bg-accent hover:text-accent-foreground",
        // Bouton lien - style texte souligné
        link: "text-primary underline-offset-4 hover:underline",
        // Bouton premium avec gradient
        luxury: "bg-gradient-to-r from-primary to-primary-foreground text-white hover:shadow-lg hover:scale-105 transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/**
 * Composant Button réutilisable
 * - Supporte tous les variants du design system
 * - Compatible avec Radix UI Slot pour composition
 * - Types TypeScript stricts
 * - Accessibilité intégrée
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

### Input Component
```tsx
// components/ui/input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

/**
 * Composant Input avec support erreurs et labels
 * - Validation visuelle intégrée
 * - Support texte d'aide
 * - States focus/error/disabled
 * - Accessibilité (aria-labels, ids)
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, helperText, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    return (
      <div className="space-y-2">
        {/* Label optionnel */}
        {label && (
          <label 
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        
        {/* Champ de saisie */}
        <input
          type={type}
          id={inputId}
          className={cn(
            // Classes de base
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            // États interactifs
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            // État erreur avec couleur destructive
            hasError && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${inputId}-error` : 
            helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        
        {/* Message d'erreur */}
        {error && (
          <p 
            id={`${inputId}-error`}
            className="text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
        
        {/* Texte d'aide */}
        {helperText && !error && (
          <p 
            id={`${inputId}-helper`}
            className="text-sm text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
```

### Quantity Selector Component
```tsx
// components/ui/quantity-selector.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  maxStock?: number;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
}

/**
 * Sélecteur de quantité avec contrôles +/-
 * - Respect des limites de stock
 * - États disabled/loading
 * - Variants de taille
 * - Couleurs sémantiques (rouge pour -, vert pour +)
 * - Accessibilité (aria-labels, keyboard navigation)
 */
const QuantitySelector = ({ 
  quantity, 
  onQuantityChange, 
  maxStock, 
  disabled = false,
  size = 'default'
}: QuantitySelectorProps) => {
  // Handlers avec validation des limites
  const handleDecrease = () => {
    if (quantity > 1 && !disabled) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (!disabled && (maxStock === undefined || quantity < maxStock)) {
      onQuantityChange(quantity + 1);
    }
  };

  // Classes responsives selon la taille
  const buttonSizeClasses = {
    sm: 'h-6 w-6',
    default: 'h-8 w-8', 
    lg: 'h-10 w-10'
  };

  const textSizeClasses = {
    sm: 'text-sm px-2',
    default: 'text-base px-3',
    lg: 'text-lg px-4'
  };

  return (
    <div className="flex items-center space-x-1 bg-background border rounded-lg">
      {/* Bouton diminuer - couleur rouge sémantique */}
      <Button
        variant="ghost"
        size="icon"
        className={`${buttonSizeClasses[size]} hover:bg-red-100 text-red-600 font-bold dark:hover:bg-red-900/20`}
        onClick={handleDecrease}
        disabled={disabled || quantity <= 1}
        aria-label="Diminuer la quantité"
      >
        <Minus className="h-4 w-4" />
      </Button>

      {/* Affichage quantité actuelle */}
      <div
        className={`${textSizeClasses[size]} font-bold text-center min-w-[2rem] flex items-center justify-center`}
        role="status"
        aria-label={`Quantité: ${quantity}`}
      >
        {quantity}
      </div>

      {/* Bouton augmenter - couleur verte sémantique */}
      <Button
        variant="ghost"
        size="icon"
        className={`${buttonSizeClasses[size]} hover:bg-green-100 text-green-600 font-bold dark:hover:bg-green-900/20`}
        onClick={handleIncrease}
        disabled={disabled || (maxStock !== undefined && quantity >= maxStock)}
        aria-label="Augmenter la quantité"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default QuantitySelector;
```

## 🛒 Composants Métier

### ProductCard Component
```tsx
// components/products/ProductCard.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, formatEuropeanPrice } from '@/lib/utils';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
  onQuickView?: (product: Product) => void;
  isFavorite?: boolean;
  isCompact?: boolean;
  className?: string;
}

/**
 * Carte produit avec toutes les interactions e-commerce
 * - Affichage prix, images, notes, promotions
 * - Actions: panier, favoris, vue rapide
 * - Animations et transitions fluides
 * - Responsive design
 * - États loading et disabled
 */
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  onQuickView,
  isFavorite = false,
  isCompact = false,
  className
}) => {
  // État local pour les interactions
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const [imageError, setImageError] = React.useState(false);

  // Calculs de prix et promotions
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  // Animation variants pour les transitions
  const cardVariants = {
    initial: { scale: 1, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" },
    hover: { 
      scale: 1.02, 
      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
      transition: { duration: 0.2 }
    }
  };

  const imageVariants = {
    loading: { opacity: 0.6 },
    loaded: { opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      className={cn("group cursor-pointer", className)}
    >
      <Card className="h-full overflow-hidden bg-card hover:shadow-luxury transition-all duration-300">
        {/* Image container avec overlay actions */}
        <div className="relative aspect-square overflow-hidden">
          {/* Image principale */}
          <motion.img
            src={product.images?.[0] || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover"
            variants={imageVariants}
            initial="loading"
            animate={isImageLoading ? "loading" : "loaded"}
            onLoad={() => setIsImageLoading(false)}
            onError={() => {
              setImageError(true);
              setIsImageLoading(false);
            }}
          />

          {/* Badges promotions */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <Badge variant="destructive" className="text-xs font-bold">
                -{discountPercentage}%
              </Badge>
            )}
            {product.isNew && (
              <Badge variant="secondary" className="text-xs">
                Nouveau
              </Badge>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <Badge variant="outline" className="text-xs text-orange-600">
                Stock limité
              </Badge>
            )}
          </div>

          {/* Actions overlay - visible au hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* Bouton favoris */}
              <Button
                size="icon"
                variant="ghost"
                className="bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite?.(product.id);
                }}
                aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Heart 
                  className={cn(
                    "h-4 w-4",
                    isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                  )}
                />
              </Button>

              {/* Bouton vue rapide */}
              <Button
                size="icon"
                variant="ghost"
                className="bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView?.(product);
                }}
                aria-label="Vue rapide"
              >
                <Eye className="h-4 w-4 text-gray-600" />
              </Button>
            </div>

            {/* Bouton d'action principal - centré */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size={isCompact ? "sm" : "default"}
                className="shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart?.(product);
                }}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.stock === 0 ? 'Rupture' : 'Ajouter au panier'}
              </Button>
            </div>
          </div>
        </div>

        {/* Contenu carte */}
        <CardContent className={cn("p-4", isCompact && "p-3")}>
          {/* Nom du produit */}
          <h3 className={cn(
            "font-semibold text-foreground line-clamp-2 mb-2",
            isCompact ? "text-sm" : "text-base"
          )}>
            {product.name}
          </h3>

          {/* Catégorie */}
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
            {product.category}
          </p>

          {/* Note et avis */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < Math.floor(product.rating!)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Prix */}
          <div className="flex items-center gap-2 mb-3">
            <span className={cn(
              "font-bold text-primary",
              isCompact ? "text-lg" : "text-xl"
            )}>
              {formatEuropeanPrice(product.price)}
            </span>
            
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatEuropeanPrice(product.originalPrice!)}
              </span>
            )}
          </div>

          {/* Actions rapides mobile */}
          <div className="flex gap-2 md:hidden">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onAddToCart?.(product)}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {product.stock === 0 ? 'Rupture' : 'Panier'}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onToggleFavorite?.(product.id)}
            >
              <Heart 
                className={cn(
                  "h-4 w-4",
                  isFavorite ? "fill-red-500 text-red-500" : ""
                )}
              />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
```

### CartItemCard Component
```tsx
// components/cart/CartItemCard.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QuantitySelector from '@/components/ui/quantity-selector';
import { Trash2, Heart } from 'lucide-react';
import { cn, formatEuropeanPrice } from '@/lib/utils';
import { CartItem } from '@/types/cart';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onMoveToFavorites?: (productId: string) => void;
  isUpdating?: boolean;
  className?: string;
}

/**
 * Carte d'article dans le panier
 * - Gestion quantité avec QuantitySelector
 * - Actions: supprimer, déplacer vers favoris
 * - Calculs de prix automatiques
 * - États de chargement
 * - Design responsive
 */
const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
  onMoveToFavorites,
  isUpdating = false,
  className
}) => {
  // Calculs de prix
  const itemTotal = item.price * item.quantity;
  const hasDiscount = item.originalPrice && item.originalPrice > item.price;
  const discountAmount = hasDiscount 
    ? (item.originalPrice! - item.price) * item.quantity
    : 0;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Image produit */}
          <div className="flex-shrink-0">
            <img
              src={item.image || '/placeholder-product.jpg'}
              alt={item.name}
              className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md"
            />
          </div>

          {/* Informations produit */}
          <div className="flex-grow min-w-0">
            {/* Header avec nom et bouton supprimer */}
            <div className="flex justify-between items-start mb-2">
              <div className="min-w-0 flex-grow">
                <h3 className="font-semibold text-base text-foreground line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.category}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex gap-1 ml-2">
                {/* Déplacer vers favoris */}
                {onMoveToFavorites && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => onMoveToFavorites(item.productId)}
                    disabled={isUpdating}
                    aria-label="Déplacer vers les favoris"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                )}
                
                {/* Supprimer */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => onRemoveItem(item.productId)}
                  disabled={isUpdating}
                  aria-label="Supprimer du panier"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Prix et quantité */}
            <div className="flex justify-between items-end">
              {/* Section prix */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-primary">
                    {formatEuropeanPrice(item.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatEuropeanPrice(item.originalPrice!)}
                    </span>
                  )}
                </div>
                
                {/* Total pour cet article */}
                <div className="text-sm">
                  <span className="text-muted-foreground">Total: </span>
                  <span className="font-semibold text-foreground">
                    {formatEuropeanPrice(itemTotal)}
                  </span>
                  {discountAmount > 0 && (
                    <span className="text-green-600 ml-2">
                      (-{formatEuropeanPrice(discountAmount)})
                    </span>
                  )}
                </div>
              </div>

              {/* Sélecteur de quantité */}
              <div className="flex flex-col items-end gap-2">
                <QuantitySelector
                  quantity={item.quantity}
                  onQuantityChange={(newQuantity) => 
                    onUpdateQuantity(item.productId, newQuantity)
                  }
                  maxStock={item.maxStock}
                  disabled={isUpdating}
                  size="sm"
                />
                
                {/* Indication stock */}
                {item.maxStock && item.maxStock <= 10 && (
                  <p className="text-xs text-orange-600">
                    Plus que {item.maxStock} en stock
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Loading overlay */}
        {isUpdating && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CartItemCard;
```

## 🎣 Hooks Personnalisés

### useCart Hook
```tsx
// hooks/useCart.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cartAPI } from '@/services/cartAPI';
import { toast } from '@/hooks/use-toast';
import { CartItem, Cart } from '@/types/cart';
import { Product } from '@/types/product';

/**
 * Hook personnalisé pour la gestion du panier
 * - État synchronisé avec le serveur
 * - Persistance locale pour invités
 * - Gestion optimiste des mises à jour
 * - Notifications automatiques
 * - Types TypeScript stricts
 */
export const useCart = () => {
  // États
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isAuthenticated } = useAuth();

  // Charger le panier au montage
  useEffect(() => {
    loadCart();
  }, [isAuthenticated, user]);

  /**
   * Charger le panier depuis le serveur ou localStorage
   */
  const loadCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (isAuthenticated && user) {
        // Utilisateur connecté - charger depuis le serveur
        const response = await cartAPI.getCart(user.id);
        setCart(response.data);
      } else {
        // Invité - charger depuis localStorage
        const localCart = localStorage.getItem('guest_cart');
        if (localCart) {
          setCart(JSON.parse(localCart));
        } else {
          setCart({
            id: 'guest',
            userId: 'guest',
            items: [],
            totalItems: 0,
            totalPrice: 0,
            currency: 'EUR'
          });
        }
      }
    } catch (err) {
      setError('Erreur lors du chargement du panier');
      console.error('Cart loading error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  /**
   * Ajouter un produit au panier
   */
  const addToCart = useCallback(async (product: Product, quantity: number = 1) => {
    try {
      setIsLoading(true);
      
      // Mise à jour optimiste
      const optimisticItem: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images?.[0],
        category: product.category,
        quantity,
        maxStock: product.stock
      };

      setCart(prevCart => {
        if (!prevCart) return null;
        
        const existingItemIndex = prevCart.items.findIndex(
          item => item.productId === product.id
        );

        let newItems;
        if (existingItemIndex >= 0) {
          // Augmenter la quantité
          newItems = [...prevCart.items];
          newItems[existingItemIndex].quantity += quantity;
        } else {
          // Ajouter nouveau produit
          newItems = [...prevCart.items, optimisticItem];
        }

        return {
          ...prevCart,
          items: newItems,
          totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
      });

      // Appel API
      if (isAuthenticated && user) {
        await cartAPI.addItem(user.id, product.id, quantity);
      } else {
        // Sauver en localStorage pour invités
        const updatedCart = cart;
        if (updatedCart) {
          localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
        }
      }

      toast({
        title: "Produit ajouté",
        description: `${product.name} a été ajouté à votre panier`,
      });

    } catch (err) {
      // Revert optimistic update
      loadCart();
      setError('Erreur lors de l\'ajout au panier');
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit au panier",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [cart, isAuthenticated, user, loadCart]);

  /**
   * Mettre à jour la quantité d'un produit
   */
  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity < 1) return;

    try {
      setIsLoading(true);

      // Mise à jour optimiste
      setCart(prevCart => {
        if (!prevCart) return null;

        const newItems = prevCart.items.map(item =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        );

        return {
          ...prevCart,
          items: newItems,
          totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
      });

      // Appel API
      if (isAuthenticated && user) {
        await cartAPI.updateQuantity(user.id, productId, quantity);
      } else {
        const updatedCart = cart;
        if (updatedCart) {
          localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
        }
      }

    } catch (err) {
      loadCart();
      setError('Erreur lors de la mise à jour');
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [cart, isAuthenticated, user, loadCart]);

  /**
   * Supprimer un produit du panier
   */
  const removeFromCart = useCallback(async (productId: string) => {
    try {
      setIsLoading(true);

      // Mise à jour optimiste
      setCart(prevCart => {
        if (!prevCart) return null;

        const newItems = prevCart.items.filter(item => item.productId !== productId);

        return {
          ...prevCart,
          items: newItems,
          totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
      });

      // Appel API
      if (isAuthenticated && user) {
        await cartAPI.removeItem(user.id, productId);
      } else {
        const updatedCart = cart;
        if (updatedCart) {
          localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
        }
      }

      toast({
        title: "Produit supprimé",
        description: "Le produit a été retiré de votre panier",
      });

    } catch (err) {
      loadCart();
      setError('Erreur lors de la suppression');
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [cart, isAuthenticated, user, loadCart]);

  /**
   * Vider le panier
   */
  const clearCart = useCallback(async () => {
    try {
      setIsLoading(true);

      if (isAuthenticated && user) {
        await cartAPI.clearCart(user.id);
      } else {
        localStorage.removeItem('guest_cart');
      }

      setCart({
        id: isAuthenticated ? user!.id : 'guest',
        userId: isAuthenticated ? user!.id : 'guest',
        items: [],
        totalItems: 0,
        totalPrice: 0,
        currency: 'EUR'
      });

      toast({
        title: "Panier vidé",
        description: "Tous les produits ont été supprimés",
      });

    } catch (err) {
      setError('Erreur lors du vidage du panier');
      toast({
        title: "Erreur",
        description: "Impossible de vider le panier",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Méthodes utilitaires
  const getItemCount = useCallback((productId: string): number => {
    const item = cart?.items.find(item => item.productId === productId);
    return item?.quantity || 0;
  }, [cart]);

  const isInCart = useCallback((productId: string): boolean => {
    return getItemCount(productId) > 0;
  }, [getItemCount]);

  return {
    // État
    cart,
    isLoading,
    error,
    
    // Méthodes
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loadCart,
    
    // Utilitaires
    getItemCount,
    isInCart,
    
    // Statistiques
    totalItems: cart?.totalItems || 0,
    totalPrice: cart?.totalPrice || 0,
    itemsCount: cart?.items.length || 0,
  };
};
```

## 📝 Patterns et Conventions

### Convention de nommage
```typescript
// Noms de composants en PascalCase
const ProductCard = () => {};
const CartItemList = () => {};

// Noms de hooks en camelCase avec préfixe "use"
const useCart = () => {};
const useProductFilters = () => {};

// Noms de types en PascalCase
interface Product {}
type CartItem = {};

// Noms de constantes en UPPER_SNAKE_CASE
const API_BASE_URL = '';
const MAX_ITEMS_PER_PAGE = 20;

// Noms de fichiers en kebab-case
// product-card.tsx
// cart-item-list.tsx
```

### Structure de composant standardisée
```tsx
// Template de composant avec toutes les bonnes pratiques
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

// 1. Interface props avec documentation
interface ComponentProps {
  /** Description de la prop */
  title: string;
  /** Prop optionnelle avec valeur par défaut */
  variant?: 'default' | 'compact';
  /** Callback avec types stricts */
  onAction?: (data: SomeType) => void;
  /** Props standards HTML */
  className?: string;
  children?: React.ReactNode;
}

// 2. Composant avec forwardRef si nécessaire
const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ title, variant = 'default', onAction, className, children, ...props }, ref) => {
    // 3. États locaux
    const [isLoading, setIsLoading] = useState(false);
    
    // 4. Hooks personnalisés
    const { data, error } = useCustomHook();
    
    // 5. Callbacks mémorisés
    const handleClick = useCallback(() => {
      onAction?.(data);
    }, [onAction, data]);
    
    // 6. Effects
    useEffect(() => {
      // Side effects
    }, []);
    
    // 7. Rendu conditionnel précoce
    if (error) return <ErrorComponent />;
    
    // 8. Rendu principal
    return (
      <div
        ref={ref}
        className={cn(
          "base-classes",
          variant === 'compact' && "compact-classes",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// 9. Display name pour debug
Component.displayName = 'Component';

// 10. Export par défaut
export default Component;
```

---

*Guide des composants maintenu à jour avec les dernières pratiques*