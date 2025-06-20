
/**
 * SERVICE DE SÉCURISATION DES IDS - Module Principal
 * 
 * Ce module est le point d'entrée principal pour toutes les fonctionnalités
 * de sécurisation des IDs et routes. Il orchestre les autres modules spécialisés.
 */

// Imports des modules spécialisés
import { 
  generateSecureId as coreGenerateSecureId, 
  EntityType, 
  extractEntityType as coreExtractEntityType 
} from './security/core/secureIdGenerator';

import { 
  storeIdMapping, 
  getSecureIdFromReal, 
  getRealIdFromSecure, 
  resetMappings 
} from './security/storage/mappingStorage';

import { 
  getSecureRoute as routingGetSecureRoute, 
  getRealRoute as routingGetRealRoute, 
  initializeSecureRoutes as routingInitSecureRoutes 
} from './security/routing/routeSecurity';

import { 
  isValidSecureId as validatorIsValidSecureId, 
  isValidSecureOrderId, 
  isValidSecureProductId 
} from './security/validation/securityValidator';

// Réexport des types pour compatibilité
export type { EntityType };

/**
 * Génère un ID sécurisé pour un ID réel donné
 * @param realId - L'ID réel à sécuriser
 * @param type - Type d'entité (produit, commande, etc.)
 * @returns ID sécurisé unique
 */
export const generateSecureId = (realId: string, type: EntityType = 'product'): string => {
  const secureId = coreGenerateSecureId(realId, type);
  storeIdMapping(realId, secureId);
  
  console.log(`🔐 ID sécurisé généré: ${type} ${realId} → ${secureId}`);
  return secureId;
};

/**
 * Obtient l'ID réel à partir d'un ID sécurisé
 * @param secureId - L'ID sécurisé
 * @returns L'ID réel correspondant ou undefined si non trouvé
 */
export const getRealId = (secureId: string): string | undefined => {
  return getRealIdFromSecure(secureId);
};

/**
 * Obtient l'ID sécurisé pour un ID réel (génère si nécessaire)
 * @param realId - L'ID réel
 * @param type - Type d'entité
 * @returns L'ID sécurisé correspondant
 */
export const getSecureId = (realId: string, type: EntityType = 'product'): string => {
  // Vérifier si un ID sécurisé existe déjà
  const existingId = getSecureIdFromReal(realId);
  
  if (existingId) {
    // Pour les commandes, vérifier le format spécial
    if (type === 'order' && !existingId.includes('_')) {
      return existingId;
    }
    
    // Pour les autres types, vérifier le préfixe
    if (existingId.startsWith(`${type}_`)) {
      return existingId;
    }
  }
  
  // Générer un nouvel ID si nécessaire
  return generateSecureId(realId, type);
};

/**
 * Raccourci pour obtenir un ID sécurisé de produit
 * @param productId - L'ID du produit
 * @returns L'ID sécurisé du produit
 */
export const getSecureProductId = (productId: string): string => {
  return getSecureId(productId, 'product');
};

/**
 * Raccourci pour obtenir un ID sécurisé de commande
 * @param orderId - L'ID de la commande
 * @returns L'ID sécurisé de la commande
 */
export const getSecureOrderId = (orderId: string): string => {
  return getSecureId(orderId, 'order');
};

/**
 * Obtient une route sécurisée pour une route donnée
 * @param routePath - Chemin de la route réelle
 * @returns Route sécurisée
 */
export const getSecureRoute = (routePath: string): string => {
  return routingGetSecureRoute(routePath);
};

/**
 * Obtient la route réelle à partir d'une route sécurisée
 * @param secureRoute - Route sécurisée (sans le '/' initial)
 * @returns La route réelle ou undefined si non trouvée
 */
export const getRealRoute = (secureRoute: string): string | undefined => {
  return routingGetRealRoute(secureRoute);
};

/**
 * Vérifie si un ID sécurisé est valide
 * @param secureId - L'ID sécurisé à vérifier
 * @returns true si l'ID est valide, false sinon
 */
export const isValidSecureId = (secureId: string): boolean => {
  return validatorIsValidSecureId(secureId);
};

/**
 * Obtient le type d'entité à partir d'un ID sécurisé
 * @param secureId - L'ID sécurisé
 * @returns Le type d'entité ou undefined si non trouvé
 */
export const getEntityType = (secureId: string): EntityType | undefined => {
  return coreExtractEntityType(secureId);
};

/**
 * Réinitialise tous les mappings d'IDs
 * À appeler lors de la déconnexion ou du changement de navigation
 */
export const resetSecureIds = (): void => {
  resetMappings();
};

/**
 * Initialise les routes sécurisées
 * @returns Map des routes sécurisées initialisées
 */
export const initSecureRoutes = (): Map<string, string> => {
  return routingInitSecureRoutes();
};

// Fonctions de validation spécialisées pour compatibilité
export { isValidSecureOrderId, isValidSecureProductId };

// Initialisation automatique des routes au chargement
initSecureRoutes();

console.log('🔐 Service de sécurisation des IDs initialisé');
