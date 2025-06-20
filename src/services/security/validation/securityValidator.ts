
import { EntityType, extractEntityType, isValidSecureIdFormat } from '../core/secureIdGenerator';
import { hasSecureId, getRealIdFromSecure } from '../storage/mappingStorage';
import { isValidSecureRoute, getRealRoute } from '../routing/routeSecurity';

/**
 * VALIDATEUR DE SÉCURITÉ - Module de Validation des IDs et Routes
 * 
 * Ce module centralise toutes les validations de sécurité pour les IDs
 * et routes sécurisés de l'application.
 */

/**
 * Valide complètement un ID sécurisé
 * Vérifie le format ET l'existence dans les mappings
 * @param secureId - ID à valider
 * @returns true si l'ID est valide et existe
 */
export const isValidSecureId = (secureId: string): boolean => {
  // Vérification du format
  if (!isValidSecureIdFormat(secureId)) {
    return false;
  }

  // Vérification de l'existence dans les mappings
  return hasSecureId(secureId);
};

/**
 * Valide un ID de commande sécurisé spécifiquement
 * @param secureOrderId - ID de commande à valider
 * @returns true si l'ID de commande est valide
 */
export const isValidSecureOrderId = (secureOrderId: string): boolean => {
  if (!isValidSecureId(secureOrderId)) {
    return false;
  }

  // Vérifier que c'est bien un ID de commande
  const entityType = extractEntityType(secureOrderId);
  if (entityType !== 'order') {
    return false;
  }

  // Vérifier que l'ID réel commence par 'ORD-'
  const realId = getRealIdFromSecure(secureOrderId);
  return realId?.startsWith('ORD-') === true;
};

/**
 * Valide un ID de produit sécurisé spécifiquement
 * @param secureProductId - ID de produit à valider
 * @returns true si l'ID de produit est valide
 */
export const isValidSecureProductId = (secureProductId: string): boolean => {
  if (!isValidSecureId(secureProductId)) {
    return false;
  }

  // Vérifier que c'est bien un ID de produit
  const entityType = extractEntityType(secureProductId);
  return entityType === 'product';
};

/**
 * Valide une route d'accès sécurisée
 * @param path - Chemin de la route à valider
 * @returns true si la route est valide et autorisée
 */
export const validateSecureRoute = (path: string): boolean => {
  if (!path || typeof path !== 'string') {
    return false;
  }

  // Vérifier si c'est une route sécurisée valide
  return isValidSecureRoute(path);
};

/**
 * Valide l'accès à une route protégée
 * @param path - Chemin à valider
 * @param userRole - Rôle de l'utilisateur (optionnel)
 * @returns Objet de validation avec détails
 */
export const validateRouteAccess = (
  path: string, 
  userRole?: string
): {
  isValid: boolean;
  isPublic: boolean;
  requiresAuth: boolean;
  realRoute?: string;
  error?: string;
} => {
  // Routes publiques autorisées
  const publicRoutes = [
    'flash-sale', 'products', 'categories', 'home', 
    'contact', 'about', 'login', 'register'
  ];

  const isPublic = publicRoutes.some(route => path.startsWith(route));

  if (isPublic) {
    return {
      isValid: true,
      isPublic: true,
      requiresAuth: false
    };
  }

  // Vérifier si c'est une route sécurisée
  const realRoute = getRealRoute(path);
  
  if (!realRoute) {
    return {
      isValid: false,
      isPublic: false,
      requiresAuth: false,
      error: 'Route non trouvée ou non autorisée'
    };
  }

  // Vérifier les permissions pour les routes admin
  if (realRoute.startsWith('/admin')) {
    return {
      isValid: userRole === 'admin',
      isPublic: false,
      requiresAuth: true,
      realRoute,
      error: userRole !== 'admin' ? 'Accès administrateur requis' : undefined
    };
  }

  // Routes utilisateur authentifié
  const authRequiredRoutes = ['/profil', '/commandes', '/favoris', '/paiement'];
  const requiresAuth = authRequiredRoutes.some(route => realRoute.startsWith(route));

  return {
    isValid: true,
    isPublic: false,
    requiresAuth,
    realRoute
  };
};

/**
 * Valide les paramètres d'une URL sécurisée
 * @param params - Paramètres de l'URL à valider
 * @returns true si tous les paramètres sont valides
 */
export const validateUrlParams = (params: Record<string, string>): boolean => {
  for (const [key, value] of Object.entries(params)) {
    // Vérifier que les valeurs ne sont pas vides
    if (!value || typeof value !== 'string') {
      return false;
    }

    // Vérifier la longueur maximale
    if (value.length > 100) {
      return false;
    }

    // Vérifier qu'il n'y a pas de caractères suspects
    if (/<script|javascript:|data:/i.test(value)) {
      return false;
    }
  }

  return true;
};

/**
 * Sanitise une chaîne pour éviter les injections
 * @param input - Chaîne à sanitiser
 * @returns Chaîne sanitisée
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/[<>]/g, '') // Supprimer les balises HTML
    .trim() // Supprimer les espaces
    .substring(0, 1000); // Limiter la longueur
};

/**
 * Valide et sanitise les données d'entrée
 * @param data - Données à valider et sanitiser
 * @returns Données sanitisées ou null si invalides
 */
export const validateAndSanitizeData = (data: any): any => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const sanitized: any = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'number' && isFinite(value)) {
      sanitized[key] = value;
    } else if (typeof value === 'boolean') {
      sanitized[key] = value;
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeInput(item) : item
      );
    }
  }

  return sanitized;
};
