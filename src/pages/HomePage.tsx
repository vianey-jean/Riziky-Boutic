import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ProductCatalogGrid from '@/components/products/ProductGrid';
import { Product } from '@/contexts/StoreContext';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { productsAPI } from '@/services/api';
import { useSearchParams } from 'react-router-dom';
import CustomerTestimonialSection from '@/components/reviews/TestimonialSection';
import { Link } from 'react-router-dom';
import { getSecureProductId } from '@/services/secureIds';
import { Skeleton } from '@/components/ui/skeleton';
import DataRetryLoader from '@/components/data-loading/DataRetryLoader';

const HomePage = () => {
  const [featuredProductCatalog, setFeaturedProductCatalog] = useState<Product[]>([]);
  const [newArrivalProducts, setNewArrivalProducts] = useState<Product[]>([]);
  const [promotionalProducts, setPromotionalProducts] = useState<Product[]>([]);
  const [completeProductCatalog, setCompleteProductCatalog] = useState<Product[]>([]);
  const [filteredProductCatalog, setFilteredProductCatalog] = useState<Product[]>([]);
  const [dataLoadingComplete, setDataLoadingComplete] = useState(false);
  const [searchParams] = useSearchParams();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const PRODUCT_PLACEHOLDER_IMAGE = '/placeholder.svg';
  
  // Fonction de chargement des données conforme aux normes e-commerce européennes
  const loadEcommerceProductData = async () => {
    const productsResponse = await productsAPI.getAll();
    if (!productsResponse.data || !Array.isArray(productsResponse.data)) {
      throw new Error('Format de données produit incorrect - Conformité UE requise');
    }
    const productCatalog: Product[] = productsResponse.data;
    const sortedProductCatalog = [...productCatalog].sort((a, b) => a.name.localeCompare(b.name));
    
    setCompleteProductCatalog(sortedProductCatalog);
    setFilteredProductCatalog(sortedProductCatalog);

    // Chargement des produits vedettes
    try {
      const featuredResponse = await productsAPI.getMostFavorited();
      const featuredItems = Array.isArray(featuredResponse.data)
        ? featuredResponse.data.slice(0, 8)
        : productCatalog.slice(0, 8);
      setFeaturedProductCatalog(featuredItems);
    } catch (error) {
      console.error('Erreur chargement produits vedettes:', error);
      setFeaturedProductCatalog(productCatalog.slice(0, 8));
    }

    // Chargement des nouveautés
    try {
      const newArrivalsResponse = await productsAPI.getNewArrivals();
      const newItems = Array.isArray(newArrivalsResponse.data)
        ? newArrivalsResponse.data.slice(0, 8)
        : [];
      setNewArrivalProducts(newItems);
    } catch (error) {
      console.error('Erreur chargement nouveautés:', error);
      const sortedByDate = [...productCatalog].sort((a, b) =>
        new Date(b.dateAjout || 0).getTime() - new Date(a.dateAjout || 0).getTime()
      );
      setNewArrivalProducts(sortedByDate.slice(0, 8));
    }

    // Filtrage des produits en promotion (conformité temporelle UE)
    const currentDate = new Date();
    const activePromotionalProducts = productCatalog.filter(product => 
      product.promotion && 
      product.promotionEnd && 
      new Date(product.promotionEnd) > currentDate
    );
    setPromotionalProducts(activePromotionalProducts.slice(0, 8));
    
    return productCatalog;
  };

  const handleDataLoadingSuccess = (data: Product[]) => {
    setDataLoadingComplete(true);
  };

  const handleMaxRetriesReached = () => {
    // Données de fallback pour la conformité européenne
    setFeaturedProductCatalog([]);
    setNewArrivalProducts([]);
    setPromotionalProducts([]);
    setCompleteProductCatalog([]);
    setFilteredProductCatalog([]);
    setDataLoadingComplete(true);
  };

  // Filtrage des produits selon la recherche (conformité RGPD)
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
  }, [searchParams, completeProductCatalog]);

  // Carrousel automatique conforme aux standards UX européens
  React.useEffect(() => {
    if (!dataLoadingComplete || featuredProductCatalog.length === 0) return;
    
    const carouselInterval = setInterval(() => {
      const nextButton = document.querySelector('[data-carousel-next]') as HTMLElement;
      if (nextButton) nextButton.click();
    }, 3000);
    return () => clearInterval(carouselInterval);
  }, [featuredProductCatalog, dataLoadingComplete]);

  const calculatePromotionTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const timeDifference = end.getTime() - now.getTime();
    if (timeDifference <= 0) return "Expirée";
    
    const hoursRemaining = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hoursRemaining}h ${minutesRemaining}m`;
  };

  const getSecureImageUrl = (imagePath: string) => {
    if (!imagePath) return PRODUCT_PLACEHOLDER_IMAGE;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  const getSecureProductUrl = (productId: string) => {
    return `/${getSecureProductId(productId, 'product')}`;
  };

  const renderLoadingPlaceholder = (count: number) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden h-full flex flex-col">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-5 w-1/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-red-800 flex items-center justify-center">
          Bienvenue chez Riziky Boutique - Spécialiste Produits Capillaires Premium
        </h1>

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
          {/* Résultats de recherche */}
          {searchParams.get('q') && (
            <div className="mb-12">
              <ProductCatalogGrid
                products={filteredProductCatalog}
                title={`Résultats de recherche : "${searchParams.get('q')}"`}
              />
            </div>
          )}

          {/* Produits vedettes */}
          {!searchParams.get('q') && featuredProductCatalog.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-red-800">Nos Produits Vedettes</h2>
              <Carousel>
                <CarouselContent>
                  {featuredProductCatalog.map(product => (
                    <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-0">
                            <div className="w-full">
                              <Link to={getSecureProductUrl(product.id)} className="block">
                                <img
                                  src={getSecureImageUrl(product.image)}
                                  alt={`${product.name} - Produit capillaire premium`}
                                  className="w-full h-48 object-contain"
                                  onError={e => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = PRODUCT_PLACEHOLDER_IMAGE;
                                  }}
                                />
                                <div className="p-4">
                                  <h3 className="font-medium">{product.name}</h3>
                                  {product.promotion ? (
                                    <div className="flex items-center gap-2 px-[19px]">
                                      <p className="mt-1 text-sm text-gray-500 line-through">
                                        {typeof product.originalPrice === 'number'
                                          ? product.originalPrice.toFixed(2)
                                          : product.price.toFixed(2)}{' '}
                                        €
                                      </p>
                                      <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                                        -{product.promotion}%
                                      </span>
                                      <p className="mt-1 font-bold">
                                        {product.price.toFixed(2)} €
                                      </p>
                                    </div>
                                  ) : (
                                    <p className="mt-1 font-bold">
                                      {product.price.toFixed(2)} €
                                    </p>
                                  )}
                                </div>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious data-carousel-previous />
                <CarouselNext data-carousel-next />
              </Carousel>
            </div>
          )}

          {/* Produits en promotion */}
          {!searchParams.get('q') && promotionalProducts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-red-800">Offres Promotionnelles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {promotionalProducts.map(product => (
                  <Card key={product.id} className="overflow-hidden h-full flex flex-col">
                    <div className="relative">
                      <Link to={getSecureProductUrl(product.id)}>
                        <img
                          src={getSecureImageUrl(product.image)}
                          alt={`${product.name} en promotion`}
                          className="h-48 w-full object-contain"
                          onError={e => {
                            const target = e.target as HTMLImageElement;
                            target.src = PRODUCT_PLACEHOLDER_IMAGE;
                          }}
                        />
                      </Link>
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{product.promotion}%
                      </div>
                      {product.promotionEnd && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          Expire dans: {calculatePromotionTimeRemaining(product.promotionEnd)}
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 flex-grow">
                      <Link to={getSecureProductUrl(product.id)}>
                        <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-sm text-gray-500 line-through">
                          {typeof product.originalPrice === 'number'
                            ? product.originalPrice.toFixed(2)
                            : product.price.toFixed(2)}{' '}
                          €
                        </p>
                        <p className="font-bold text-red-600">
                          {product.price.toFixed(2)} €
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Nouveautés */}
          <div className="mb-12">
            <ProductCatalogGrid products={newArrivalProducts} title="Dernières Nouveautés" />
          </div>

          {/* Catalogue complet - Avec bouton "Voir tous produits" */}
          <div className="mb-12">
            <ProductCatalogGrid 
              products={completeProductCatalog} 
              title="Notre Catalogue Complet" 
              showViewAllButton={true}
            />
          </div>

          {/* Témoignages clients */}
          <CustomerTestimonialSection />
        </DataRetryLoader>
      </div>
    </Layout>
  );
};

export default HomePage;
