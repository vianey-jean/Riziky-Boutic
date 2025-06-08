
import { nanoid } from 'nanoid';

// Stockage en mémoire des mappings entre noms de catégories et IDs sécurisés
const categorySecureMap = new Map<string, string>();
const reverseSecureMap = new Map<string, string>();

/**
 * Génère un ID sécurisé pour une catégorie
 * @param categoryName Nom de la catégorie
 * @returns ID sécurisé unique
 */
export const generateSecureCategoryId = (categoryName: string): string => {
  // Vérifier si un ID sécurisé existe déjà pour cette catégorie
  if (categorySecureMap.has(categoryName)) {
    return categorySecureMap.get(categoryName)!;
  }
  
  // Générer un nouvel ID sécurisé
  const secureId = nanoid(12);
  
  // Stocker les mappings
  categorySecureMap.set(categoryName, secureId);
  reverseSecureMap.set(secureId, categoryName);
  
  return secureId;
};

/**
 * Obtient le nom réel de la catégorie à partir d'un ID sécurisé
 * @param secureId ID sécurisé
 * @returns Nom réel de la catégorie ou undefined
 */
export const getRealCategoryName = (secureId: string): string | undefined => {
  return reverseSecureMap.get(secureId);
};

/**
 * Obtient l'ID sécurisé pour une catégorie
 * @param categoryName Nom de la catégorie
 * @returns ID sécurisé
 */
export const getSecureCategoryId = (categoryName: string): string => {
  return generateSecureCategoryId(categoryName);
};
