
/**
 * STOCKAGE DES MAPPINGS SÉCURISÉS - Module de Persistance
 * 
 * Ce module gère la persistance des mappings entre IDs réels et IDs sécurisés
 * dans le localStorage du navigateur avec gestion d'erreurs robuste.
 */

// Clés pour le stockage dans localStorage
const STORAGE_KEYS = {
  SECURE_ID_MAP: 'secure_id_map',
  REVERSE_MAP: 'reverse_map', 
  STATIC_ROUTES: 'static_secure_routes'
} as const;

// Maps en mémoire pour les performances
let secureIdMap: Map<string, string>;
let reverseMap: Map<string, string>;
let staticSecureRoutes: Map<string, string>;

/**
 * Initialise les maps depuis le localStorage
 * Gère les erreurs de parsing et initialise des maps vides si nécessaire
 */
const initializeMaps = (): void => {
  try {
    // Chargement des mappings d'IDs sécurisés
    const savedSecureIdMap = localStorage.getItem(STORAGE_KEYS.SECURE_ID_MAP);
    secureIdMap = savedSecureIdMap ? 
      new Map(JSON.parse(savedSecureIdMap)) : 
      new Map<string, string>();

    // Chargement des mappings inversés
    const savedReverseMap = localStorage.getItem(STORAGE_KEYS.REVERSE_MAP);
    reverseMap = savedReverseMap ? 
      new Map(JSON.parse(savedReverseMap)) : 
      new Map<string, string>();

    // Chargement des routes statiques sécurisées
    const savedStaticRoutes = localStorage.getItem(STORAGE_KEYS.STATIC_ROUTES);
    staticSecureRoutes = savedStaticRoutes ? 
      new Map(JSON.parse(savedStaticRoutes)) : 
      new Map<string, string>();

  } catch (error) {
    console.error('❌ Erreur lors du chargement des mappings sécurisés:', error);
    // Initialiser des maps vides en cas d'erreur
    secureIdMap = new Map<string, string>();
    reverseMap = new Map<string, string>();
    staticSecureRoutes = new Map<string, string>();
  }
};

/**
 * Sauvegarde tous les mappings dans le localStorage
 * Gère les erreurs de sérialisation et de stockage
 */
const saveMappings = (): void => {
  try {
    // Sauvegarder les mappings d'IDs
    localStorage.setItem(
      STORAGE_KEYS.SECURE_ID_MAP, 
      JSON.stringify(Array.from(secureIdMap.entries()))
    );

    // Sauvegarder les mappings inversés
    localStorage.setItem(
      STORAGE_KEYS.REVERSE_MAP, 
      JSON.stringify(Array.from(reverseMap.entries()))
    );

    // Sauvegarder les routes statiques
    localStorage.setItem(
      STORAGE_KEYS.STATIC_ROUTES, 
      JSON.stringify(Array.from(staticSecureRoutes.entries()))
    );

  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde des mappings sécurisés:', error);
  }
};

/**
 * Stocke un mapping bidirectionnel entre ID réel et ID sécurisé
 * @param realId - ID réel
 * @param secureId - ID sécurisé correspondant
 */
export const storeIdMapping = (realId: string, secureId: string): void => {
  secureIdMap.set(realId, secureId);
  reverseMap.set(secureId, realId);
  saveMappings();
};

/**
 * Stocke un mapping de route statique sécurisée
 * @param realRoute - Route réelle
 * @param secureRoute - Route sécurisée correspondante
 */
export const storeRouteMapping = (realRoute: string, secureRoute: string): void => {
  staticSecureRoutes.set(realRoute, secureRoute);
  reverseMap.set(secureRoute.substring(1), realRoute); // Enlever le '/' initial
  saveMappings();
};

/**
 * Récupère l'ID sécurisé pour un ID réel
 * @param realId - ID réel à rechercher
 * @returns ID sécurisé ou undefined si non trouvé
 */
export const getSecureIdFromReal = (realId: string): string | undefined => {
  return secureIdMap.get(realId);
};

/**
 * Récupère l'ID réel pour un ID sécurisé
 * @param secureId - ID sécurisé à rechercher
 * @returns ID réel ou undefined si non trouvé
 */
export const getRealIdFromSecure = (secureId: string): string | undefined => {
  return reverseMap.get(secureId);
};

/**
 * Récupère la route sécurisée pour une route réelle
 * @param realRoute - Route réelle à rechercher
 * @returns Route sécurisée ou undefined si non trouvée
 */
export const getSecureRouteFromReal = (realRoute: string): string | undefined => {
  return staticSecureRoutes.get(realRoute);
};

/**
 * Récupère la route réelle pour une route sécurisée
 * @param secureRoute - Route sécurisée (sans le '/' initial)
 * @returns Route réelle ou undefined si non trouvée
 */
export const getRealRouteFromSecure = (secureRoute: string): string | undefined => {
  return reverseMap.get(secureRoute);
};

/**
 * Vérifie si un ID sécurisé existe dans les mappings
 * @param secureId - ID à vérifier
 * @returns true si l'ID existe
 */
export const hasSecureId = (secureId: string): boolean => {
  return reverseMap.has(secureId);
};

/**
 * Réinitialise tous les mappings en gardant les routes statiques
 * Utilisé lors de la déconnexion ou changement de session
 */
export const resetMappings = (): void => {
  // Sauvegarder les routes statiques
  const routesToKeep = new Map<string, string>();
  staticSecureRoutes.forEach((realRoute, secureRoute) => {
    routesToKeep.set(secureRoute, realRoute);
  });

  // Vider les maps d'IDs dynamiques
  secureIdMap.clear();
  reverseMap.clear();

  // Restaurer les routes statiques dans reverseMap
  routesToKeep.forEach((realRoute, secureRoute) => {
    reverseMap.set(secureRoute, realRoute);
  });

  saveMappings();
  console.log("🔄 Mappings réinitialisés, routes statiques conservées");
};

/**
 * Obtient toutes les routes statiques configurées
 * @returns Map des routes statiques
 */
export const getAllStaticRoutes = (): Map<string, string> => {
  return new Map(staticSecureRoutes);
};

// Initialiser les maps au chargement du module
initializeMaps();

// Exporter les maps pour usage externe si nécessaire
export { secureIdMap, reverseMap, staticSecureRoutes };
