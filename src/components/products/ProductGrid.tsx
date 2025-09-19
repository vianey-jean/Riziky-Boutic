/**
 * @fileoverview Composant ProductGrid - Grille d'affichage des produits
 * 
 * Ce composant gère l'affichage des produits sous forme de grille ou de liste
 * avec des fonctionnalités avancées de pagination, filtrage et tri.
 * 
 * Fonctionnalités principales:
 * - Affichage en grille ou en liste (toggle)
 * - Pagination intelligente (load more)
 * - Système de filtres avancés (sidebar)
 * - Animations d'apparition staggered
 * - Gestion des états de chargement
 * - Actions groupées (favoris, panier)
 * - Compteur de produits dynamique
 * - Responsive design complet
 * - Intégration sélecteur de quantité
 * - Routes sécurisées
 * 
 * @version 2.0.0
 * @author Equipe Riziky-Boutic
 */

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product, useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList, Filter, Heart, ShoppingCart, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';
import { getSecureRoute } from '@/services/secureIds';
import LoadingSpinner from '@/components/ui/loading-spinner';
import QuantitySelector from '@/components/ui/quantity-selector';

interface ProductGridProps {
  products: Product[];
  title?: string;
  description?: string;
  showFilters?: boolean;
  isLoading?: boolean;
  showViewAllButton?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  title, 
  description, 
  showFilters = false,
  isLoading = false,
  showViewAllButton = false
}) => {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const productsPerPage = 12;

  const { favorites, toggleFavorite, addToCart } = useStore();

  useEffect(() => {
    setCurrentPage(1);
    setVisibleProducts(products.slice(0, productsPerPage));
  }, [products]);

  const loadMoreProducts = () => {
    const nextPage = currentPage + 1;
    const nextProducts = products.slice(0, nextPage * productsPerPage);
    setVisibleProducts(nextProducts);
    setCurrentPage(nextPage);
  };

  const hasMoreProducts = visibleProducts.length < products.length;

  const isFavorite = (product: Product) => {
    return favorites.some(fav => fav.id === product.id);
  };

  const getQuantity = (productId: string) => quantities[productId] || 1;
  
  const setQuantity = (productId: string, quantity: number) => {
    setQuantities(prev => ({ ...prev, [productId]: quantity }));
  };

  const handleAddToCart = (product: Product) => {
    const quantity = getQuantity(product.id);
    addToCart(product, quantity);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="product-section bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        {(title || description) && (
          <div className="flex flex-col items-center mb-12 text-center">
            {title && (
              <div className="relative mb-4">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {title}
                </h2>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
              </div>
            )}
            {description && (
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 shadow-inner">
              <Button 
                type="button"
                variant="ghost" 
                size="sm"
                className={`rounded-lg transition-all duration-300 ${layout === 'grid' 
                  ? 'bg-white dark:bg-gray-600 shadow-md text-red-600 dark:text-red-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
                }`}
                onClick={() => setLayout('grid')}
                aria-label="Affichage en grille"
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
              <Button 
                type="button"
                variant="ghost" 
                size="sm"
                className={`rounded-lg transition-all duration-300 ${layout === 'list' 
                  ? 'bg-white dark:bg-gray-600 shadow-md text-red-600 dark:text-red-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
                }`}
                onClick={() => setLayout('list')}
                aria-label="Affichage en liste"
              >
                <LayoutList className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {showViewAllButton && (
              <Link to={getSecureRoute('/tous-les-produits')}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-sm text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-300 rounded-xl"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Voir tous les produits
                </Button>
              </Link>
            )}

            {showFilters && (
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 rounded-xl"
                  >
                    <Filter className="h-4 w-4" />
                    Filtres
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-white dark:bg-gray-800">
                  <SheetHeader>
                    <SheetTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Filtres de recherche
                    </SheetTitle>
                  </SheetHeader>
                  <div className="py-6">
                    <p className="text-gray-600 dark:text-gray-400">Options de filtrage à implémenter</p>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" variant="elegant" text="Chargement des produits..." />
          </div>
        ) : (
          <>
            {layout === 'grid' ? (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                role="list"
                aria-label="Liste de produits"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {visibleProducts.map(product => (
                  <motion.div key={product.id} role="listitem" variants={childVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="flex flex-col gap-6"
                role="list"
                aria-label="Liste de produits"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {visibleProducts.map(product => (
                  <motion.div 
                    key={product.id}
                    role="listitem"
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-red-300 dark:hover:border-red-700 hover:shadow-xl transition-all duration-300 overflow-hidden"
                    variants={childVariants}
                  >
                    <div className="flex flex-col md:flex-row">
                      
                      {/* Image */}
                      <div className="md:w-1/3 p-6">
                        <div className="relative group">
                          <img 
                            src={product.image ? `${import.meta.env.VITE_API_BASE_URL}${product.image}` : '/placeholder.svg'}
                            alt={product.name}
                            className="w-full h-64 object-contain rounded-xl bg-gray-50 dark:bg-gray-700 group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
                          />
                          {product.promotion && (
                            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                              Promo !
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Infos produit */}
                      <div className="md:w-2/3 p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 hover:text-red-600 transition-colors cursor-pointer">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        <div className="flex justify-between items-end">
                          <div className="flex flex-col">
                            {product.promotion ? (
                              <div className="flex items-center gap-3">
                                <p className="text-lg text-gray-500 line-through">
                                  {typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : product.price.toFixed(2)} €
                                </p>
                                <p className="font-bold text-2xl bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                  {product.price.toFixed(2)} €
                                </p>
                              </div>
                            ) : (
                              <p className="font-bold text-2xl text-gray-900 dark:text-gray-100">
                                {product.price.toFixed(2)} €
                              </p>
                            )}
                            {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                                Plus que {product.stock} en stock !
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col gap-3">
                            <div className="flex gap-3">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className={`border ${isFavorite(product) ? 'border-red-300 text-red-600 bg-red-50' : 'border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'} rounded-xl transition-all duration-300`}
                                onClick={() => toggleFavorite(product)}
                              >
                                <Heart className={`h-4 w-4 mr-2 ${isFavorite(product) ? 'text-red-600 fill-red-600' : 'text-gray-400'}`} />
                                Favoris
                              </Button>
                            </div>
                            <div className="flex items-center gap-3">
                              <QuantitySelector
                                quantity={getQuantity(product.id)}
                                onQuantityChange={(qty) => setQuantity(product.id, qty)}
                                maxStock={product.stock}
                                disabled={!product.isSold || (product.stock !== undefined && product.stock <= 0)}
                                size="sm"
                              />
                              <Button 
                                size="sm"
                                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex-1"
                                onClick={() => handleAddToCart(product)}
                                disabled={!product.isSold || (product.stock !== undefined && product.stock <= 0)}
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Ajouter au panier
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {hasMoreProducts && (
              <div className="flex justify-center mt-12">
                <Button 
                  onClick={loadMoreProducts}
                  variant="outline"
                  className="px-8 py-3 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Afficher plus de produits
                </Button>
              </div>
            )}
          </>
        )}

        {!isLoading && products.length === 0 && (
          <div className="text-center py-20 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-600">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Essayez de modifier vos critères de recherche ou parcourez nos catégories
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
