
/**
 * @fileoverview Hook personnalisé pour la gestion des catégories de produits
 * 
 * Ce hook gère la récupération et le cache des catégories de produits
 * avec option de filtrage par statut actif/inactif.
 * 
 * Fonctionnalités:
 * - Récupération automatique des catégories
 * - Filtrage par statut actif (optionnel)
 * - Gestion d'état de chargement
 * - Validation du format des données
 * - Gestion d'erreurs avec notifications
 * - Fonction de rechargement manuel
 * - Cache local des catégories
 * 
 * @param activeOnly - Si true, récupère seulement les catégories actives
 * @returns Objet contenant categories, loading, fetchCategories
 * 
 * @version 2.0.0
 * @author Equipe Riziky-Boutic
 */

import { useState, useEffect } from 'react';
import { Category } from '@/types/category';
import { categoriesAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export const useCategories = (activeOnly: boolean = false) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = activeOnly 
        ? await categoriesAPI.getActive()
        : await categoriesAPI.getAll();
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Format de données incorrect pour les catégories');
      }
      
      setCategories(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des catégories",
        variant: "destructive",
      });
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [activeOnly]);

  return {
    categories,
    loading,
    fetchCategories
  };
};
