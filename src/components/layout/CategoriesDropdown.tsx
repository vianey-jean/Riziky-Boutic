
/**
 * Composant CategoriesDropdown
 * 
 * Affiche les catégories de produits de manière adaptative :
 * - Si < 8 catégories : affichage direct en ligne
 * - Si >= 8 catégories : menu hamburger avec dropdown
 * 
 * Design responsive avec style rouge (text-red-900) et font-bold
 */

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

// Interface pour les props du composant
interface CategoriesDropdownProps {
  categories: Category[];        // Liste des catégories à afficher
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({ categories }) => {
  // État pour contrôler l'ouverture/fermeture du menu dropdown
  const [isOpen, setIsOpen] = useState(false);

  // Si moins de 8 catégories, afficher directement en ligne horizontale
  if (categories.length < 8) {
    return (
      <div className="flex items-center justify-center space-x-4 flex-wrap">
        {categories.map(cat => (
          <Link 
            key={cat.id}                                              // Clé unique pour React
            to={`/categorie/${cat.name}`}                            // Route vers la page catégorie
            className="text-red-900 font-bold hover:text-red-600 capitalize transition-colors px-2 py-1"
          >
            {/* Capitalisation de la première lettre + reste en minuscules */}
            {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
          </Link>
        ))}
      </div>
    );
  }

  // Si 8 catégories ou plus, afficher avec menu hamburger dropdown
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      {/* Bouton déclencheur du menu avec icône hamburger */}
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-red-900 text-lg font-bold hover:text-red-600 dark:text-neutral-200 dark:hover:text-red-400"
        >
          <Menu className="h-4 w-4 mr-2" />                         {/* Icône menu hamburger */}
          Toutes les catégories
        </Button>
      </DropdownMenuTrigger>
      
      {/* Contenu du menu dropdown */}
      <DropdownMenuContent 
        className="w-56 max-h-80 text-red-900 font-bold overflow-y-auto bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-lg"
        align="start"                                                 // Alignement à gauche du bouton
      >
        {/* Mappage de chaque catégorie en élément de menu */}
        {categories.map(cat => (
          <DropdownMenuItem key={cat.id} asChild>
            <Link 
              to={`/categorie/${cat.name}`}                          // Route vers la catégorie
              className="w-full capitalize hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors text-red-900 font-bold"
              onClick={() => setIsOpen(false)}                       // Fermer le menu au clic
            >
              {/* Capitalisation de la première lettre */}
              {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoriesDropdown;
