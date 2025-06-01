
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Heart, ShoppingBag, Star } from 'lucide-react';
import { productsAPI } from '@/services/productsAPI';
import { Product } from '@/types/product';
import { toast } from '@/components/ui/sonner';

const PopularityPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setLoading(true);
        
        // Récupérer les produits les plus favorisés
        const response = await productsAPI.getMostFavorited();
        
        if (response.data && Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits populaires:', error);
        toast.error('Erreur lors du chargement des produits populaires');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  const LoadingSkeleton = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Skeleton className="h-12 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <LoadingSkeleton />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 dark:from-amber-500/5 dark:via-rose-500/5 dark:to-purple-500/5">
          <div className="absolute inset-0 bg-grid-neutral-100/50 dark:bg-grid-neutral-800/50" />
          <div className="container mx-auto px-4 py-16 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-3 rounded-2xl shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Produits Populaires
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
                Découvrez les produits les plus appréciés par nos clients. 
                Sélectionnés selon leurs favoris et leurs achats, ces articles sont des incontournables de notre collection.
              </p>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  <span>Les plus aimés</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5 text-amber-500" />
                  <span>Les plus achetés</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-purple-500" />
                  <span>Recommandés</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="container mx-auto px-4 py-12">
          {products.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    Nos Bestsellers
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {products.length} produit{products.length > 1 ? 's' : ''} populaire{products.length > 1 ? 's' : ''}
                  </p>
                </div>
                
                <div className="hidden md:flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-rose-50 dark:bg-rose-950/20 rounded-full">
                    <Heart className="h-4 w-4 text-rose-500" />
                    <span className="text-rose-700 dark:text-rose-400">Favoris clients</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-amber-50 dark:bg-amber-950/20 rounded-full">
                    <TrendingUp className="h-4 w-4 text-amber-500" />
                    <span className="text-amber-700 dark:text-amber-400">Tendances</span>
                  </div>
                </div>
              </div>
              
              <ProductGrid products={products} />
            </>
          ) : (
            <div className="text-center py-16">
              <div className="mb-6">
                <TrendingUp className="h-16 w-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Aucun produit populaire pour le moment
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                  Les produits populaires apparaîtront ici une fois que nos clients commenceront à les ajouter à leurs favoris et à les acheter.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PopularityPage;
