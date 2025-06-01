
/**
 * Service API pour la gestion du panier d'achat
 * 
 * Gère toutes les opérations liées au panier utilisateur :
 * récupération, ajout, modification, suppression d'articles
 */

import { apiClient } from '../core/apiClient';
import { Cart } from '@/types/cart';

// Object contenant toutes les méthodes d'interaction avec l'API du panier
export const cartService = {
  // Récupérer le panier d'un utilisateur spécifique
  get: (userId: string) => apiClient.get<Cart>(`/panier/${userId}`),
  
  // Ajouter un article au panier (quantité par défaut : 1)
  addItem: (userId: string, productId: string, quantity: number = 1) => 
    apiClient.post(`/panier/${userId}/add`, { productId, quantity }),
  
  // Mettre à jour la quantité d'un article dans le panier
  updateItem: (userId: string, productId: string, quantity: number) => 
    apiClient.put(`/panier/${userId}/update`, { productId, quantity }),
  
  // Supprimer un article spécifique du panier
  removeItem: (userId: string, productId: string) => 
    apiClient.delete(`/panier/${userId}/remove/${productId}`),
  
  // Vider complètement le panier de l'utilisateur
  clear: (userId: string) => apiClient.delete(`/panier/${userId}/clear`),
};
