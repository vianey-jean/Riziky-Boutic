
import { nanoid } from 'nanoid';

// Stockage en mémoire des mappings entre IDs sécurisés et IDs réels
// Utilisation du localStorage pour persister les mappings entre les navigations
const SECURE_ID_MAP_KEY = 'secure_id_map';
const REVERSE_MAP_KEY = 'reverse_map';
const STATIC_ROUTES_KEY = 'static_secure_routes';

// Tenter de charger les mappings depuis le localStorage
let secureIdMap: Map<string, string>;
let reverseMap: Map<string, string>;
let staticSecureRoutes: Map<string, string>;

try {
  const savedSecureIdMap = localStorage.getItem(SECURE_ID_MAP_KEY);
  const savedReverseMap = localStorage.getItem(REVERSE_MAP_KEY);
  const savedStaticRoutes = localStorage.getItem(STATIC_ROUTES_KEY);
  
  secureIdMap = savedSecureIdMap ? new Map(JSON.parse(savedSecureIdMap)) : new Map<string, string>();
  reverseMap = savedReverseMap ? new Map(JSON.parse(savedReverseMap)) : new Map<string, string>();
  staticSecureRoutes = savedStaticRoutes ? new Map(JSON.parse(savedStaticRoutes)) : new Map<string, string>();
} catch (error) {
  console.error('Erreur lors du chargement des mappings sécurisés:', error);
  secureIdMap = new Map<string, string>();
  reverseMap = new Map<string, string>();
  staticSecureRoutes = new Map<string, string>();
}

// Fonction pour sauvegarder les mappings dans localStorage
const saveMappings = () => {
  try {
    localStorage.setItem(SECURE_ID_MAP_KEY, JSON.stringify(Array.from(secureIdMap.entries())));
    localStorage.setItem(REVERSE_MAP_KEY, JSON.stringify(Array.from(reverseMap.entries())));
    localStorage.setItem(STATIC_ROUTES_KEY, JSON.stringify(Array.from(staticSecureRoutes.entries())));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des mappings sécurisés:', error);
  }
};

// Type d'entité pour identifier les différentes sections sécurisées
export type EntityType = 'product' | 'admin' | 'profile' | 'orders';

/**
 * Génère un ID sécurisé pour un ID réel donné
 * @param realId L'ID réel
 * @param type Type d'entité (produit, admin, etc.)
 * @returns Un ID sécurisé unique
 */
export const generateSecureId = (realId: string, type: EntityType = 'product'): string => {
  // Générer un ID sécurisé aléatoire avec un préfixe pour le type
  const secureId = `${type}_${nanoid(16)}_${Date.now().toString(36)}`;
  
  // Stocker la correspondance dans les maps
  secureIdMap.set(realId, secureId);
  reverseMap.set(secureId, realId);
  
  // Sauvegarder les mappings
  saveMappings();
  
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
 * @param type Type d'entité (produit, admin, etc.)
 * @returns L'ID sécurisé
 */
export const getSecureId = (realId: string, type: EntityType = 'product'): string => {
  // Vérifier si l'ID réel existe déjà
  const existingId = secureIdMap.get(realId);
  
  // Si l'ID existe et a le bon type, le réutiliser
  if (existingId && existingId.startsWith(`${type}_`)) {
    return existingId;
  }
  
  // Sinon, générer un nouvel ID
  return generateSecureId(realId, type);
};

/**
 * Obtient un ID sécurisé spécifiquement pour un produit
 * @param productId L'ID du produit
 * @param type Type d'entité (par défaut 'product')
 * @returns L'ID sécurisé du produit
 */
export const getSecureProductId = (productId: string, type: EntityType = 'product'): string => {
  return getSecureId(productId, type);
};

/**
 * Réinitialise tous les mappings d'IDs
 * À appeler lors de la déconnexion ou du changement de navigation
 */
export const resetSecureIds = (): void => {
  // Ne pas réinitialiser les routes statiques pour éviter des problèmes de navigation
  // Seulement réinitialiser les IDs dynamiques (produits, etc.)
  const routesToKeep = new Map<string, string>();
  
  // Garder les routes statiques
  staticSecureRoutes.forEach((realRoute, secureRoute) => {
    routesToKeep.set(secureRoute, realRoute);
  });
  
  // Vider les maps
  secureIdMap.clear();
  reverseMap.clear();
  
  // Restaurer les routes statiques dans reverseMap
  routesToKeep.forEach((realRoute, secureRoute) => {
    reverseMap.set(secureRoute, realRoute);
  });
  
  // Sauvegarder les changements
  saveMappings();
  
  console.log("IDs sécurisés réinitialisés, routes statiques conservées");
};

/**
 * Vérifier si un ID sécurisé est valide
 * @param secureId L'ID sécurisé à vérifier
 * @returns true si l'ID est valide, false sinon
 */
export const isValidSecureId = (secureId: string): boolean => {
  if (!secureId) return false;
  return reverseMap.has(secureId);
};

/**
 * Obtenir le type d'entité à partir d'un ID sécurisé
 * @param secureId L'ID sécurisé
 * @returns Le type d'entité ou undefined si non trouvé
 */
export const getEntityType = (secureId: string): EntityType | undefined => {
  if (!secureId) return undefined;
  const parts = secureId.split('_');
  if (parts.length < 2) return undefined;
  
  return parts[0] as EntityType;
};

/**
 * Obtient ou génère une route sécurisée pour une route statique
 * @param routePath Chemin de la route réelle (ex: '/admin/produits')
 * @returns Une route sécurisée (ex: '/admin_xyz123')
 */
export const getSecureRoute = (routePath: string): string => {
  // Si la route existe déjà, la retourner
  if (staticSecureRoutes.has(routePath)) {
    return staticSecureRoutes.get(routePath)!;
  }
  
  // Sinon, générer une nouvelle route sécurisée
  const secureRoute = `/${nanoid(24)}`;
  staticSecureRoutes.set(routePath, secureRoute);
  reverseMap.set(secureRoute.substring(1), routePath);
  
  // Sauvegarder les mappings
  saveMappings();
  
  return secureRoute;
};

/**
 * Obtient la route réelle à partir d'une route sécurisée
 * @param secureRoute Route sécurisée (sans le '/' initial)
 * @returns La route réelle ou undefined si non trouvée
 */
export const getRealRoute = (secureRoute: string): string | undefined => {
  return reverseMap.get(secureRoute);
};

// Initialisation des routes statiques si elles n'existent pas
export const initSecureRoutes = () => {
  const routesToInit = [
    '/admin',
    '/admin/produits',
    '/admin/utilisateurs',
    '/admin/messages',
    '/admin/parametres', 
    '/admin/commandes',
    '/admin/service-client',
    '/admin/pub-layout',
    '/admin/remboursements',
    '/admin/flash-sales',
    '/flash-sale/:id',
    '/profil',
    '/commandes',
    '/panier',
    '/favoris',
    '/paiement',
    // Ajout des routes d'authentification
    '/login',
    '/register',
    '/forgot-password',
    // Ajout de la route tous-les-produits
    '/tous-les-produits'
  ];
  
  let hasNewRoutes = false;
  
  routesToInit.forEach(route => {
    if (!staticSecureRoutes.has(route)) {
      const secureRoute = `/${nanoid(24)}`;
      staticSecureRoutes.set(route, secureRoute);
      reverseMap.set(secureRoute.substring(1), route);
      hasNewRoutes = true;
    }
  });
  
  if (hasNewRoutes) {
    saveMappings();
  }
  
  return staticSecureRoutes;
};
