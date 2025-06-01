
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from 'lucide-react';
import { Category } from '@/types/category';

interface CategoriesDropdownProps {
  categories: Category[];
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({ categories }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Si moins de 8 catégories, afficher directement
  if (categories.length < 8) {
    return (
      <div className="flex items-center justify-center space-x-4 flex-wrap">
        {categories.map(cat => (
          <Link 
            key={cat.id} 
            to={`/categorie/${cat.name}`} 
            className="text-red-900 font-bold hover:text-red-600 capitalize transition-colors px-2 py-1"
          >
            {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
          </Link>
        ))}
      </div>
    );
  }

  // Si 8 catégories ou plus, afficher avec menu hamburger
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-red-900 text-lg font-bold hover:text-red-600 dark:text-neutral-200 dark:hover:text-red-400"
        >
          <Menu className="h-4 w-4 mr-2" />
          Toutes les catégories
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 max-h-80 text-red-900 font-bold overflow-y-auto bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-lg"
        align="start"
      >
        {categories.map(cat => (
          <DropdownMenuItem key={cat.id} asChild>
            <Link 
              to={`/categorie/${cat.name}`}
              className="w-full capitalize hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors text-red-900 font-bold"
              onClick={() => setIsOpen(false)}
            >
              {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoriesDropdown;
