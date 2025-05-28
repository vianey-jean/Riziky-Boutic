
import { useState, useEffect } from 'react';
import { Category } from '@/types/category';
import { categoriesAPI } from '@/services/categoriesAPI';

export const useCategoriesForProducts = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await categoriesAPI.getActive();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        // Fallback vers les catégories par défaut si l'API échoue
        setCategories([
          { id: '1', name: 'perruques', description: '', order: 1, isActive: true, createdAt: '' },
          { id: '2', name: 'tissages', description: '', order: 2, isActive: true, createdAt: '' },
          { id: '3', name: 'queue de cheval', description: '', order: 3, isActive: true, createdAt: '' },
          { id: '4', name: 'peigne chauffante', description: '', order: 4, isActive: true, createdAt: '' },
          { id: '5', name: 'colle - dissolvant', description: '', order: 5, isActive: true, createdAt: '' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
};
