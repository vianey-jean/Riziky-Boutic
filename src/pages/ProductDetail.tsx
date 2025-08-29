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
  
  // Vérification de l'ID sécurisé
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

  // Timer promotion
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

  // 🔥 Défilement automatique des images toutes les 2s
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
      return () => clearInterval(interval); // Nettoyage quand on quitte la page
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
        <div className="container mx-auto px-4 py-10">
        {/* Bouton retour */}
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Images produit */}
          <div className="flex-1">
            <div className="mb-4 relative bg-neutral-50 dark:bg-neutral-900 rounded-xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  src={getImageUrl(productImages[selectedImageIndex])}
                  alt={product.name}
                  className="w-full h-[500px] object-contain rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onError={(e) => {
                    console.log("Erreur de chargement d'image détaillée, utilisation du placeholder");
                    const target = e.target as HTMLImageElement;
                    target.src = PLACEHOLDER_IMAGE;
                  }}
                />
              </AnimatePresence>
              
              {isPromotionActive && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                  -{product.promotion}%
                </div>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="flex justify-center flex-wrap gap-3 mt-4">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    className={`w-20 h-20 overflow-hidden rounded-md cursor-pointer border-2 transition-all ${
                      index === selectedImageIndex ? 'border-red-500 shadow-md' : 'border-transparent hover:border-red-300'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
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
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Infos produit */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-800">
                {product.category}
              </Badge>
              {product.dateAjout && new Date().getTime() - new Date(product.dateAjout).getTime() < 7 * 24 * 60 * 60 * 1000 && (
                <Badge className="bg-blue-600 text-white">Nouveau</Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">{product.name}</h1>
            
            {isPromotionActive ? (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 rounded-lg border border-red-100 dark:border-red-900/50">
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-xl text-gray-500 line-through">
                    {typeof product.originalPrice === 'number'
                      ? product.originalPrice.toFixed(2)
                      : product.price.toFixed(2)}{' '}
                    €
                  </p>
                  <span className="bg-red-600 text-white px-2 py-0.5 text-sm font-bold rounded">
                    -{product.promotion}%
                  </span>
                </div>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {product.price.toFixed(2)} €
                </p>
                {remainingTime && (
                  <div className="mt-3 flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1.5 text-red-600 dark:text-red-400" />
                    <span className="font-medium">
                      La promotion se termine dans: <span className="font-bold">{remainingTime}</span>
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
                {product.price.toFixed(2)} €
              </p>
            )}

            <Tabs defaultValue="description" className="mt-6 mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="delivery">Livraison</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg mt-2">
                <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                  {product.description}
                </p>
              </TabsContent>
              <TabsContent value="details" className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg mt-2">
                <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-start">
                    <span className="font-medium w-32">Catégorie:</span>
                    <span>{product.category}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium w-32">Disponibilité:</span>
                    <span className={isInStock ? 'text-green-600' : 'text-red-600'}>
                      {isInStock ? 'En stock' : 'Rupture de stock'}
                    </span>
                  </li>
                  {product.stock !== undefined && (
                    <li className="flex items-start">
                      <span className="font-medium w-32">Stock:</span>
                      <span>{product.stock} unité{product.stock > 1 ? 's' : ''}</span>
                    </li>
                  )}
                  {product.dateAjout && (
                    <li className="flex items-start">
                      <span className="font-medium w-32">Date d'ajout:</span>
                      <span>{new Date(product.dateAjout).toLocaleDateString('fr-FR')}</span>
                    </li>
                  )}
                </ul>
              </TabsContent>
              <TabsContent value="delivery" className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg mt-2">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Truck className="h-5 w-5 mr-2 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Livraison standard</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">3-5 jours ouvrés</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 mr-2 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Retours</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Retours gratuits sous 30 jours</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Livraison gratuite</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Pour les commandes supérieures à 50€</p>
                    </div>
                  </li>
                </ul>
              </TabsContent>
            </Tabs>

            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <span className="mr-4 text-neutral-700 dark:text-neutral-300">Quantité:</span>
                <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-md">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-neutral-500 disabled:text-neutral-300 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-l border-r border-neutral-300 dark:border-neutral-700 min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={product.stock !== undefined && quantity >= product.stock}
                    className="px-3 py-2 text-neutral-500 disabled:text-neutral-300 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                {product.stock !== undefined && product.stock > 0 && product.stock <= 10 && (
                  <span className="ml-3 text-sm text-orange-600">
                    ({product.stock} disponible{product.stock > 1 ? 's' : ''})
                  </span>
                )}
              </div>

              <div className="flex space-x-4 mt-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  className={`flex-1 transition-all ${addedToCart ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Ajouté
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Ajouter au panier
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 border-neutral-300 dark:border-neutral-700"
                  onClick={() => toggleFavorite(product)}
                >
                  <Heart
                    className={`h-5 w-5 ${isProductFavorite ? 'fill-red-500 text-red-500' : ''}`}
                  />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 border-neutral-300 dark:border-neutral-700"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Lien copié dans le presse-papier");
                  }}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {!isInStock && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md text-red-700 dark:text-red-400">
                Ce produit est actuellement en rupture de stock.
              </div>
            )}
          </div>
        </div>
        
        {/* Section des commentaires avec design moderne */}
        <div className="mt-20">
          <div className="border-b border-neutral-200 dark:border-neutral-800 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-1 w-12 bg-red-600 rounded-full"></div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                Avis & Commentaires
              </h2>
              <div className="h-1 w-12 bg-red-600 rounded-full"></div>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 pb-6">
              Découvrez ce que nos clients pensent de ce produit et partagez votre propre expérience.
            </p>
          </div>
          {productId && (
            <ProductReviews productId={productId} />
          )}
        </div>

        {/* Produits similaires */}
        {relatedProducts.length > 0 && (
          <FeaturedProductsSlider 
            products={relatedProducts} 
            title="Produits similaires" 
            description="Vous pourriez également aimer ces produits dans la même catégorie"
            seeAllLink={`/categorie/${product.category}`}
            slidesToShow={4}
          />
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
