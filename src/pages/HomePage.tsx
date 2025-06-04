
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
import SalesNotification from '@/components/engagement/SalesNotification';
import LiveVisitorCounter from '@/components/engagement/LiveVisitorCounter';
import { Wrench, Clock } from 'lucide-react';

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const {
    featuredProductCatalog,
    newArrivalProducts,
    promotionalProducts,
    completeProductCatalog,
    filteredProductCatalog,
    dataLoadingComplete,
    isMaintenanceMode,
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

  // Si le mode maintenance est activé, afficher la page de maintenance
  if (isMaintenanceMode) {
    return (
      <Layout hidePrompts={true}>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Wrench className="h-12 w-12 text-orange-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Site en maintenance
              </h1>
              <div className="w-24 h-1 bg-orange-600 mx-auto mb-6"></div>
            </div>

            <div className="mb-8">
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                Notre site est actuellement en maintenance. Nous travaillons pour améliorer votre expérience et reviendrons bientôt avec de nouvelles fonctionnalités !
              </p>
              
              <div className="flex items-center justify-center text-gray-500 mb-8">
                <Clock className="h-5 w-5 mr-2" />
                <span>Nous reviendrons très prochainement</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Merci pour votre patience
              </h2>
              <p className="text-gray-600">
                En attendant, vous pouvez nous contacter si vous avez des questions urgentes.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

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

      {/* Composants pour les administrateurs uniquement - SalesNotification au-dessus */}
      <SalesNotification />
      <LiveVisitorCounter />
    </Layout>
  );
};

export default HomePage;
