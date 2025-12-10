/**
 * @file paiementRemboursement.ts
 * @description Types TypeScript pour le système de paiement de remboursement.
 * Définit les interfaces utilisées pour la gestion des remboursements acceptés.
 * 
 * @module types/paiementRemboursement
 */

/**
 * Interface principale représentant un paiement de remboursement.
 * Créé automatiquement lorsqu'une demande de remboursement est acceptée.
 * 
 * @interface PaiementRemboursement
 * 
 * @property {string} id - Identifiant unique du paiement (format: "PR-{timestamp}")
 * @property {string} remboursementId - Référence à la demande de remboursement originale
 * @property {string} orderId - Référence à la commande concernée
 * @property {string} userId - ID de l'utilisateur bénéficiaire
 * @property {string} userName - Nom complet de l'utilisateur
 * @property {string} userEmail - Email de l'utilisateur
 * @property {OrderDetails} order - Détails complets de la commande
 * @property {string} reason - Raison du remboursement (catégorie)
 * @property {string} [customReason] - Raison personnalisée optionnelle
 * @property {'debut' | 'en cours' | 'payé'} status - Statut actuel du paiement
 * @property {'accepté' | 'refusé'} decision - Décision prise sur la demande
 * @property {boolean} clientValidated - Confirmation de réception par le client
 * @property {string} createdAt - Date de création ISO
 * @property {string} updatedAt - Date de dernière mise à jour ISO
 */
export interface PaiementRemboursement {
  /** Identifiant unique du paiement (format: "PR-{timestamp}") */
  id: string;
  
  /** Référence à la demande de remboursement originale */
  remboursementId: string;
  
  /** Référence à la commande concernée */
  orderId: string;
  
  /** ID de l'utilisateur bénéficiaire */
  userId: string;
  
  /** Nom complet de l'utilisateur */
  userName: string;
  
  /** Email de l'utilisateur */
  userEmail: string;
  
  /** Détails complets de la commande associée */
  order: {
    /** ID de la commande */
    id: string;
    
    /** Montant total à rembourser (après remises et taxes) */
    totalAmount: number;
    
    /** Montant original avant remises */
    originalAmount: number;
    
    /** Montant de la remise appliquée */
    discount: number;
    
    /** Sous-total des produits avant taxes */
    subtotalProduits?: number;
    
    /** Sous-total après application des promotions */
    subtotalApresPromo?: number;
    
    /** Taux de TVA appliqué (ex: 0.2 pour 20%) */
    taxRate?: number;
    
    /** Montant de la TVA */
    taxAmount?: number;
    
    /** Frais de livraison */
    deliveryPrice?: number;
    
    /** Adresse de livraison */
    shippingAddress: {
      nom: string;
      prenom: string;
      adresse: string;
      ville: string;
      codePostal: string;
      pays: string;
      telephone: string;
    };
    
    /** Mode de paiement utilisé ('cash', 'card', 'paypal', 'apple_pay') */
    paymentMethod: string;
    
    /** Liste des articles de la commande */
    items: Array<{
      productId: string;
      name: string;
      price: number;
      originalPrice: number;
      quantity: number;
      image?: string;
      subtotal: number;
    }>;
    
    /** Date de création de la commande */
    createdAt: string;
  };
  
  /** Raison du remboursement (catégorie prédéfinie) */
  reason: string;
  
  /** Raison personnalisée fournie par le client */
  customReason?: string;
  
  /** 
   * Statut actuel du paiement de remboursement
   * - 'debut': En attente de traitement
   * - 'en cours': Traitement en cours par l'admin
   * - 'payé': Paiement effectué, en attente de confirmation client
   */
  status: 'debut' | 'en cours' | 'payé';
  
  /** Décision prise sur la demande de remboursement */
  decision: 'accepté' | 'refusé';
  
  /** Indique si le client a confirmé la réception du paiement */
  clientValidated: boolean;
  
  /** Date de création du paiement (format ISO) */
  createdAt: string;
  
  /** Date de dernière mise à jour (format ISO) */
  updatedAt: string;
}
