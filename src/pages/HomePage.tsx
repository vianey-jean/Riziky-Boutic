
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductCatalogGrid from '@/components/products/ProductGrid';
import CustomerTestimonialSection from '@/components/reviews/TestimonialSection';
import DataRetryLoader from '@/components/data-loading/DataRetryLoader';
import HomeHeader from '@/components/home/HomeHeader';
import FeaturedProductsCarousel from '@/components/home/FeaturedProductsCarousel';
import PromotionalProductsGrid from '@/components/home/PromotionalProductsGrid';
import FlashSaleBanner from '@/components/flash-sale/FlashSaleBanner';
import { useHomePageData } from '@/hooks/useHomePageData';
import { useCarouselAutoplay } from '@/hooks/useCarouselAutoplay';

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const {
    featuredProductCatalog,
    newArrivalProducts,
    promotionalProducts,
    completeProductCatalog,
    filteredProductCatalog,
    dataLoadingComplete,
    setFilteredProductCatalog,
    loadEcommerceProductData,
    handleDataLoadingSuccess,
    handleMaxRetriesReached
  } = useHomePageData();

  useCarouselAutoplay(!searchParams.get('q'), dataLoadingComplete, featuredProductCatalog.length);

  React.useEffect(() => {
    const searchQuery = searchParams.get('q');
    
    if (searchQuery && searchQuery.length >= 3) {
      const filteredResults = completeProductCatalog.filter(
        product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProductCatalog(filteredResults);
    } else {
      setFilteredProductCatalog(completeProductCatalog);
    }
  }, [searchParams, completeProductCatalog, setFilteredProductCatalog]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <HomeHeader />

        <DataRetryLoader
          fetchFunction={loadEcommerceProductData}
          onSuccess={handleDataLoadingSuccess}
          onMaxRetriesReached={handleMaxRetriesReached}
          maxRetries={6}
          retryInterval={5000}
          errorMessage="Erreur de chargement des produits"
          loadingComponent={
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-6"></div>
              <h2 className="text-xl font-semibold mb-2">Chargement de votre boutique...</h2>
              <p className="text-gray-600">Connexion au serveur en cours...</p>
            </div>
          }
        >
          {searchParams.get('q') && (
            <div className="mb-12">
              <ProductCatalogGrid
                products={filteredProductCatalog}
                title={`Résultats de recherche : "${searchParams.get('q')}"`}
              />
            </div>
          )}

          {!searchParams.get('q') && (
            <FlashSaleBanner />
          )}

          {!searchParams.get('q') && (
            <FeaturedProductsCarousel products={featuredProductCatalog} />
          )}

          {!searchParams.get('q') && (
            <div className="mb-12" data-section="promotional">
              <PromotionalProductsGrid products={promotionalProducts} />
            </div>
          )}

          <div className="mb-12" data-section="new-arrivals">
            <ProductCatalogGrid products={newArrivalProducts} title="Dernières Nouveautés" />
          </div>

          <div className="mb-12" data-section="complete-catalog">
            <ProductCatalogGrid 
              products={completeProductCatalog} 
              title="Notre Catalogue Complet" 
              showViewAllButton={true}
            />
          </div>

          <CustomerTestimonialSection />
        </DataRetryLoader>
      </div>
    </Layout>
  );
};

export default HomePage;
