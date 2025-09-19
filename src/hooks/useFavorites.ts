
/**
 * @fileoverview Hook personnalisé pour la gestion des favoris utilisateur
 * 
 * Ce hook gère toute la logique liée aux produits favoris d'un utilisateur.
 * Il inclut la récupération, l'ajout, la suppression et la vérification
 * des produits favoris avec gestion d'état locale et synchronisation serveur.
 * 
 * Fonctionnalités:
 * - Chargement automatique des favoris au login
 * - Ajout/suppression avec feedback utilisateur
 * - Vérification de statut favori pour un produit
 * - Redirection après login pour accès favoris
 * - Gestion d'erreurs avec notifications toast
 * - État de chargement pour UX optimale
 * - Compteur de favoris en temps réel
 * 
 * @version 2.0.0
 * @author Equipe Riziky-Boutic
 */

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { favoritesAPI } from '@/services/favoritesAPI';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, setRedirectAfterLogin } = useAuth();

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
      // Stocker la page favoris pour redirection après connexion
      setRedirectAfterLogin('/favoris');
      toast.error('Vous devez être connecté pour ajouter un produit au favoris', {
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
