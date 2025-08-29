import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, ShoppingCart, Check, Truck, ArrowLeft, Share2, Shield, Clock } from 'lucide-react';
import FeaturedProductsSlider from '@/components/products/FeaturedProductsSlider';
import ProductReviews from '@/components/reviews/ProductReviews';
import { getRealId, isValidSecureId, getEntityType } from '@/services/secureIds';
import { toast } from '@/components/ui/sonner';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

const ProductDetail = () => {
  const { productId: secureProductId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { products, addToCart, toggleFavorite, isFavorite } = useStore();
  const { isAuthenticated } = useAuth();
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const PLACEHOLDER_IMAGE = '/placeholder.svg';
  
  // ID réel
  const productId = secureProductId ? getRealId(secureProductId) : undefined;
  
  const [product, setProduct] = useState(products.find(p => p.id === productId));
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [isValidId, setIsValidId] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (!secureProductId) {
      setIsValidId(false);
      toast.error("Produit non trouvé");
      navigate('/page/notfound', { replace: true });
      return;
    }
    
    const isValid = isValidSecureId(secureProductId);
    const entityType = getEntityType(secureProductId);
    
    if (!isValid) {
      setIsValidId(false);
      toast.error("Ce lien n'est plus valide");
      navigate('/page/notfound', { replace: true });
    } else {
      const foundProduct = products.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setIsValidId(true);
      } else {
        setIsValidId(false);
        toast.error("Produit introuvable");
        navigate('/page/notfound', { replace: true });
      }
    }
    setIsLoading(false);
  }, [secureProductId, productId, products, navigate]);

  useEffect(() => {
    if (product && product.promotion && product.promotionEnd) {
      const updateRemainingTime = () => {
        const end = new Date(product.promotionEnd!);
        const now = new Date();
        const diffInMs = end.getTime() - now.getTime();
        
        if (diffInMs <= 0) {
          setRemainingTime("Promotion expirée");
          return;
        }
        
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffInMins = Math.floor((diffInMs % (1000 * 60)) / (1000 * 60));
        const diffInSecs = Math.floor((diffInMs % (1000 * 60)) / 1000);

        if (diffInDays > 0) {
          setRemainingTime(`${diffInDays}j ${diffInHours}h ${diffInMins}m ${diffInSecs}s`);
        } else {
          setRemainingTime(`${diffInHours}h ${diffInMins}m ${diffInSecs}s`);
        }
      };
      
      updateRemainingTime();
      const interval = setInterval(updateRemainingTime, 1000);
      return () => clearInterval(interval);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const productImages =
      product.images && product.images.length > 0
        ? product.images
        : product.image
          ? [product.image]
          : [];

    if (productImages.length > 1) {
      const interval = setInterval(() => {
        setSelectedImageIndex(prev =>
          (prev + 1) % productImages.length
        );
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [product]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && (product?.stock === undefined || newQuantity <= product.stock)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour ajouter un produit au panier", {
        style: { backgroundColor: '#EF4444', color: 'white', fontWeight: 'bold' },
        duration: 4000,
        position: 'top-center',
      });
      return;
    }

    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      setAddedToCart(true);
      toast.success(`${quantity} ${quantity > 1 ? 'exemplaires' : 'exemplaire'} ajouté${quantity > 1 ? 's' : ''} au panier`);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10">
          {/* Skeleton de chargement */}
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1">
              <Skeleton className="w-full h-[400px] rounded-xl mb-4" />
              <div className="flex justify-center space-x-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="w-20 h-20 rounded-md" />
                ))}
              </div>
            </div>
            <div className="flex-1">
              <Skeleton className="w-3/4 h-8 mb-3" />
              <Skeleton className="w-1/2 h-6 mb-6" />
              <Skeleton className="w-1/4 h-5 mb-8" />
              <Skeleton className="w-full h-32 mb-6" />
              <div className="flex space-x-4">
                <Skeleton className="w-1/3 h-10" />
                <Skeleton className="w-1/3 h-10" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isValidId || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-6">Produit non trouvé</h1>
          <p className="mb-8 text-gray-600 max-w-md mx-auto">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button asChild>
            <a href="/">Retour à l'accueil</a>
          </Button>
        </div>
      </Layout>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 8);

  const isProductFavorite = productId ? isFavorite(productId) : false;
  const isPromotionActive = product.promotion && 
    product.promotionEnd && 
    new Date(product.promotionEnd) > new Date();
  const isInStock = product.isSold && (product.stock === undefined || product.stock > 0);

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];
        
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return PLACEHOLDER_IMAGE;
    if (imagePath.startsWith('http')) return imagePath;
    return `${AUTH_BASE_URL}${imagePath}`;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        <div className="container mx-auto px-4 py-10">
          {/* Bouton retour avec effet luxueux */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button 
              variant="ghost" 
              className="mb-8 group flex items-center text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 hover:bg-white dark:hover:bg-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Retour à la navigation
            </Button>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Images produit avec design luxueux */}
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="mb-6 relative bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/50 dark:border-neutral-700/50 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImageIndex}
                    src={getImageUrl(productImages[selectedImageIndex])}
                    alt={product.name}
                    className="w-full h-[600px] object-contain rounded-3xl p-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    onError={(e) => {
                      console.log("Erreur de chargement d'image détaillée, utilisation du placeholder");
                      const target = e.target as HTMLImageElement;
                      target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </AnimatePresence>
                
                {isPromotionActive && (
                  <motion.div 
                    className="absolute top-6 right-6 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    -{product.promotion}%
                  </motion.div>
                )}
              </div>

              {productImages.length > 1 && (
                <motion.div 
                  className="flex justify-center flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {productImages.map((image, index) => (
                    <motion.div
                      key={index}
                      className={`w-24 h-24 overflow-hidden rounded-2xl cursor-pointer border-3 transition-all duration-300 ${
                        index === selectedImageIndex 
                          ? 'border-red-500 shadow-lg scale-105' 
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-red-300 hover:shadow-md'
                      } bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900`}
                      onClick={() => setSelectedImageIndex(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`${product.name} - image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Infos produit avec design luxueux */}
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-neutral-200/50 dark:border-neutral-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="px-3 py-1.5 text-xs bg-gradient-to-r from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 border-neutral-300 dark:border-neutral-600">
                    {product.category}
                  </Badge>
                  {product.dateAjout && new Date().getTime() - new Date(product.dateAjout).getTime() < 7 * 24 * 60 * 60 * 1000 && (
                    <Badge className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg">Nouveau</Badge>
                  )}
                </div>
                
                <h1 className="text-4xl font-bold mb-6 text-neutral-900 dark:text-neutral-100 font-playfair">
                  {product.name}
                </h1>
                
                {isPromotionActive ? (
                  <motion.div 
                    className="mb-8 p-6 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl border border-red-200 dark:border-red-900/30 shadow-lg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <p className="text-xl text-gray-500 line-through">
                        {typeof product.originalPrice === 'number'
                          ? product.originalPrice.toFixed(2)
                          : product.price.toFixed(2)}{' '}
                        €
                      </p>
                      <span className="bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 text-sm font-bold rounded-full shadow-lg">
                        -{product.promotion}%
                      </span>
                    </div>
                    <p className="text-4xl font-bold text-red-600 dark:text-red-400 font-playfair">
                      {product.price.toFixed(2)} €
                    </p>
                    {remainingTime && (
                      <div className="mt-4 flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
                        <span className="font-medium">
                          La promotion se termine dans: <span className="font-bold text-red-600">{remainingTime}</span>
                        </span>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <p className="text-3xl font-bold mb-8 text-neutral-900 dark:text-neutral-100 font-playfair">
                    {product.price.toFixed(2)} €
                  </p>
                )}

                <Tabs defaultValue="description" className="mt-8 mb-10">
                  <TabsList className="grid w-full grid-cols-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1">
                    <TabsTrigger value="description" className="rounded-lg">Description</TabsTrigger>
                    <TabsTrigger value="details" className="rounded-lg">Détails</TabsTrigger>
                    <TabsTrigger value="delivery" className="rounded-lg">Livraison</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="p-6 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-800 dark:to-neutral-900 rounded-2xl mt-4 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50">
                    <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">
                      {product.description}
                    </p>
                  </TabsContent>
                  <TabsContent value="details" className="p-6 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-800 dark:to-neutral-900 rounded-2xl mt-4 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50">
                    <ul className="space-y-3 text-neutral-700 dark:text-neutral-300">
                      <li className="flex items-start">
                        <span className="font-semibold w-32">Catégorie:</span>
                        <span>{product.category}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-semibold w-32">Disponibilité:</span>
                        <span className={isInStock ? 'text-green-600' : 'text-red-600'}>
                          {isInStock ? 'En stock' : 'Rupture de stock'}
                        </span>
                      </li>
                      {product.stock !== undefined && (
                        <li className="flex items-start">
                          <span className="font-semibold w-32">Stock:</span>
                          <span>{product.stock} unité{product.stock > 1 ? 's' : ''}</span>
                        </li>
                      )}
                      {product.dateAjout && (
                        <li className="flex items-start">
                          <span className="font-semibold w-32">Date d'ajout:</span>
                          <span>{new Date(product.dateAjout).toLocaleDateString('fr-FR')}</span>
                        </li>
                      )}
                    </ul>
                  </TabsContent>
                  <TabsContent value="delivery" className="p-6 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-800 dark:to-neutral-900 rounded-2xl mt-4 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <Truck className="h-5 w-5 mr-3 text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Livraison standard</p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">3-5 jours ouvrés</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Shield className="h-5 w-5 mr-3 text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Retours</p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">Retours gratuits sous 30 jours</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-3 text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Livraison gratuite</p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">Pour les commandes supérieures à 50€</p>
                        </div>
                      </li>
                    </ul>
                  </TabsContent>
                </Tabs>

                <div className="flex flex-col space-y-6">
                  <div className="flex items-center">
                    <span className="mr-6 text-neutral-700 dark:text-neutral-300 font-medium">Quantité:</span>
                    <div className="flex items-center bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl shadow-lg">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="px-4 py-3 text-neutral-500 disabled:text-neutral-300 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-l-xl transition-colors"
                      >
                        -
                      </button>
                      <span className="px-6 py-3 border-l border-r border-neutral-300 dark:border-neutral-700 min-w-[60px] text-center font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={product.stock !== undefined && quantity >= product.stock}
                        className="px-4 py-3 text-neutral-500 disabled:text-neutral-300 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-r-xl transition-colors"
                      >
                        +
                      </button>
                    </div>
                    {product.stock !== undefined && product.stock > 0 && product.stock <= 10 && (
                      <span className="ml-4 text-sm text-orange-600 font-medium">
                        ({product.stock} disponible{product.stock > 1 ? 's' : ''})
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      size="lg"
                      onClick={handleAddToCart}
                      disabled={!isInStock}
                      className={`flex-1 h-14 text-lg font-semibold transition-all duration-300 ${addedToCart ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600' : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'} shadow-xl hover:shadow-2xl transform hover:-translate-y-1`}
                    >
                      {addedToCart ? (
                        <>
                          <Check className="mr-2 h-6 w-6" />
                          Ajouté au panier
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-6 w-6" />
                          Ajouter au panier
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-14 w-14 border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      onClick={() => toggleFavorite(product)}
                    >
                      <Heart
                        className={`h-6 w-6 ${isProductFavorite ? 'fill-red-500 text-red-500' : ''}`}
                      />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-14 w-14 border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Lien copié dans le presse-papier");
                      }}
                    >
                      <Share2 className="h-6 w-6" />
                    </Button>
                  </div>
                </div>

                {!isInStock && (
                  <motion.div 
                    className="mt-6 p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-700 dark:text-red-400 shadow-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    Ce produit est actuellement en rupture de stock.
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
          
          {/* Section des commentaires avec design moderne */}
          <motion.div 
            className="mt-24"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="h-1 w-20 bg-gradient-to-r from-red-600 to-red-500 rounded-full"></div>
                <h2 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 font-playfair">
                  Avis & Commentaires
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-red-600 to-red-500 rounded-full"></div>
              </div>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Découvrez ce que nos clients pensent de ce produit et partagez votre propre expérience.
              </p>
            </div>
            <div className="bg-gradient-to-br from-white/80 to-neutral-50/80 dark:from-neutral-900/80 dark:to-neutral-950/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-neutral-200/50 dark:border-neutral-700/50">
              {productId && (
                <ProductReviews productId={productId} />
              )}
            </div>
          </motion.div>

          {/* Produits similaires */}
          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <FeaturedProductsSlider 
                products={relatedProducts} 
                title="Produits similaires" 
                description="Vous pourriez également aimer ces produits dans la même catégorie"
                seeAllLink={`/categorie/${product.category}`}
                slidesToShow={4}
              />
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
