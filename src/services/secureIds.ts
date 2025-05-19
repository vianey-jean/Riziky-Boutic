
import { nanoid } from 'nanoid';

// Stockage en mémoire des mappings entre IDs sécurisés et IDs réels
const secureIdMap = new Map<string, string>();
const reverseMap = new Map<string, string>();

/**
 * Génère un ID sécurisé pour un ID réel donné
 * @param realId L'ID réel du produit
 * @returns Un ID sécurisé unique
 */
export const generateSecureId = (realId: string): string => {
  // Générer un ID sécurisé aléatoire
  const secureId = `${nanoid(16)}_${Date.now().toString(36)}`;
  
  // Stocker la correspondance dans les maps
  secureIdMap.set(realId, secureId);
  reverseMap.set(secureId, realId);
  
  return secureId;
};

/**
 * Obtient l'ID réel à partir d'un ID sécurisé
 * @param secureId L'ID sécurisé
 * @returns L'ID réel correspondant ou undefined si non trouvé
 */
export const getRealId = (secureId: string): string | undefined => {
  return reverseMap.get(secureId);
};

/**
 * Obtient l'ID sécurisé pour un ID réel
 * Si un ID sécurisé existe déjà, le remplacer par un nouveau
 * @param realId L'ID réel
 * @returns L'ID sécurisé
 */
export const getSecureId = (realId: string): string => {
  return generateSecureId(realId);
};

/**
 * Réinitialise tous les mappings d'IDs
 * À appeler lors de la déconnexion ou du changement de navigation
 */
export const resetSecureIds = (): void => {
  secureIdMap.clear();
  reverseMap.clear();
};
