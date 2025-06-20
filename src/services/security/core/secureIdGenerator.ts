
import { nanoid } from 'nanoid';

/**
 * GÉNÉRATEUR D'IDS SÉCURISÉS - Module Central
 * 
 * Ce module gère la génération d'identifiants sécurisés pour différents types d'entités.
 * Il utilise nanoid pour créer des IDs uniques et non prédictibles.
 */

// Types d'entités supportées pour la sécurisation
export type EntityType = 'product' | 'admin' | 'profile' | 'orders' | 'order';

/**
 * Génère un ID sécurisé pour un type d'entité donné
 * @param realId - L'ID réel à sécuriser
 * @param type - Type d'entité (product, order, etc.)
 * @returns ID sécurisé généré
 */
export const generateSecureId = (realId: string, type: EntityType = 'product'): string => {
  // Pour les commandes, générer un ID complètement aléatoire sans préfixe
  if (type === 'order') {
    return nanoid(32);
  }
  
  // Générer un ID sécurisé avec préfixe pour autres types
  const timestamp = Date.now().toString(36);
  const randomPart = nanoid(16);
  
  return `${type}_${randomPart}_${timestamp}`;
};

/**
 * Génère une route sécurisée pour les pages statiques
 * @returns Route sécurisée aléatoire
 */
export const generateSecureRoute = (): string => {
  return `/${nanoid(24)}`;
};

/**
 * Valide le format d'un ID sécurisé
 * @param secureId - ID à valider
 * @returns true si le format est valide
 */
export const isValidSecureIdFormat = (secureId: string): boolean => {
  if (!secureId || typeof secureId !== 'string') {
    return false;
  }
  
  // Vérifier si c'est un ID de commande (32 caractères sans préfixe)
  if (secureId.length === 32 && !secureId.includes('_')) {
    return true;
  }
  
  // Vérifier si c'est un ID avec préfixe (type_randomPart_timestamp)
  const parts = secureId.split('_');
  return parts.length >= 3 && parts[0].length > 0;
};

/**
 * Extrait le type d'entité d'un ID sécurisé
 * @param secureId - ID sécurisé
 * @returns Type d'entité ou 'order' si c'est un ID de commande
 */
export const extractEntityType = (secureId: string): EntityType | undefined => {
  if (!secureId) return undefined;
  
  // Si c'est un ID de commande (32 caractères sans préfixe)
  if (secureId.length === 32 && !secureId.includes('_')) {
    return 'order';
  }
  
  // Extraire le type depuis le préfixe
  const parts = secureId.split('_');
  if (parts.length < 2) return undefined;
  
  return parts[0] as EntityType;
};
