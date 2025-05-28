
import { useState, useEffect } from 'react';
import { Category } from '@/types/category';
import { categoriesAPI } from '@/services/categoriesAPI';
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
