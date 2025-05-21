
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface ProductGridProps {
  products: Product[];
  title?: string;
  description?: string;
  showFilters?: boolean;
  isLoading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  title, 
  description, 
  showFilters = false,
  isLoading = false
}) => {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  
  // Charger les produits progressivement pour améliorer les performances
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
  
  // Animation variants pour les produits
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="product-section">
      {(title || description) && (
        <div className="flex flex-col items-center mb-8">
          {title && <h2 className="text-2xl md:text-3xl font-bold text-red-800 dark:text-neutral-100 mb-3">{title}</h2>}

          {description && <p className="text-neutral-600 dark:text-neutral-400 text-center max-w-2xl">{description}</p>}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
            <Button 
              type="button"
              variant="ghost" 
              size="sm"
              className={`rounded-md ${layout === 'grid' ? 'bg-white dark:bg-neutral-900 shadow-sm' : ''}`}
              onClick={() => setLayout('grid')}
              aria-label="Affichage en grille"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button 
              type="button"
              variant="ghost" 
              size="sm"
              className={`rounded-md ${layout === 'list' ? 'bg-white dark:bg-neutral-900 shadow-sm' : ''}`}
              onClick={() => setLayout('list')}
              aria-label="Affichage en liste"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
          
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {products.length} produit{products.length > 1 ? 's' : ''}
          </span>
        </div>
        
        {showFilters && (
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtres</SheetTitle>
              </SheetHeader>
              {/* Contenu des filtres ici */}
              <div className="py-4">
                <p>Options de filtrage à implémenter</p>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
      
      {isLoading ? (
        <div className={layout === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
          : "flex flex-col gap-4"
        }>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`${layout === 'list' ? 'border rounded-lg p-4' : ''} animate-pulse`}>
              <div className="bg-neutral-200 dark:bg-neutral-800 w-full h-52 rounded-lg mb-4"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {layout === 'grid' ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
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
              className="flex flex-col gap-4" 
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
                  className="border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md transition-all"
                  variants={childVariants}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 p-4">
                      <img 
                        src={product.image ? `${import.meta.env.VITE_API_BASE_URL}${product.image}` : '/placeholder.svg'} 
                        alt={product.name}
                        className="w-full h-48 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="md:w-3/4 p-4">
                      <h3 className="text-lg font-medium mb-2">{product.name}</h3>
                      <p className="text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-end">
                        {product.promotion ? (
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-neutral-500 line-through">
                              {typeof product.originalPrice === 'number'
                                ? product.originalPrice.toFixed(2)
                                : product.price.toFixed(2)}{' '}
                                €
                            </p>
                            <p className="font-bold text-red-600 text-lg">{product.price.toFixed(2)} €</p>
                          </div>
                        ) : (
                          <p className="font-bold text-lg">{product.price.toFixed(2)} €</p>
                        )}
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const { toggleFavorite } = require('@/contexts/StoreContext').useStore();
                              toggleFavorite(product);
                            }}
                          >
                            Favoris
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => {
                              const { addToCart } = require('@/contexts/StoreContext').useStore();
                              addToCart(product);
                            }}
                            disabled={!product.isSold || (product.stock !== undefined && product.stock <= 0)}
                          >
                            Ajouter au panier
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* Bouton "Charger plus" */}
          {hasMoreProducts && (
            <div className="flex justify-center mt-10">
              <Button 
                onClick={loadMoreProducts}
                variant="outline"
                className="px-8"
              >
                Afficher plus de produits
              </Button>
            </div>
          )}
        </>
      )}
      
      {!isLoading && products.length === 0 && (
        <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
          <p className="text-neutral-600 dark:text-neutral-400">Aucun produit trouvé</p>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
