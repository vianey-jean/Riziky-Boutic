
import { generateSecureRoute } from '../core/secureIdGenerator';
import { 
  storeRouteMapping, 
  getSecureRouteFromReal, 
  getRealRouteFromSecure 
} from '../storage/mappingStorage';

/**
 * SÉCURITÉ DES ROUTES - Module de Gestion des Routes Sécurisées
 * 
 * Ce module gère la sécurisation des routes statiques de l'application
 * en créant des mappings entre routes réelles et routes sécurisées.
 */

// Liste des routes statiques à sécuriser
const ROUTES_TO_SECURE = [
  // Routes d'administration
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
  '/admin/categories',
  '/admin/code-promos',

  // Routes utilisateur protégées
  '/profil',
  '/commandes', 
  '/panier',
  '/favoris',
  '/paiement',
  '/commande/:orderId',

  // Routes d'authentification
  '/login',
  '/register',
  '/forgot-password',
  '/maintenance-login',

  // Routes produits et promotions
  '/tous-les-produits',
  '/promotions',
  '/nouveautes', 
  '/populaires',
  '/flash-sale/:id',
  '/flash-sale',

  // Pages d'information
  '/notre-histoire',
  '/faq',
  '/livraison',
  '/retours',
  '/contact',
  '/conditions-utilisation',
  '/politique-confidentialite',
  '/politique-cookies',
  '/service-client',
  '/chat',
  '/carrieres'
] as const;

/**
 * Génère ou récupère une route sécurisée pour une route donnée
 * @param routePath - Chemin de la route réelle (ex: '/admin/produits')
 * @returns Route sécurisée (ex: '/xyz123abc')
 */
export const getSecureRoute = (routePath: string): string => {
  // Vérifier si une route sécurisée existe déjà
  const existingSecureRoute = getSecureRouteFromReal(routePath);
  if (existingSecureRoute) {
    return existingSecureRoute;
  }

  // Générer une nouvelle route sécurisée
  const secureRoute = generateSecureRoute();
  storeRouteMapping(routePath, secureRoute);

  console.log(`🔐 Nouvelle route sécurisée créée: ${routePath} → ${secureRoute}`);
  return secureRoute;
};

/**
 * Récupère la route réelle à partir d'une route sécurisée
 * @param secureRoute - Route sécurisée (sans le '/' initial)
 * @returns Route réelle ou undefined si non trouvée
 */
export const getRealRoute = (secureRoute: string): string | undefined => {
  return getRealRouteFromSecure(secureRoute);
};

/**
 * Vérifie si une route est dans la liste des routes publiques autorisées
 * @param path - Chemin à vérifier
 * @returns true si la route est publique
 */
export const isPublicRoute = (path: string): boolean => {
  const publicRoutes = [
    'flash-sale',
    'products', 
    'categories',
    'home',
    'contact',
    'about',
    'login',
    'register',
    'cart',
    'favorites',
    'profile',
    'orders',
    'checkout'
  ];

  return publicRoutes.some(route => path.startsWith(route));
};

/**
 * Initialise toutes les routes sécurisées au démarrage
 * Crée les mappings pour toutes les routes statiques définies
 * @returns Map de toutes les routes sécurisées
 */
export const initializeSecureRoutes = (): Map<string, string> => {
  let hasNewRoutes = false;
  const secureRoutesMap = new Map<string, string>();

  ROUTES_TO_SECURE.forEach(route => {
    const existingSecureRoute = getSecureRouteFromReal(route);
    
    if (!existingSecureRoute) {
      // Créer une nouvelle route sécurisée
      const secureRoute = generateSecureRoute();
      storeRouteMapping(route, secureRoute);
      secureRoutesMap.set(route, secureRoute);
      hasNewRoutes = true;
    } else {
      // Utiliser la route existante
      secureRoutesMap.set(route, existingSecureRoute);
    }
  });

  if (hasNewRoutes) {
    console.log('🔐 Nouvelles routes sécurisées initialisées');
  }

  return secureRoutesMap;
};

/**
 * Valide qu'une route sécurisée est autorisée
 * @param secureRoute - Route sécurisée à valider
 * @returns true si la route est valide et autorisée
 */
export const isValidSecureRoute = (secureRoute: string): boolean => {
  const realRoute = getRealRoute(secureRoute);
  return realRoute !== undefined;
};

/**
 * Obtient la liste de toutes les routes sécurisées disponibles
 * @returns Array des routes réelles sécurisées
 */
export const getSecuredRoutesList = (): string[] => {
  return [...ROUTES_TO_SECURE];
};
