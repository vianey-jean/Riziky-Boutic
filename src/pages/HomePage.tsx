
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductCatalogGrid from '@/components/products/ProductGrid';
import CustomerTestimonialSection from '@/components/reviews/TestimonialSection';
import PageDataLoader from '@/components/layout/PageDataLoader';
import HomeHeader from '@/components/home/HomeHeader';
import LuxuryHeroSection from '@/components/home/LuxuryHeroSection';
import FeaturedProductsCarousel from '@/components/home/FeaturedProductsCarousel';
import PromotionalProductsGrid from '@/components/home/PromotionalProductsGrid';
import FlashSaleBanner from '@/components/flash-sale/FlashSaleBanner';
import { useHomePageData } from '@/hooks/useHomePageData';
import { useCarouselAutoplay } from '@/hooks/useCarouselAutoplay';
import SalesNotification from '@/components/engagement/SalesNotification';
import LiveVisitorCounter from '@/components/engagement/LiveVisitorCounter';
import { Sparkles, TrendingUp, Star, ShoppingBag } from 'lucide-react';

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
        
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        <PageDataLoader
          fetchFunction={loadEcommerceProductData}
          onSuccess={handleDataLoadingSuccess}
          onMaxRetriesReached={handleMaxRetriesReached}
          loadingMessage="Chargement de votre boutique..."
          loadingSubmessage="Préparation de votre expérience shopping premium..."
          errorMessage="Erreur de chargement des produits"
        >
          {/* Hero Section moderne */}
          <div className="relative overflow-hidden bg-gradient-to-r from-red-500/10 via-rose-500/10 to-pink-500/10 dark:from-red-500/5 dark:via-rose-500/5 dark:to-pink-500/5">
            <div className="absolute inset-0 bg-grid-neutral-100/50 dark:bg-grid-neutral-800/50" />
            <div className="container mx-auto px-4 py-6 relative">
              <LuxuryHeroSection />
              {/* <HomeHeader /> */}
              
              {/* Section de bienvenue avec animation */}
              {/* <div className="text-center max-w-4xl mx-auto mb-8 h-[100px]">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 bg-clip-text text-transparent mb-3 animate-fade-in">
                  Découvrez l'Excellence
                </h1>

                <p className="text-md md:text-lg text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed animate-fade-in">
                  Votre destination beauté pour des produits de qualité premium qui subliment votre style naturel.
                </p>

                <div className="flex items-center justify-center space-x-6 text-sm text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center space-x-1 animate-fade-in">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Qualité Premium</span>
                  </div>
                  <div className="flex items-center space-x-1 animate-fade-in">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Tendances 2025</span>
                  </div>
                  <div className="flex items-center space-x-1 animate-fade-in">
                    <ShoppingBag className="h-4 w-4 text-blue-500" />
                    <span>Livraison Offerte</span>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            {searchParams.get('q') && (
              <div className="mb-12 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-8">
                <ProductCatalogGrid
                  products={filteredProductCatalog}
                  title={`Résultats de recherche : "${searchParams.get('q')}"`}
                />
              </div>
            )}

            {!searchParams.get('q') && (
              <div className="mb-12 animate-fade-in">
                <FlashSaleBanner />
              </div>
            )}

            {!searchParams.get('q') && (
              <div className="mb-12 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 rounded-xl p-8 shadow-sm border border-neutral-200 dark:border-neutral-700 animate-fade-in">
                <FeaturedProductsCarousel products={featuredProductCatalog} />
              </div>
            )}

            {!searchParams.get('q') && (
              <div className="mb-12 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-8 animate-fade-in" data-section="promotional">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Promotions Exceptionnelles
                  </h2>
                </div>
                <PromotionalProductsGrid products={promotionalProducts} />
              </div>
            )}

            <div className="mb-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800 p-8 animate-fade-in" data-section="new-arrivals">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-xl">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Dernières Nouveautés
                </h2>
              </div>
              <ProductCatalogGrid products={newArrivalProducts} title="" />
            </div>

            <div className="mb-12 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-8 animate-fade-in" data-section="complete-catalog">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Notre Catalogue Complet
                </h2>
              </div>
              <ProductCatalogGrid 
                products={completeProductCatalog} 
                title="" 
                showViewAllButton={true}
              />
            </div>

            <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-8 animate-fade-in">
              <CustomerTestimonialSection />
            </div>
          </div>
        </PageDataLoader>

        {/* Composants pour les administrateurs uniquement */}
        <SalesNotification />
        <LiveVisitorCounter />
      </div>
    </Layout>
  );
};

export default HomePage;
