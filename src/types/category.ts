
/**
 * Types et interfaces pour la gestion des catégories de produits
 * 
 * Ce fichier définit la structure des données pour les catégories,
 * incluant les types pour l'affichage et la gestion administrative
 */

// Interface principale pour une catégorie de produit
export interface Category {
  id: string;                    // Identifiant unique de la catégorie
  name: string;                  // Nom de la catégorie affiché aux utilisateurs
  description: string;           // Description détaillée de la catégorie
  order: number;                 // Ordre d'affichage dans les menus
  isActive: boolean;             // Statut actif/inactif pour l'affichage
  createdAt: string;             // Date de création (ISO string)
  updatedAt?: string;            // Date de dernière modification (optionnelle)
}

// Interface pour les données de formulaire de création/modification
export interface CategoryFormData {
  name: string;                  // Nom de la catégorie (requis)
  description: string;           // Description de la catégorie (requis)
  order: number;                 // Position dans l'ordre d'affichage
  isActive: boolean;             // Statut d'activation
}
