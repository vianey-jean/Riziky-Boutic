
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, X, Star, Share2, Eye } from 'lucide-react';
import { Product } from '@/types/product';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getSecureProductId } from '@/services/secureIds';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const { isAuthenticated } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  if (!product) return null;

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image ? [product.image] : [];

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder.svg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour ajouter un produit au panier");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} ${quantity > 1 ? 'exemplaires ajoutés' : 'exemplaire ajouté'} au panier`);
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour ajouter aux favoris");
      return;
    }
    toggleFavorite(product);
    toast.success(isFavorite(product.id) ? "Retiré des favoris" : "Ajouté aux favoris");
  };

  const isPromotionActive = product.promotion && 
    product.promotionEnd && 
    new Date(product.promotionEnd) > new Date();

  const isInStock = product.isSold && (product.stock === undefined || product.stock > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-0"
        >
          {/* Images */}
          <div className="relative bg-gray-50 p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="relative mb-4">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  src={getImageUrl(productImages[selectedImageIndex])}
                  alt={product.name}
                  className="w-full h-80 object-contain rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </AnimatePresence>
              
              {isPromotionActive && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{product.promotion}%
                </div>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="flex gap-2 justify-center">
                {productImages.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex ? 'border-red-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informations produit */}
          <div className="p-6">
            <DialogHeader className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
                {product.dateAjout && new Date().getTime() - new Date(product.dateAjout).getTime() < 7 * 24 * 60 * 60 * 1000 && (
                  <Badge className="bg-blue-600 text-white text-xs">Nouveau</Badge>
                )}
              </div>
              <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
            </DialogHeader>

            {isPromotionActive ? (
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <p className="text-lg text-gray-500 line-through">
                    {typeof product.originalPrice === 'number'
                      ? product.originalPrice.toFixed(2)
                      : product.price.toFixed(2)}{' '}
                    €
                  </p>
                  <span className="bg-red-600 text-white px-2 py-0.5 text-xs font-bold rounded">
                    -{product.promotion}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {product.price.toFixed(2)} €
                </p>
              </div>
            ) : (
              <p className="text-2xl font-bold mb-4">
                {product.price.toFixed(2)} €
              </p>
            )}

            <div className="mb-4 max-h-24 overflow-y-auto text-sm text-gray-700">
              {product.description}
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-2">
                <p className="font-medium text-sm">Disponibilité:</p>
                <span className={isInStock ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>
                  {isInStock ? 'En stock' : 'Rupture de stock'}
                </span>
              </div>

              {product.stock !== undefined && (
                <p className="text-sm text-gray-600">
                  {product.stock} unité{product.stock !== 1 ? 's' : ''} disponible{product.stock !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="px-3 py-1 text-gray-600 disabled:text-gray-300"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x border-gray-300 min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={product.stock !== undefined && quantity >= product.stock}
                  className="px-3 py-1 text-gray-600 disabled:text-gray-300"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={handleAddToCart} 
                disabled={!isInStock}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Ajouter au panier
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleFavorite}
                className="rounded-full"
              >
                <Heart
                  className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''}`}
                />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const url = window.location.origin + `/${getSecureProductId(product.id, 'product')}`;
                  navigator.clipboard.writeText(url);
                  toast.success("Lien copié!");
                }}
                className="rounded-full"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6 text-center">
              <Button variant="link" asChild>
                <Link to={`/${getSecureProductId(product.id, 'product')}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Voir la page produit
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
