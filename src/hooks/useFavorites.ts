
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { favoritesAPI } from '@/services/favoritesAPI';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const fetchFavorites = async () => {
    if (!isAuthenticated || !user) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await favoritesAPI.get(user.id);
      if (response.data && response.data.items && Array.isArray(response.data.items)) {
        setFavorites(response.data.items);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const toggleFavorite = async (product: Product) => {
    if (!isAuthenticated || !user) {
      toast.error('Vous devez être connecté pour ajouter un produit aux favoris', {
        style: { backgroundColor: '#EF4444', color: 'white', fontWeight: 'bold' },
        duration: 4000,
        position: 'top-center',
      });
      return;
    }
    
    const isFav = favorites.some(fav => fav.id === product.id);
    
    try {
      if (isFav) {
        await favoritesAPI.removeItem(user.id, product.id);
        setFavorites(favorites.filter(fav => fav.id !== product.id));
        toast.info('Produit retiré des favoris');
      } else {
        await favoritesAPI.addItem(user.id, product.id);
        setFavorites([...favorites, product]);
        toast.success('Produit ajouté aux favoris');
      }
    } catch (error) {
      console.error("Erreur lors de la gestion des favoris:", error);
      toast.error('Erreur lors de la gestion des favoris');
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav.id === productId);
  };

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    favoriteCount: favorites.length
  };
};
