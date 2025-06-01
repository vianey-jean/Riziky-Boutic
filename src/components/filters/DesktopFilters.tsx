
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface DesktopFiltersProps {
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
}

const DesktopFilters: React.FC<DesktopFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  priceRange,
  setPriceRange,
  maxPrice,
  showInStock,
  setShowInStock,
  showOutOfStock,
  setShowOutOfStock,
  showPromoOnly,
  setShowPromoOnly,
  resetFilters
}) => {
  return (
    <div className="hidden md:block space-y-6">
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-4">Filtres</h2>
        <div className="mb-4">
          <label htmlFor="search-desktop" className="text-sm font-medium mb-2 block">
            Rechercher
          </label>
          <Input
            id="search-desktop"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Accordion type="multiple" defaultValue={["price", "availability"]} className="w-full">
        <AccordionItem value="price" className="border-b">
          <AccordionTrigger className="py-3 text-sm font-medium">Prix</AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 px-2">
              <Slider
                value={priceRange}
                min={0}
                max={maxPrice}
                step={5}
                onValueChange={(value) => setPriceRange(value as [number, number])}
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <span className="text-sm mr-2">Min:</span>
                  <Input 
                    type="number"
                    min="0"
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setPriceRange([value, Math.max(value, priceRange[1])]);
                    }}
                    className="w-20 h-8 text-sm"
                  />
                </div>
                <div className="flex items-center">
                  <span className="text-sm mr-2">Max:</span>
                  <Input
                    type="number"
                    min={priceRange[0]}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setPriceRange([Math.min(value, priceRange[0]), value]);
                    }}
                    className="w-20 h-8 text-sm"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="availability" className="border-b">
          <AccordionTrigger className="py-3 text-sm font-medium">Disponibilité</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 px-1">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="in-stock" 
                  className="mr-2 h-4 w-4 rounded border-gray-300" 
                  checked={showInStock}
                  onChange={(e) => setShowInStock(e.target.checked)}
                />
                <label htmlFor="in-stock" className="text-sm cursor-pointer">En stock</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="out-of-stock" 
                  className="mr-2 h-4 w-4 rounded border-gray-300" 
                  checked={showOutOfStock}
                  onChange={(e) => setShowOutOfStock(e.target.checked)}
                />
                <label htmlFor="out-of-stock" className="text-sm cursor-pointer">Rupture de stock</label>
              </div>
              {setShowPromoOnly && (
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="promo-only" 
                    className="mr-2 h-4 w-4 rounded border-gray-300" 
                    checked={showPromoOnly || false}
                    onChange={(e) => setShowPromoOnly(e.target.checked)}
                  />
                  <label htmlFor="promo-only" className="text-sm cursor-pointer">Promotions uniquement</label>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="pt-4">
        <Button variant="outline" className="w-full" onClick={resetFilters}>
          Réinitialiser les filtres
        </Button>
      </div>
    </div>
  );
};

export default DesktopFilters;
