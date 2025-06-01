
/**
 * Service API pour la gestion des catégories
 * 
 * Fournit toutes les méthodes pour interagir avec l'API backend
 * concernant les catégories de produits (CRUD complet)
 */

import { apiClient } from '../core/apiClient';
import { Category, CategoryFormData } from '@/types/category';

// Object contenant toutes les méthodes d'interaction avec l'API des catégories
export const categoriesService = {
  // Récupérer toutes les catégories (actives et inactives)
  getAll: () => apiClient.get<Category[]>('/categories'),
  
  // Récupérer uniquement les catégories actives (pour affichage public)
  getActive: () => apiClient.get<Category[]>('/categories/active'),
  
  // Récupérer une catégorie spécifique par son ID
  getById: (id: string) => apiClient.get<Category>(`/categories/${id}`),
  
  // Créer une nouvelle catégorie
  create: (data: CategoryFormData) => apiClient.post<Category>('/categories', data),
  
  // Mettre à jour une catégorie existante (mise à jour partielle possible)
  update: (id: string, data: Partial<CategoryFormData>) => apiClient.put<Category>(`/categories/${id}`, data),
  
  // Supprimer une catégorie
  delete: (id: string) => apiClient.delete(`/categories/${id}`),
};
