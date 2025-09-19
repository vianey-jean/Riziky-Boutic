
/**
 * @fileoverview Service API pour la gestion du panier d'achat - Version Legacy
 * 
 * Ce fichier contient toutes les fonctions liées à la gestion du panier
 * d'achat des utilisateurs dans Riziky-Boutic. Il permet d'ajouter, modifier,
 * supprimer des articles et de gérer l'état du panier.
 * 
 * @deprecated Ce fichier est maintenu pour compatibilité legacy.
 * Utiliser plutôt le nouveau service: modules/cart.service.ts
 * 
 * Fonctionnalités couvertes:
 * - Récupération du panier utilisateur
 * - Ajout/suppression d'articles
 * - Modification des quantités
 * - Vidage complet du panier
 * - Persistance des données panier
 * 
 * @version 1.0.0 (Legacy)
 * @author Equipe Riziky-Boutic
 */

import { API } from './apiConfig';
import { Cart } from '@/types/cart';

/**
 * API de gestion du panier legacy
 * @deprecated Migrer vers cartService dans modules/cart.service.ts
 * 
 * Note: Les endpoints utilisent encore l'ancien nom "panier" pour compatibilité
 * avec le backend existant. Le nouveau service utilise des endpoints "cart".
 */
export const cartAPI = {
  /**
   * Récupère le panier complet d'un utilisateur
   * @param userId - Identifiant unique de l'utilisateur
   * @returns Promise<Cart> - Contenu du panier avec articles et totaux
   */
  get: (userId: string) => API.get<Cart>(`/panier/${userId}`),
  
  /**
   * Ajoute un article au panier ou augmente sa quantité s'il existe déjà
   * @param userId - Identifiant de l'utilisateur
   * @param productId - Identifiant du produit à ajouter
   * @param quantity - Quantité à ajouter (défaut: 1)
   * @returns Promise - Confirmation d'ajout avec panier mis à jour
   */
  addItem: (userId: string, productId: string, quantity: number = 1) => 
    API.post(`/panier/${userId}/add`, { productId, quantity }),
  
  /**
   * Met à jour la quantité d'un article spécifique dans le panier
   * @param userId - Identifiant de l'utilisateur
   * @param productId - Identifiant du produit à modifier
   * @param quantity - Nouvelle quantité (si 0, supprime l'article)
   * @returns Promise - Confirmation de mise à jour
   */
  updateItem: (userId: string, productId: string, quantity: number) => 
    API.put(`/panier/${userId}/update`, { productId, quantity }),
  
  /**
   * Supprime complètement un article du panier
   * @param userId - Identifiant de l'utilisateur
   * @param productId - Identifiant du produit à supprimer
   * @returns Promise - Confirmation de suppression
   */
  removeItem: (userId: string, productId: string) => 
    API.delete(`/panier/${userId}/remove/${productId}`),
  
  /**
   * Vide complètement le panier de l'utilisateur
   * @param userId - Identifiant de l'utilisateur
   * @returns Promise - Confirmation de vidage
   */
  clear: (userId: string) => API.delete(`/panier/${userId}/clear`),
};
