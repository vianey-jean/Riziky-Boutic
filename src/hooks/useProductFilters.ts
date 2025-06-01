
import { useState, useEffect } from 'react';
import { Product } from '@/contexts/StoreContext';

interface UseProductFiltersProps {
  products: Product[];
  categoryFilter?: string;
  promotionFilter?: boolean;
}

export const useProductFilters = ({ 
  products, 
  categoryFilter, 
  promotionFilter 
}: UseProductFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [maxPrice, setMaxPrice] = useState(200);
  const [sortOption, setSortOption] = useState('default');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [showInStock, setShowInStock] = useState(true);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [showPromoOnly, setShowPromoOnly] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  // Calculate max price and set initial filtered products
  useEffect(() => {
    let result = [...products];
    
    // Apply category filter if provided
    if (categoryFilter) {
      result = result.filter(product => 
        product.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    
    // Apply promotion filter if provided
    if (promotionFilter) {
      const currentDate = new Date();
      result = result.filter(product => 
        product.promotion && 
        product.promotionEnd && 
        new Date(product.promotionEnd) > currentDate
      );
    }
    
    setFilteredProducts(result);
    
    // Calculate max price
    const highestPrice = Math.max(...result.map(p => p.price), 200);
    const roundedMaxPrice = Math.ceil(highestPrice / 10) * 10;
    setMaxPrice(roundedMaxPrice);
    setPriceRange([0, highestPrice]);
  }, [products, categoryFilter, promotionFilter]);

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (searchTerm) count++;
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) count++;
    if (showInStock !== true || showOutOfStock !== false) count++;
    if (showPromoOnly) count++;
    setActiveFilters(count);
  }, [searchTerm, priceRange, showInStock, showOutOfStock, showPromoOnly, maxPrice]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...filteredProducts];
    
    // Search filter
    if (searchTerm) {
      const normalizedSearchTerm = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(normalizedSearchTerm) ||
        product.description.toLowerCase().includes(normalizedSearchTerm)
      );
    }
    
    // Price filter
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Stock filter
    result = result.filter(product => 
      (showInStock && product.isSold && (product.stock === undefined || product.stock > 0)) || 
      (showOutOfStock && (!product.isSold || (product.stock !== undefined && product.stock <= 0)))
    );

    // Promotion filter
    if (showPromoOnly) {
      result = result.filter(product => 
        product.promotion && product.promotionEnd && new Date(product.promotionEnd) > new Date()
      );
    }
    
    // Sorting
    switch (sortOption) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result = [...result].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        result = [...result].sort((a, b) => {
          const dateA = a.dateAjout ? new Date(a.dateAjout).getTime() : 0;
          const dateB = b.dateAjout ? new Date(b.dateAjout).getTime() : 0;
          return dateB - dateA;
        });
        break;
      default:
        break;
    }
    
    setSortedProducts(result);
  }, [filteredProducts, searchTerm, priceRange, sortOption, showInStock, showOutOfStock, showPromoOnly]);

  const resetFilters = () => {
    setSearchTerm('');
    setPriceRange([0, maxPrice]);
    setSortOption('default');
    setShowInStock(true);
    setShowOutOfStock(false);
    setShowPromoOnly(false);
  };

  const getFilterBadges = () => {
    const badges = [];
    
    if (searchTerm) {
      badges.push({
        label: `Recherche: ${searchTerm}`,
        onRemove: () => setSearchTerm('')
      });
    }
    
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) {
      badges.push({
        label: `Prix: ${priceRange[0]}€ - ${priceRange[1]}€`,
        onRemove: () => setPriceRange([0, maxPrice])
      });
    }
    
    if (!showInStock || showOutOfStock) {
      badges.push({
        label: showOutOfStock ? "Ruptures de stock" : "En stock uniquement",
        onRemove: () => { setShowInStock(true); setShowOutOfStock(false); }
      });
    }
    
    if (showPromoOnly) {
      badges.push({
        label: "Promotions uniquement",
        onRemove: () => setShowPromoOnly(false)
      });
    }
    
    return badges;
  };

  return {
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange,
    maxPrice,
    sortOption,
    setSortOption,
    sortedProducts,
    showInStock,
    setShowInStock,
    showOutOfStock,
    setShowOutOfStock,
    showPromoOnly,
    setShowPromoOnly,
    activeFilters,
    resetFilters,
    getFilterBadges
  };
};
