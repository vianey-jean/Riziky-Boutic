
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MobileFilters from '@/components/filters/MobileFilters';

interface ProductsPageHeaderProps {
  title: string;
  productCount: number;
  sortOption: string;
  setSortOption: (option: string) => void;
  mobileFiltersProps: {
    filtersOpen: boolean;
    setFiltersOpen: (open: boolean) => void;
    activeFilters: number;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    maxPrice: number;
    showInStock: boolean;
    setShowInStock: (show: boolean) => void;
    showOutOfStock: boolean;
    setShowOutOfStock: (show: boolean) => void;
    showPromoOnly?: boolean;
    setShowPromoOnly?: (show: boolean) => void;
    resetFilters: () => void;
  };
}

const ProductsPageHeader: React.FC<ProductsPageHeaderProps> = ({
  title,
  productCount,
  sortOption,
  setSortOption,
  mobileFiltersProps
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-neutral-800 dark:text-neutral-100">{title}</h1>
        <p className="text-muted-foreground">
          {productCount} produit{productCount > 1 ? 's' : ''} trouvé{productCount > 1 ? 's' : ''}
        </p>
      </div>
      <div className="flex gap-2 mt-4 md:mt-0">
        <MobileFilters {...mobileFiltersProps} />
        
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trier par..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Pertinence</SelectItem>
            <SelectItem value="price-asc">Prix croissant</SelectItem>
            <SelectItem value="price-desc">Prix décroissant</SelectItem>
            <SelectItem value="name-asc">Nom: A à Z</SelectItem>
            <SelectItem value="name-desc">Nom: Z à A</SelectItem>
            <SelectItem value="newest">Nouveautés</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProductsPageHeader;
