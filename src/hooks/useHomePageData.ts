
import { useState } from 'react';
import { productsAPI } from '@/services/api';
import { Product } from '@/contexts/StoreContext';

export const useHomePageData = () => {
  const [featuredProductCatalog, setFeaturedProductCatalog] = useState<Product[]>([]);
  const [newArrivalProducts, setNewArrivalProducts] = useState<Product[]>([]);
  const [promotionalProducts, setPromotionalProducts] = useState<Product[]>([]);
  const [completeProductCatalog, setCompleteProductCatalog] = useState<Product[]>([]);
  const [filteredProductCatalog, setFilteredProductCatalog] = useState<Product[]>([]);
  const [dataLoadingComplete, setDataLoadingComplete] = useState(false);

  const loadEcommerceProductData = async () => {
    const productsResponse = await productsAPI.getAll();
    if (!productsResponse.data || !Array.isArray(productsResponse.data)) {
      throw new Error('Format de données produit incorrect - Conformité UE requise');
    }
    const productCatalog: Product[] = productsResponse.data;
    const sortedProductCatalog = [...productCatalog].sort((a, b) => a.name.localeCompare(b.name));
    
    setCompleteProductCatalog(sortedProductCatalog);
    setFilteredProductCatalog(sortedProductCatalog);

    try {
      const featuredResponse = await productsAPI.getMostFavorited();
      const featuredItems = Array.isArray(featuredResponse.data)
        ? featuredResponse.data.slice(0, 8)
        : productCatalog.slice(0, 8);
      setFeaturedProductCatalog(featuredItems);
    } catch (error) {
      console.error('Erreur chargement produits vedettes:', error);
      setFeaturedProductCatalog(productCatalog.slice(0, 8));
    }

    try {
      const newArrivalsResponse = await productsAPI.getNewArrivals();
      const newItems = Array.isArray(newArrivalsResponse.data)
        ? newArrivalsResponse.data.slice(0, 8)
        : [];
      setNewArrivalProducts(newItems);
    } catch (error) {
      console.error('Erreur chargement nouveautés:', error);
      const sortedByDate = [...productCatalog].sort((a, b) =>
        new Date(b.dateAjout || 0).getTime() - new Date(a.dateAjout || 0).getTime()
      );
      setNewArrivalProducts(sortedByDate.slice(0, 8));
    }

    const currentDate = new Date();
    const activePromotionalProducts = productCatalog.filter(product => 
      product.promotion && 
      product.promotionEnd && 
      new Date(product.promotionEnd) > currentDate
    );
    setPromotionalProducts(activePromotionalProducts.slice(0, 8));
    
    return productCatalog;
  };

  const handleDataLoadingSuccess = () => {
    setDataLoadingComplete(true);
  };

  const handleMaxRetriesReached = () => {
    setFeaturedProductCatalog([]);
    setNewArrivalProducts([]);
    setPromotionalProducts([]);
    setCompleteProductCatalog([]);
    setFilteredProductCatalog([]);
    setDataLoadingComplete(true);
  };

  return {
    featuredProductCatalog,
    newArrivalProducts,
    promotionalProducts,
    completeProductCatalog,
    filteredProductCatalog,
    dataLoadingComplete,
    setFilteredProductCatalog,
    loadEcommerceProductData,
    handleDataLoadingSuccess,
    handleMaxRetriesReached
  };
};
