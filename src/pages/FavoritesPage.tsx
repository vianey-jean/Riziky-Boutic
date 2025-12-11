
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, ShoppingBag, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
  const { favorites, loadingFavorites } = useStore();
  const { isAuthenticated } = useAuth();
  const [dataLoaded, setDataLoaded] = useState(false);
  
  const loadFavoritesData = async () => {
    // Simuler le chargement des favoris
    await new Promise(resolve => setTimeout(resolve, 1000));
    return favorites;
  };

  const handleDataSuccess = () => {
    setDataLoaded(true);
  };

  const handleMaxRetriesReached = () => {
    setDataLoaded(true);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-red-500/10 dark:from-rose-500/5 dark:via-pink-500/5 dark:to-red-500/5">
          <div className="absolute inset-0 bg-grid-neutral-100/50 dark:bg-grid-neutral-800/50" />
          <div className="container mx-auto px-4 py-16 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-3 rounded-2xl shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-6">
                Vos Favoris
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
                Retrouvez tous vos produits préférés en un seul endroit. Votre sélection personnalisée vous attend.
              </p>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  <span>Vos coups de cœur</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>Sélection premium</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <span>Toujours disponible</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {!isAuthenticated ? (
            <div className="text-center py-16 px-6 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-xl shadow-sm border border-rose-200 dark:border-rose-800">
              <div className="mb-6">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-4 rounded-full mx-auto w-fit mb-4">
                  <Heart className="h-12 w-12 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Connectez-vous pour voir vos favoris
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
                Vous devez être connecté pour accéder à votre liste de favoris personnalisée
              </p>
              <Button 
                asChild 
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg px-8 py-3 rounded-full"
              >
                <Link to="/login">Se connecter</Link>
              </Button>
            </div>
          ) : (
            <PageDataLoader
              fetchFunction={loadFavoritesData}
              onSuccess={handleDataSuccess}
              onMaxRetriesReached={handleMaxRetriesReached}
              loadingMessage="Chargement de vos favoris..."
              loadingSubmessage="Récupération de votre sélection personnalisée..."
              errorMessage="Erreur de chargement des favoris"
            >
              {favorites.length > 0 ? (
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                        Vos produits favoris
                      </h2>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        {favorites.length} produit{favorites.length > 1 ? 's' : ''} dans votre sélection
                      </p>
                    </div>
                    
                    <div className="hidden md:flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2 px-3 py-2 bg-rose-50 dark:bg-rose-950/20 rounded-full">
                        <Heart className="h-4 w-4 text-rose-500" />
                        <span className="text-rose-700 dark:text-rose-400">Favoris</span>
                      </div>
                    </div>
                  </div>
                  
                  <ProductGrid products={favorites} />
                </div>
              ) : (
                <div className="text-center py-16 px-6 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-4 rounded-full mx-auto w-fit mb-4">
                      <Heart className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">
                    Votre liste de favoris est vide
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
                    Ajoutez des produits à vos favoris pour les retrouver ici facilement
                  </p>
                  <Button 
                    asChild 
                    className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg px-8 py-3 rounded-full"
                  >
                    <Link to="/">
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Explorer nos produits
                    </Link>
                  </Button>
                </div>
              )}
            </PageDataLoader>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FavoritesPage;
