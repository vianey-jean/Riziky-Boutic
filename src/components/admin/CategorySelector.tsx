
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategoriesForProducts } from '@/hooks/useCategoriesForProducts';

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  value, 
  onChange, 
  required = false 
}) => {
  const { categories, loading } = useCategoriesForProducts();

  if (loading) {
    return (
      <div className="grid gap-2">
        <Label htmlFor="category">Catégorie {required && '*'}</Label>
        <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor="category">Catégorie {required && '*'}</Label>
      <Select value={value} onValueChange={onChange} required={required}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner une catégorie" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.name}>
              {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelector;
