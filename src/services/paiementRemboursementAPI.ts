/**
 * @file paiementRemboursementAPI.ts
 * @description Service API pour la gestion des paiements de remboursement.
 * Fournit les méthodes CRUD et les actions spécifiques pour le suivi
 * des remboursements côté client et admin.
 * 
 * @module services/paiementRemboursementAPI
 * 
 * @example
 * // Récupérer les remboursements de l'utilisateur connecté
 * const { data } = await paiementRemboursementAPI.getUserPaiements();
 * 
 * // Mettre à jour le statut (admin)
 * await paiementRemboursementAPI.updateStatus(id, 'payé');
 * 
 * // Confirmer la réception (client)
 * await paiementRemboursementAPI.validatePayment(id);
 */

import { API } from './apiConfig';
import { PaiementRemboursement } from '@/types/paiementRemboursement';

/**
 * Service API pour les opérations sur les paiements de remboursement.
 * Toutes les routes nécessitent une authentification JWT.
 */
export const paiementRemboursementAPI = {
  /**
   * Récupère tous les paiements de remboursement.
   * Route réservée aux administrateurs.
   * 
   * @returns {Promise<{data: PaiementRemboursement[]}>} Liste de tous les remboursements
   * @throws {Error} Si l'utilisateur n'est pas admin
   */
  getAll: () => API.get<PaiementRemboursement[]>('/paiement-remboursement'),
  
  /**
   * Récupère les paiements de remboursement de l'utilisateur connecté.
   * Retourne uniquement les remboursements acceptés et non validés.
   * 
   * @returns {Promise<{data: PaiementRemboursement[]}>} Liste des remboursements de l'utilisateur
   */
  getUserPaiements: () => API.get<PaiementRemboursement[]>('/paiement-remboursement/user'),
  
  /**
   * Récupère un paiement de remboursement par son ID.
   * Un utilisateur ne peut voir que ses propres remboursements.
   * 
   * @param {string} id - Identifiant du paiement
   * @returns {Promise<{data: PaiementRemboursement}>} Détails du remboursement
   * @throws {Error} Si non trouvé ou non autorisé
   */
  getById: (id: string) => API.get<PaiementRemboursement>(`/paiement-remboursement/${id}`),
  
  /**
   * Met à jour le statut d'un paiement de remboursement.
   * Route réservée aux administrateurs.
   * Émet un événement Socket.IO 'paiement-remboursement-updated'.
   * 
   * @param {string} id - Identifiant du paiement
   * @param {string} status - Nouveau statut ('debut', 'en cours', 'payé')
   * @returns {Promise<{data: PaiementRemboursement}>} Remboursement mis à jour
   * @throws {Error} Si l'utilisateur n'est pas admin
   */
  updateStatus: (id: string, status: string) => 
    API.put(`/paiement-remboursement/${id}/status`, { status }),
  
  /**
   * Permet au client de valider la réception d'un paiement.
   * Marque clientValidated = true et fait disparaître le remboursement
   * de la liste active du client.
   * 
   * @param {string} id - Identifiant du paiement
   * @returns {Promise<{data: PaiementRemboursement}>} Remboursement validé
   * @throws {Error} Si non trouvé ou non autorisé
   */
  validatePayment: (id: string) => 
    API.put(`/paiement-remboursement/${id}/validate`),
  
  /**
   * Vérifie si l'utilisateur connecté a des remboursements acceptés en attente.
   * Utilisé pour afficher une notification ou un badge dans l'interface.
   * 
   * @returns {Promise<{data: {hasAcceptedRefunds: boolean}}>} Résultat de la vérification
   */
  hasAcceptedRefunds: () => 
    API.get<{ hasAcceptedRefunds: boolean }>('/paiement-remboursement/check'),
};
