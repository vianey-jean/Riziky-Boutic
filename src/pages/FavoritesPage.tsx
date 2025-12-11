
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import PageDataLoader from '@/components/layout/PageDataLoader';
import EmptyFavoritesMessage from '@/components/favorites/EmptyFavoritesMessage';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, ShoppingBag, Sparkles, Star, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
            <motion.div 
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 dark:from-rose-950/30 dark:via-pink-950/30 dark:to-fuchsia-950/30 border border-rose-200/50 dark:border-rose-800/50 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Background decoration */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-pink-400/20 to-fuchsia-400/20 rounded-full blur-3xl" />
              </div>

              <div className="relative py-16 px-8 text-center">
                <motion.div 
                  className="mb-8"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, ease: "backOut", delay: 0.2 }}
                >
                  <div className="relative inline-flex">
                    <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500 p-6 rounded-3xl shadow-2xl">
                      <Lock className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-full shadow-lg">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.h2 
                  className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Connectez-vous pour voir vos favoris
                </motion.h2>

                <motion.p 
                  className="text-neutral-600 dark:text-neutral-300 mb-8 max-w-lg mx-auto text-lg leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Vous devez être connecté pour accéder à votre liste de favoris personnalisée et sauvegarder vos coups de cœur
                </motion.p>

                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button 
                    asChild 
                    size="lg"
                    className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 hover:from-rose-600 hover:via-pink-600 hover:to-fuchsia-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl px-8 py-6 h-auto text-lg font-semibold"
                  >
                    <Link to="/login" className="flex items-center gap-2">
                      Se connecter
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
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
                <EmptyFavoritesMessage />
              )}
            </PageDataLoader>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FavoritesPage;
