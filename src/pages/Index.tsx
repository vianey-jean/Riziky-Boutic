import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { Product } from '@/contexts/StoreContext';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { productsAPI } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import { useSearchParams } from 'react-router-dom';
import TestimonialSection from '@/components/reviews/TestimonialSection';
import { Link } from 'react-router-dom';
import { getSecureId } from '@/services/secureIds';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [promotionProducts, setPromotionProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const PLACEHOLDER_IMAGE = '/placeholder.svg';
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const productsResponse = await productsAPI.getAll();
        if (!productsResponse.data || !Array.isArray(productsResponse.data)) {
          throw new Error('Format de données incorrect pour les produits');
        }
        const products: Product[] = productsResponse.data;
        const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));
        setAllProducts(sortedProducts);
        setFilteredProducts(sortedProducts);

        try {
          const featuredResponse = await productsAPI.getMostFavorited();
          const featured = Array.isArray(featuredResponse.data)
            ? featuredResponse.data.slice(0, 8)
            : products.slice(0, 8);
          setFeaturedProducts(featured);
        } catch (error) {
          console.error('Erreur lors du chargement des produits vedettes:', error);
          setFeaturedProducts(products.slice(0, 8));
        }

        try {
          const newArrivalsResponse = await productsAPI.getNewArrivals();
          const newItems = Array.isArray(newArrivalsResponse.data)
            ? newArrivalsResponse.data.slice(0, 8)
            : [];
          setNewArrivals(newItems);
        } catch (error) {
          console.error('Erreur lors du chargement des nouveaux produits:', error);
          const sortedByDate = [...products].sort((a, b) =>
            new Date(b.dateAjout || 0).getTime() - new Date(a.dateAjout || 0).getTime()
          );
          setNewArrivals(sortedByDate.slice(0, 8));
        }

        // Récupérer et filtrer les produits en promotion avec une date de fin valide
        const now = new Date();
        const promoProducts = products.filter(product => 
          product.promotion && 
          product.promotionEnd && 
          new Date(product.promotionEnd) > now
        );
        setPromotionProducts(promoProducts.slice(0, 8));
        
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        toast.error('Impossible de charger les produits');
        setFeaturedProducts([]);
        setNewArrivals([]);
        setPromotionProducts([]);
        setAllProducts([]);
        setFilteredProducts([]);
      } finally {
        // Attendre un peu avant de considérer le chargement comme terminé
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };
    fetchData();
  }, []);

  // Filtre les produits en fonction du paramètre de recherche
  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery && searchQuery.length >= 3) {
      const filtered = allProducts.filter(
        product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts);
    }
  }, [searchParams, allProducts]);

  // Défilement automatique toutes les 3 secondes pour le carousel
  useEffect(() => {
    if (isLoading || featuredProducts.length === 0) return;
    
    const interval = setInterval(() => {
      const nextButton = document.querySelector('[data-carousel-next]') as HTMLElement;
      if (nextButton) nextButton.click();
    }, 3000);
    return () => clearInterval(interval);
  }, [featuredProducts, isLoading]);

  const getPromotionTimeLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffInMs = end.getTime() - now.getTime();
    if (diffInMs <= 0) return "Expirée";
    
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMins = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffInHours}h ${diffInMins}m`;
  };

  // Fonction pour construire l'URL de l'image de manière sécurisée
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return PLACEHOLDER_IMAGE;
    
    // Si l'image commence déjà par http, c'est une URL complète
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Sinon, on ajoute le BASE_URL
    return `${AUTH_BASE_URL}${imagePath}`;
  };

  // Fonction pour générer un ID sécurisé pour chaque produit
  const getProductUrl = (productId: string) => {
    return `/${getSecureId(productId, 'product')}`;
  };

  // Fonctions pour afficher des placeholders durant le chargement
  const renderLoadingGrid = (count: number) => (
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
          Bienvenue sur Riziky Boutique
        </h1>

        {/* 🔍 Résultats de recherche */}
        {searchParams.get('q') && (
          <div className="mb-12">
            {isLoading ? (
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-red-800">Résultats pour : "{searchParams.get('q')}"</h2>
                {renderLoadingGrid(4)}
              </div>
            ) : (
              <ProductGrid
                products={filteredProducts}
                title={`Résultats pour : "${searchParams.get('q')}"`}
              />
            )}
          </div>
        )}

        {/* 🔥 Produits Vedettes */}
        {!searchParams.get('q') && featuredProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-red-800">Produits Vedettes</h2>
            {isLoading ? (
              <div className="text-center py-10">
                <div className="flex items-center justify-center mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800"></div>
                </div>
                <p>Chargement des produits vedettes...</p>
              </div>
            ) : featuredProducts.length > 0 ? (
              <Carousel>
                <CarouselContent>
                  {featuredProducts.map(product => (
                    <CarouselItem
                      key={product.id}
                      className="md:basis-1/2 lg:basis-1/4"
                    >
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-0">
                            <div className="w-full">
                              <Link to={getProductUrl(product.id)} className="block">
                                <img
                                  src={getImageUrl(product.image)}
                                  alt={product.name}
                                  className="w-full h-48 object-contain"
                                  onError={e => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = PLACEHOLDER_IMAGE;
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
                                      <p className="mt-1 font-bold my-0 mx-0 px-0 text-right">
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
            ) : (
              <div className="text-center py-10">
                <p>Aucun produit vedette disponible pour le moment.</p>
              </div>
            )}
          </div>
        )}

        {/* 🛍️ Produits en promotion - Montrer seulement s'il y a au moins un produit en promotion */}
        {!searchParams.get('q') && promotionProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-red-800">Promotions</h2>
            {isLoading ? (
              renderLoadingGrid(4)
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {promotionProducts.map(product => (
                  <Card key={product.id} className="overflow-hidden h-full flex flex-col">
                    <div className="relative">
                      <Link to={getProductUrl(product.id)}>
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="h-48 w-full object-contain"
                          onError={e => {
                            const target = e.target as HTMLImageElement;
                            target.src = PLACEHOLDER_IMAGE;
                          }}
                        />
                      </Link>
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{product.promotion}%
                      </div>
                      {product.promotionEnd && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          Expire dans: {getPromotionTimeLeft(product.promotionEnd)}
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 flex-grow">
                      <Link to={getProductUrl(product.id)}>
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
            )}
          </div>
        )}

        {/* 🆕 Nouveautés */}
        <div className="mb-12">
          {isLoading ? (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-red-800">Nouveautés</h2>
              {renderLoadingGrid(4)}
            </div>
          ) : (
            <ProductGrid products={newArrivals} title="Nouveautés" />
          )}
        </div>

        {/* 📦 Tous les Produits */}
        <div className="mb-12">
          {isLoading ? (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-red-800">Tous nos produits</h2>
              {renderLoadingGrid(8)}
            </div>
          ) : (
            <ProductGrid products={allProducts} title="Tous nos produits" />
          )}
        </div>

        {/* 📝 Témoignages */}
        {isLoading ? (
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="font-cormorant text-3xl md:text-4xl font-bold mb-2 text-brand-charcoal text-red-800">
                Ce Que Nos Clients Disent
              </h2>
              <p className="text-gray-500 text-red-800">Découvrez les expériences de notre communauté</p>
              <div className="h-px w-24 bg-brand-gold mx-auto mt-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                  <div className="animate-pulse">
                    <Skeleton className="h-5 w-32 mb-4" />
                    <Skeleton className="h-20 w-full mb-4" />
                    <div className="flex items-center">
                      <Skeleton className="h-12 w-12 rounded-full mr-4" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <TestimonialSection />
        )}
      </div>
    </Layout>
  );
};

export default Index;
