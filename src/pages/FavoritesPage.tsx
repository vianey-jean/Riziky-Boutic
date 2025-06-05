
import React from 'react';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FavoritesPage = () => {
  const { favorites, loadingFavorites } = useStore();
  const { isAuthenticated } = useAuth();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Layout>
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-red-950/20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto px-4 py-8">
          {/* Enhanced Header */}
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                className="p-4 bg-gradient-to-br from-pink-500 to-red-500 rounded-full shadow-lg"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Heart className="h-8 w-8 text-white" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-red-600 to-purple-600 bg-clip-text text-transparent">
                Mes Favoris
              </h1>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-8 w-8 text-pink-500" />
              </motion.div>
            </div>
            
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              {favorites.length > 0 
                ? `Vous avez ${favorites.length} produit${favorites.length > 1 ? 's' : ''} dans vos favoris`
                : "Votre liste de favoris vous attend"
              }
            </motion.p>
          </motion.div>

          {/* Loading State */}
          {loadingFavorites ? (
            <motion.div 
              className="text-center py-20"
              variants={itemVariants}
            >
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 mx-auto mb-6"></div>
                <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-red-500 mx-auto animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gradient">Chargement de vos favoris...</h2>
              <p className="text-gray-600 dark:text-gray-400">Nous récupérons vos produits préférés</p>
            </motion.div>
          ) : favorites.length > 0 ? (
            /* Products Grid */
            <motion.div variants={itemVariants}>
              <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl p-8 border border-pink-100 dark:border-pink-900/20">
                <ProductGrid products={favorites} />
              </div>
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div 
              className="text-center py-20"
              variants={itemVariants}
            >
              <div className="relative max-w-md mx-auto">
                {/* Enhanced Empty State Card */}
                <motion.div 
                  className="bg-gradient-to-br from-white to-pink-50 dark:from-neutral-900 dark:to-pink-950/20 rounded-3xl p-12 shadow-2xl border border-pink-100 dark:border-pink-900/20 relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute top-6 left-6 w-16 h-16 bg-pink-200/30 rounded-full blur-xl"></div>
                    <div className="absolute bottom-6 right-6 w-20 h-20 bg-red-200/30 rounded-full blur-xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-200/20 rounded-full blur-2xl"></div>
                  </div>

                  <div className="relative z-10">
                    <motion.div 
                      className="mb-8"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div className="relative">
                        <Heart className="h-20 w-20 mx-auto text-pink-300 dark:text-pink-700" />
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          animate={{ scale: [0.8, 1.2, 0.8] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Heart className="h-12 w-12 text-pink-500 fill-pink-200" />
                        </motion.div>
                      </div>
                    </motion.div>

                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                      Votre liste de favoris est vide
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                      Commencez à ajouter des produits à vos favoris pour les retrouver facilement ici. 
                      Cliquez sur le cœur ❤️ sur vos produits préférés !
                    </p>

                    <div className="space-y-4">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          asChild 
                          size="lg"
                          className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Link to="/">
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            Découvrir nos produits
                          </Link>
                        </Button>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          asChild 
                          variant="outline"
                          size="lg"
                          className="border-2 border-pink-200 hover:border-pink-300 text-pink-600 hover:text-pink-700 hover:bg-pink-50 dark:border-pink-800 dark:hover:border-pink-700 dark:text-pink-400 dark:hover:text-pink-300 px-8 py-3 rounded-full transition-all duration-300"
                        >
                          <Link to="/tous-les-produits">
                            <Sparkles className="mr-2 h-5 w-5" />
                            Voir tous les produits
                          </Link>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating elements */}
                <motion.div
                  className="absolute -top-4 -left-4 w-8 h-8 bg-pink-400 rounded-full opacity-20"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-4 -right-4 w-6 h-6 bg-red-400 rounded-full opacity-30"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
                <motion.div
                  className="absolute top-1/2 -right-8 w-4 h-4 bg-purple-400 rounded-full opacity-25"
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 2 }}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-200/20 to-red-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default FavoritesPage;
