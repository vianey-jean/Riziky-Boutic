
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import HeroSection from '@/components/layout/HeroSection';
import DesktopFilters from '@/components/filters/DesktopFilters';
import FilterBadges from '@/components/filters/FilterBadges';
import ProductsPageHeader from '@/components/products/ProductsPageHeader';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { Product } from '@/contexts/StoreContext';
import { productsAPI } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { useProductFilters } from '@/hooks/useProductFilters';

const AllProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

  const {
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange,
    maxPrice,
    sortOption,
    setSortOption,
    sortedProducts,
    showInStock,
    setShowInStock,
    showOutOfStock,
    setShowOutOfStock,
    showPromoOnly,
    setShowPromoOnly,
    activeFilters,
    resetFilters,
    getFilterBadges
  } = useProductFilters({ products });

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Format de données incorrect');
      }
      
      return response.data;
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      toast.error("Impossible de charger les produits");
      throw error;
    }
  };

  const handleDataSuccess = (data: Product[]) => {
    setProducts(data);
    setIsLoading(false);
  };

  const handleMaxRetriesReached = () => {
    setProducts([]);
    setIsLoading(false);
  };

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  const mobileFiltersProps = {
    filtersOpen,
    setFiltersOpen,
    activeFilters,
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange,
    maxPrice,
    showInStock,
    setShowInStock,
    showOutOfStock,
    setShowOutOfStock,
    showPromoOnly,
    setShowPromoOnly,
    resetFilters
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        <HeroSection
          title="Tous nos Produits"
          description="Découvrez notre collection complète de produits de beauté capillaire. Perruques, tissages, queues de cheval et accessoires pour sublimer votre style."
          icon={TrendingUp}
        />

        <div className="container mx-auto px-4 py-8">
          <PageDataLoader
            fetchFunction={fetchProducts}
            onSuccess={handleDataSuccess}
            onMaxRetriesReached={handleMaxRetriesReached}
            loadingMessage="Chargement des produits..."
            loadingSubmessage="Récupération de notre catalogue complet..."
            errorMessage="Erreur de chargement des produits"
          >
            <ProductsPageHeader
              title="Tous nos produits"
              productCount={sortedProducts.length}
              sortOption={sortOption}
              setSortOption={setSortOption}
              mobileFiltersProps={mobileFiltersProps}
            />
            
            <FilterBadges 
              badges={getFilterBadges()} 
              onClearAll={resetFilters}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <DesktopFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                maxPrice={maxPrice}
                showInStock={showInStock}
                setShowInStock={setShowInStock}
                showOutOfStock={showOutOfStock}
                setShowOutOfStock={setShowOutOfStock}
                showPromoOnly={showPromoOnly}
                setShowPromoOnly={setShowPromoOnly}
                resetFilters={resetFilters}
              />
              
              <div className="md:col-span-3">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className="border rounded-xl p-4 h-[300px] animate-pulse">
                        <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : currentProducts.length > 0 ? (
                  <>
                    <ProductGrid products={currentProducts} />
                    
                    {totalPages > 1 && (
                      <div className="flex justify-between items-center mt-8">
                        <div className="text-sm text-muted-foreground">
                          Page {currentPage} sur {totalPages} - {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''} au total
                        </div>
                        <div className="flex gap-2">
                          {currentPage > 1 && (
                            <Button
                              variant="outline"
                              onClick={() => setCurrentPage(currentPage - 1)}
                              className="flex items-center gap-2"
                            >
                              <ChevronLeft className="h-4 w-4" />
                              Précédent
                            </Button>
                          )}
                          
                          {currentPage < totalPages && (
                            <Button
                              onClick={() => setCurrentPage(currentPage + 1)}
                              className="flex items-center gap-2"
                            >
                              Suivant
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-6 bg-neutral-50 dark:bg-neutral-900 rounded-xl text-center">
                    <ShoppingBag className="h-14 w-14 text-neutral-400 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Aucun produit trouvé</h2>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      Nous n'avons trouvé aucun produit correspondant à vos critères de recherche. Essayez d'ajuster vos filtres.
                    </p>
                    <Button onClick={resetFilters}>
                      Réinitialiser tous les filtres
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </PageDataLoader>
        </div>
      </div>
    </Layout>
  );
};

export default AllProductsPage;
