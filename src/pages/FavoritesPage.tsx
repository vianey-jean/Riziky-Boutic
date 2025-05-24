
import React from 'react';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
  const { favorites, loadingFavorites } = useStore();
  const { isAuthenticated } = useAuth();
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-red-800">Vos Favoris</h1>
        
        {!isAuthenticated ? (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <div className="mb-4">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">Connectez-vous pour voir vos favoris</h2>
            <p className="text-muted-foreground mb-6">
              Vous devez être connecté pour accéder à vos favoris
            </p>
            <Button asChild>
              <Link to="/login">Se connecter</Link>
            </Button>
          </div>
        ) : loadingFavorites ? (
          <div className="text-center py-10">Chargement de vos favoris...</div>
        ) : favorites.length > 0 ? (
          <ProductGrid products={favorites} />
        ) : (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <div className="mb-4">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">Votre liste de favoris est vide</h2>
            <p className="text-muted-foreground mb-6">
              Ajoutez des produits à vos favoris pour les retrouver ici
            </p>
            <Button asChild>
              <Link to="/">Explorer nos produits</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FavoritesPage;
