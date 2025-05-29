
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { productsAPI } from '@/services/api';
import { toast } from '@/components/ui/sonner';

export const useProducts = (categoryName?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (categoryName?: string) => {
    setLoading(true);
    try {
      let response;
      if (categoryName) {
        response = await productsAPI.getByCategory(categoryName);
      } else {
        response = await productsAPI.getAll();
      }
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Format de données incorrect pour les produits');
      }
      
      setProducts(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      toast.error('Erreur lors du chargement des produits');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(categoryName);
  }, [categoryName]);

  // Vérification périodique des promotions expirées
  useEffect(() => {
    const checkPromotions = () => {
      const now = new Date();
      const updatedProducts = products.map(product => {
        if (product.promotion && product.promotionEnd && new Date(product.promotionEnd) < now) {
          return {
            ...product,
            price: product.originalPrice || product.price,
            promotion: null,
            promotionEnd: null
          };
        }
        return product;
      });
      
      if (JSON.stringify(updatedProducts) !== JSON.stringify(products)) {
        setProducts(updatedProducts);
      }
    };
    
    const interval = setInterval(checkPromotions, 60000);
    return () => clearInterval(interval);
  }, [products]);

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  return {
    products,
    loading,
    fetchProducts,
    getProductById
  };
};
