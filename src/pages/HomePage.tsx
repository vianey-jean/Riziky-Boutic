
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductCatalogGrid from '@/components/products/ProductGrid';
import CustomerTestimonialSection from '@/components/reviews/TestimonialSection';
import DataRetryLoader from '@/components/data-loading/DataRetryLoader';
import HomeHeader from '@/components/home/HomeHeader';
import FeaturedProductsCarousel from '@/components/home/FeaturedProductsCarousel';
import PromotionalProductsGrid from '@/components/home/PromotionalProductsGrid';
import { useHomePageData } from '@/hooks/useHomePageData';
import { useCarouselAutoplay } from '@/hooks/useCarouselAutoplay';
import SalesNotification from '@/components/engagement/SalesNotification';
import LiveVisitorCounter from '@/components/engagement/LiveVisitorCounter';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Award, Star } from 'lucide-react';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <Layout>
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-red-950/20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Hero Section Enhancement */}
        <motion.div 
          className="relative overflow-hidden bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 text-white"
          variants={itemVariants}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12"></div>
          
          <div className="relative container mx-auto px-4 py-16">
            <HomeHeader />
          </div>
          
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl float-animation"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-yellow-300/20 rounded-full blur-lg float-animation" style={{ animationDelay: '2s' }}></div>
        </motion.div>

        <div className="container mx-auto px-4 py-8 space-y-16">
          <DataRetryLoader
            fetchFunction={loadEcommerceProductData}
            onSuccess={handleDataLoadingSuccess}
            onMaxRetriesReached={handleMaxRetriesReached}
            maxRetries={6}
            retryInterval={5000}
            errorMessage="Erreur de chargement des produits"
            loadingComponent={
              <motion.div 
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-red-200 border-t-red-600 mx-auto mb-8"></div>
                  <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-r-pink-500 mx-auto animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gradient">Chargement de votre boutique...</h2>
                <p className="text-gray-600 dark:text-gray-400 animate-pulse">Connexion au serveur en cours...</p>
                <div className="mt-6 flex justify-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </motion.div>
            }
          >
            {/* Search Results Section */}
            {searchParams.get('q') && (
              <motion.div variants={itemVariants} className="mb-16">
                <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl p-8 border border-red-100 dark:border-red-900/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-full">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gradient">
                      Résultats pour "{searchParams.get('q')}"
                    </h2>
                  </div>
                  <ProductCatalogGrid
                    products={filteredProductCatalog}
                    title=""
                  />
                </div>
              </motion.div>
            )}

            {/* Featured Products Section */}
            {!searchParams.get('q') && featuredProductCatalog.length > 0 && (
              <motion.div variants={itemVariants}>
                <FeaturedProductsCarousel products={featuredProductCatalog} />
              </motion.div>
            )}

            {/* Promotional Products Section */}
            {!searchParams.get('q') && (
              <motion.div variants={itemVariants} className="mb-16">
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Award className="h-8 w-8 text-red-500" />
                    <h2 className="text-4xl font-bold text-gradient">Offres Exceptionnelles</h2>
                    <Award className="h-8 w-8 text-red-500" />
                  </div>
                  <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Découvrez nos promotions exclusives et économisez jusqu'à 70%
                  </p>
                </div>
                <PromotionalProductsGrid products={promotionalProducts} />
              </motion.div>
            )}

            {/* New Arrivals Section */}
            <motion.div variants={itemVariants} className="mb-16">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-3xl p-8 shadow-xl border border-blue-100 dark:border-blue-900/20">
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <TrendingUp className="h-8 w-8 text-blue-500 animate-bounce" />
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Dernières Nouveautés
                    </h2>
                    <Star className="h-8 w-8 text-blue-500 animate-pulse" />
                  </div>
                  <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Les derniers produits ajoutés à notre collection
                  </p>
                </div>
                <ProductCatalogGrid products={newArrivalProducts} title="" />
              </div>
            </motion.div>

            {/* Complete Catalog Section */}
            <motion.div variants={itemVariants} className="mb-16">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-3xl p-8 shadow-xl border border-purple-100 dark:border-purple-900/20">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                    Notre Catalogue Complet
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Explorez toute notre gamme de produits soigneusement sélectionnés
                  </p>
                </div>
                <ProductCatalogGrid 
                  products={completeProductCatalog} 
                  title="" 
                  showViewAllButton={true}
                />
              </div>
            </motion.div>

            {/* Testimonials Section */}
            <motion.div variants={itemVariants}>
              <CustomerTestimonialSection />
            </motion.div>
          </DataRetryLoader>
        </div>

        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-200/10 to-orange-200/10 rounded-full blur-3xl"></div>
        </div>

        <SalesNotification />
        <LiveVisitorCounter />
      </motion.div>
    </Layout>
  );
};

export default HomePage;
