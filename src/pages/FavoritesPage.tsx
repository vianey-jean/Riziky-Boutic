
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
            <div className="relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-rose-950/30 dark:via-pink-950/30 dark:to-red-950/30 rounded-3xl" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/20 to-red-400/20 rounded-full blur-3xl" />
              
              {/* Floating hearts decoration */}
              <div className="absolute top-16 left-16 opacity-20">
                <Heart className="h-8 w-8 text-rose-400 animate-bounce" style={{ animationDelay: '0s' }} />
              </div>
              <div className="absolute top-24 right-24 opacity-20">
                <Heart className="h-6 w-6 text-pink-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
              </div>
              <div className="absolute bottom-20 left-1/4 opacity-20">
                <Heart className="h-5 w-5 text-red-400 animate-bounce" style={{ animationDelay: '1s' }} />
              </div>
              
              <div className="relative text-center py-20 px-8 rounded-3xl border border-white/50 dark:border-neutral-700/50 backdrop-blur-sm">
                {/* Icon with luxury styling */}
                <div className="mb-8 relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl blur-xl opacity-40 animate-pulse" />
                  <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-red-500 p-6 rounded-3xl shadow-2xl">
                    <Heart className="h-14 w-14 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 p-2 rounded-full shadow-lg">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                  Connectez-vous pour voir vos favoris
                </h2>
                <p className="text-neutral-600 dark:text-neutral-300 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                  Accédez à votre collection personnalisée de coups de cœur et retrouvez vos produits préférés
                </p>
                
                <Button 
                  asChild 
                  size="lg"
                  className="bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 hover:from-rose-700 hover:via-pink-700 hover:to-red-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-10 py-6 text-lg rounded-2xl group"
                >
                  <Link to="/login" className="flex items-center gap-3">
                    Se connecter
                    <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </Link>
                </Button>
                
                {/* Trust badges */}
                <div className="mt-12 flex items-center justify-center gap-8 text-sm text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-500" />
                    <span>Sauvegardez vos favoris</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    <span>Accès prioritaire</span>
                  </div>
                </div>
              </div>
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
                <div className="relative overflow-hidden">
                  {/* Background decorative elements */}
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 dark:from-rose-950/30 dark:via-pink-950/30 dark:to-fuchsia-950/30 rounded-3xl" />
                  <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-full blur-3xl" />
                  <div className="absolute bottom-10 left-10 w-56 h-56 bg-gradient-to-tr from-pink-400/20 to-fuchsia-400/20 rounded-full blur-3xl" />
                  
                  {/* Floating hearts decoration */}
                  <div className="absolute top-20 left-20 opacity-30">
                    <Heart className="h-6 w-6 text-rose-400 animate-bounce" style={{ animationDelay: '0s' }} />
                  </div>
                  <div className="absolute top-32 right-32 opacity-30">
                    <Heart className="h-4 w-4 text-pink-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
                  </div>
                  <div className="absolute bottom-24 left-1/3 opacity-30">
                    <Heart className="h-8 w-8 text-fuchsia-400 animate-bounce" style={{ animationDelay: '1s' }} />
                  </div>
                  <div className="absolute bottom-16 right-1/4 opacity-30">
                    <Heart className="h-5 w-5 text-red-400 animate-bounce" style={{ animationDelay: '1.5s' }} />
                  </div>
                  
                  <div className="relative text-center py-20 px-8 rounded-3xl border border-white/50 dark:border-neutral-700/50 backdrop-blur-sm">
                    {/* Icon with luxury styling */}
                    <div className="mb-8 relative inline-block">
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl blur-xl opacity-40 animate-pulse" />
                      <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500 p-6 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                        <Heart className="h-14 w-14 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 p-2 rounded-full shadow-lg animate-pulse">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent">
                      Votre liste de favoris est vide
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-300 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                      Explorez notre collection et ajoutez vos coups de cœur pour les retrouver facilement
                    </p>
                    
                    <Button 
                      asChild 
                      size="lg"
                      className="bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 hover:from-rose-700 hover:via-pink-700 hover:to-fuchsia-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-10 py-6 text-lg rounded-2xl group"
                    >
                      <Link to="/" className="flex items-center gap-3">
                        <ShoppingBag className="h-5 w-5" />
                        Explorer nos produits
                        <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      </Link>
                    </Button>
                    
                    {/* Features */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                      <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm">
                        <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-2 rounded-xl">
                          <Heart className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Sauvegardez</span>
                        <span className="text-xs text-neutral-500">vos coups de cœur</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-xl">
                          <Star className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Accès rapide</span>
                        <span className="text-xs text-neutral-500">à vos produits</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm">
                        <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 p-2 rounded-xl">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Notifications</span>
                        <span className="text-xs text-neutral-500">promotions exclusives</span>
                      </div>
                    </div>
                  </div>
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
