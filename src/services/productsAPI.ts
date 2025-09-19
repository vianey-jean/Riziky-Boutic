
/**
 * @fileoverview Service API pour la gestion des produits - Version Legacy
 * 
 * Ce fichier contient toutes les fonctions liées à la gestion des produits
 * dans le catalogue Riziky-Boutic. Il gère la récupération, création, 
 * modification et suppression des produits, ainsi que les fonctionnalités
 * de recherche et de statistiques.
 * 
 * @deprecated Ce fichier est maintenu pour compatibilité legacy.
 * Utiliser plutôt le nouveau service: modules/products.service.ts
 * 
 * Fonctionnalités couvertes:
 * - CRUD complet des produits
 * - Recherche et filtrage
 * - Gestion des promotions
 * - Statistiques produits (favoris, nouveautés)
 * - Organisation par catégories
 * 
 * @version 1.0.0 (Legacy)
 * @author Equipe Riziky-Boutic
 */

import { API } from './apiConfig';
import { Product } from '@/types/product';

/**
 * API de gestion des produits legacy
 * @deprecated Migrer vers productsService dans modules/products.service.ts
 */
export const productsAPI = {
  /**
   * Récupère tous les produits du catalogue
   * @returns Promise<Product[]> - Liste complète des produits
   */
  getAll: () => API.get<Product[]>('/products'),
  
  /**
   * Récupère un produit spécifique par son ID
   * @param id - Identifiant unique du produit
   * @returns Promise<Product> - Détails du produit
   */
  getById: (id: string) => API.get<Product>(`/products/${id}`),
  
  /**
   * Récupère tous les produits d'une catégorie donnée
   * @param category - Nom de la catégorie
   * @returns Promise<Product[]> - Produits de la catégorie
   */
  getByCategory: (category: string) => API.get<Product[]>(`/products/category/${category}`),
  
  /**
   * Récupère les produits les plus ajoutés aux favoris
   * @returns Promise<Product[]> - Produits populaires
   */
  getMostFavorited: () => API.get<Product[]>('/products/stats/most-favorited'),
  
  /**
   * Récupère les derniers produits ajoutés au catalogue
   * @returns Promise<Product[]> - Nouveaux produits
   */
  getNewArrivals: () => API.get<Product[]>('/products/stats/new-arrivals'),
  
  /**
   * Crée un nouveau produit (réservé aux administrateurs)
   * @param product - FormData contenant les données du produit et images
   * @returns Promise<Product> - Produit créé
   */
  create: (product: FormData) => API.post<Product>('/products', product),
  
  /**
   * Met à jour un produit existant (réservé aux administrateurs)
   * @param id - ID du produit à modifier
   * @param product - FormData contenant les nouvelles données
   * @returns Promise<Product> - Produit mis à jour
   */
  update: (id: string, product: FormData) => API.put<Product>(`/products/${id}`, product),
  
  /**
   * Supprime un produit du catalogue (réservé aux administrateurs)
   * @param id - ID du produit à supprimer
   * @returns Promise - Confirmation de suppression
   */
  delete: (id: string) => API.delete(`/products/${id}`),
  
  /**
   * Applique une promotion temporaire à un produit
   * @param id - ID du produit
   * @param promotion - Pourcentage de réduction (0-100)
   * @param duration - Durée en heures
   * @returns Promise - Confirmation d'application
   */
  applyPromotion: (id: string, promotion: number, duration: number) => 
    API.post(`/products/${id}/promotion`, { promotion, duration }),
  
  /**
   * Recherche des produits par mot-clé
   * @param query - Terme de recherche
   * @returns Promise<Product[]> - Résultats de recherche
   */
  search: (query: string) => API.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}`),
};
