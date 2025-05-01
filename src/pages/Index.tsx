
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { Product } from '@/contexts/StoreContext';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { productsAPI } from '@/services/api';
import { toast } from '@/components/ui/sonner';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

   // 🔁 URL de base récupérée depuis le .env
const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
 

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Récupérer tous les produits
        const productsResponse = await productsAPI.getAll();
        if (!productsResponse.data || !Array.isArray(productsResponse.data)) {
          throw new Error('Format de données incorrect pour les produits');
        }
        
        const products = productsResponse.data;
        
        // Trier les produits par ordre alphabétique
        const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));
        setAllProducts(sortedProducts);
        
        // Récupérer les produits les plus favorisés
        try {
          const featuredResponse = await productsAPI.getMostFavorited();
          setFeaturedProducts(Array.isArray(featuredResponse.data) ? featuredResponse.data : []);
        } catch (error) {
          console.error("Erreur lors du chargement des produits vedettes:", error);
          // Fallback: utiliser les 4 premiers produits comme vedettes
          setFeaturedProducts(products.slice(0, 4));
        }
        
        // Récupérer les nouveaux produits
        try {
          const newArrivalsResponse = await productsAPI.getNewArrivals();
          setNewArrivals(Array.isArray(newArrivalsResponse.data) ? newArrivalsResponse.data : []);
        } catch (error) {
          console.error("Erreur lors du chargement des nouveaux produits:", error);
          // Fallback: trier par date d'ajout et prendre les 10 premiers
          const sortedByDate = [...products].sort((a, b) => {
            return new Date(b.dateAjout || 0).getTime() - new Date(a.dateAjout || 0).getTime();
          });
          setNewArrivals(sortedByDate.slice(0, 10));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
        toast.error("Impossible de charger les produits");
        setFeaturedProducts([]);
        setNewArrivals([]);
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-red-800">Bienvenue sur Riziky Boutique</h1>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-red-800">Produits Vedettes</h2>
          {isLoading ? (
            <div className="text-center py-10">Chargement des produits vedettes...</div>
          ) : featuredProducts.length > 0 ? (
            <Carousel>
              <CarouselContent>
                {featuredProducts.map(product => (
                  <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-0">
                          <div className="w-full">
                          <img src={`${AUTH_BASE_URL}${product.image}`} alt={product.name} className="w-full h-48 object-cover" />
                            <div className="p-4">
                              <h3 className="font-medium">{product.name}</h3>
                              {product.promotion ? (
                                <div>
                                  <p className="mt-1 text-sm text-gray-500 line-through">
                                    {typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : product.price.toFixed(2)} €
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                                      -{product.promotion}%
                                    </span>
                                    <p className="mt-1 font-bold">{product.price.toFixed(2)} €</p>
                                  </div>
                                </div>
                              ) : (
                                <p className="mt-1 font-bold">{product.price.toFixed(2)} €</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="text-center py-10">Aucun produit vedette disponible</div>
          )}
        </div>
        
        <div className="mb-12">
          <ProductGrid products={newArrivals} title="Nouveautés" />
        </div>
        
        <div className="mb-12">
          <ProductGrid products={allProducts} title="Tous nos produits" />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
