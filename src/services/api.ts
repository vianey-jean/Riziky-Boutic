
/**
 * @fileoverview Point d'entrée principal pour toutes les APIs du projet Riziky-Boutic
 * 
 * Ce fichier centralise l'exportation de tous les services API et maintient
 * la compatibilité avec l'ancien système d'API pour faciliter la migration.
 * 
 * Architecture:
 * - Nouveaux services modulaires dans ./modules/
 * - API client centralisé dans ./core/apiClient
 * - APIs legacy maintenues pour compatibilité
 * 
 * @version 2.0.0
 * @author Equipe Riziky-Boutic
 */

// ============================================================================
// EXPORTS PRINCIPAUX - NOUVELLE ARCHITECTURE
// ============================================================================

/**
 * Client API principal - point d'entrée pour toutes les requêtes HTTP
 * Inclut la gestion des tokens, intercepteurs et configuration centralisée
 */
export { apiClient as API } from './core/apiClient';

// ============================================================================
// SERVICES MODULAIRES - ARCHITECTURE MODERNE
// ============================================================================

/**
 * Service d'authentification - gestion des utilisateurs, JWT, sessions
 * @example const user = await authAPI.login(credentials)
 */
export { authService as authAPI } from './modules/auth.service';

/**
 * Service produits - catalogue, recherche, gestion stock
 * @example const products = await productsAPI.getAll()
 */
export { productsService as productsAPI } from './modules/products.service';

/**
 * Service panier - ajout/suppression d'articles, calculs
 * @example await cartAPI.addItem(userId, productId, quantity)
 */
export { cartService as cartAPI } from './modules/cart.service';

/**
 * Service commandes - création, suivi, historique
 * @example const order = await ordersAPI.create(orderData)
 */
export { ordersService as ordersAPI } from './modules/orders.service';

/**
 * Service catégories - gestion des catégories produits
 * @example const categories = await categoriesAPI.getActive()
 */
export { categoriesService as categoriesAPI } from './modules/categories.service';

/**
 * Service ventes flash - promotions temporaires, timers
 * @example const flashSales = await flashSaleAPI.getActive()
 */
export { flashSaleService as flashSaleAPI } from './modules/flashSale.service';

// Import pour compatibilité legacy
import { cartService } from './modules/cart.service';

// ============================================================================
// COMPATIBILITÉ LEGACY - À MAINTENIR POUR MIGRATION GRADUELLE
// ============================================================================

/**
 * APIs legacy maintenues pour compatibilité avec l'ancien code
 * Ces exports seront progressivement migrés vers les nouveaux services
 */
export { favoritesAPI } from './favoritesAPI';
export { reviewsAPI } from './reviewsAPI';
export { contactsAPI } from './contactsAPI';
export { adminChatAPI, clientChatAPI } from './chatAPI';
export { codePromosAPI, codePromoAPI } from './codePromosAPI';
export { remboursementsAPI } from './remboursementsAPI';

/**
 * Alias legacy pour le panier - maintient la compatibilité avec l'ancien nom "panierAPI"
 * @deprecated Utiliser cartAPI à la place
 */
export const panierAPI = {
  /** Récupère le panier d'un utilisateur */
  get: (userId: string) => cartService.get(userId),
  /** Ajoute un article au panier */
  addItem: (userId: string, productId: string, quantity: number = 1) => 
    cartService.addItem(userId, productId, quantity),
  /** Met à jour la quantité d'un article */
  updateItem: (userId: string, productId: string, quantity: number) => 
    cartService.updateItem(userId, productId, quantity),
  /** Supprime un article du panier */
  removeItem: (userId: string, productId: string) => 
    cartService.removeItem(userId, productId),
  /** Vide complètement le panier */
  clear: (userId: string) => cartService.clear(userId),
};

// ============================================================================
// EXPORT PAR DÉFAUT
// ============================================================================

/**
 * Export par défaut pour compatibilité avec les imports existants
 * @deprecated Utiliser les exports nommés spécifiques
 */
import { apiClient } from './core/apiClient';
export default apiClient;

// Type exports
export type { Product } from '@/types/product';
export type { User, AuthResponse, LoginData, RegisterData, UpdateProfileData } from '@/types/auth';
export type { Cart, CartItem, StoreCartItem } from '@/types/cart';
export type { Order, OrderItem, ShippingAddress } from '@/types/order';
export type { Review, ReviewFormData } from '@/types/review';
export type { Contact } from '@/types/contact';
export type { Favorites } from '@/types/favorites';
export type { CodePromo } from '@/types/codePromo';
export type { Remboursement, RemboursementFormData } from '@/types/remboursement';
export type { Message, Conversation, ServiceConversation } from '@/types/chat';
export type { FlashSale, FlashSaleFormData } from '@/types/flashSale';
export type { Category, CategoryFormData } from '@/types/category';
