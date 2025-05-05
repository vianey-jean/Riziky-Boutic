import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { Product } from '@/contexts/StoreContext';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { productsAPI } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import { useSearchParams } from 'react-router-dom';
const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
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
          const featured = Array.isArray(featuredResponse.data) ? featuredResponse.data.slice(0, 8) : products.slice(0, 8);
          setFeaturedProducts(featured);
        } catch (error) {
          console.error('Erreur lors du chargement des produits vedettes:', error);
          setFeaturedProducts(products.slice(0, 8));
        }
        try {
          const newArrivalsResponse = await productsAPI.getNewArrivals();
          const newItems = Array.isArray(newArrivalsResponse.data) ? newArrivalsResponse.data.slice(0, 8) : [];
          setNewArrivals(newItems);
        } catch (error) {
          console.error('Erreur lors du chargement des nouveaux produits:', error);
          const sortedByDate = [...products].sort((a, b) => {
            return new Date(b.dateAjout || 0).getTime() - new Date(a.dateAjout || 0).getTime();
          });
          setNewArrivals(sortedByDate.slice(0, 8));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        toast.error('Impossible de charger les produits');
        setFeaturedProducts([]);
        setNewArrivals([]);
        setAllProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter products based on search query parameter
  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery && searchQuery.length >= 3) {
      const filtered = allProducts.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description.toLowerCase().includes(searchQuery.toLowerCase()) || product.category.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts);
    }
  }, [searchParams, allProducts]);

  // 💡 Défilement automatique toutes les 3 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      const nextButton = document.querySelector('[data-carousel-next]') as HTMLElement;
      if (nextButton) nextButton.click();
    }, 3000);
    return () => clearInterval(interval);
  }, [featuredProducts]);
  return <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-red-800 flex items-center justify-center ">
          
          Bienvenue sur Riziky Boutique
        </h1>

        {/* 🔍 Résultats de recherche */}
        {searchParams.get('q') && <div className="mb-12">
            <ProductGrid products={filteredProducts} title={`Résultats pour : "${searchParams.get('q')}"`} />
          </div>}

        {/* 🔥 Produits Vedettes (caché si recherche) */}
        {!searchParams.get('q') && <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-red-800">
              Produits Vedettes
            </h2>
            {isLoading ? <div className="text-center py-10">Chargement des produits vedettes...</div> : featuredProducts.length > 0 ? <Carousel>
                <CarouselContent>
                  {featuredProducts.map(product => <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-0">
                            <div className="w-full">
                              <img src={`${AUTH_BASE_URL}${product.image}`} alt={product.name} className="w-full h-48 object-cover" onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = `${AUTH_BASE_URL}/uploads/placeholder.jpg`;
                      }} />
                              <div className="p-4">
                                <h3 className="font-medium">{product.name}</h3>
                                {product.promotion ? <div className="flex items-center gap-2 px-[19px]">
                                    <p className="mt-1 text-sm text-gray-500 line-through">
                                      {typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : product.price.toFixed(2)}{' '}
                                      €
                                    </p>
                                    <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                                        -{product.promotion}%
                                      </span>
                                      <p className="mt-1 font-bold my-0 mx-0 px-0 text-right">{product.price.toFixed(2)} €</p>
                                    </div> : <p className="mt-1 font-bold">{product.price.toFixed(2)} €</p>}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>)}
                </CarouselContent>
                <CarouselPrevious data-carousel-previous />
                <CarouselNext data-carousel-next />
              </Carousel> : <div className="text-center py-10">Aucun produit vedette disponible</div>}
          </div>}

        {/* 🆕 Nouveautés */}
        <div className="mb-12">
          <ProductGrid products={newArrivals} title="Nouveautés" />
        </div>
       {/* 📦 Tous les Produits */}
        <div className="mb-12">
          <ProductGrid products={allProducts} title="Tous nos produits" />
        </div>

      </div>
    </Layout>;
};
export default Index;
