
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';

interface MobileFiltersProps {
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
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
  filtersOpen,
  setFiltersOpen,
  activeFilters,
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
    <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="md:hidden flex gap-2 items-center">
          <Filter className="h-4 w-4" />
          Filtres 
          {activeFilters > 0 && (
            <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">{activeFilters}</Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] sm:w-[380px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Filtres</SheetTitle>
        </SheetHeader>
        
        <div className="overflow-y-auto h-[calc(100vh-120px)] p-4 space-y-6">
          <div>
            <h3 className="font-medium mb-3">Rechercher</h3>
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Prix</h3>
            <div className="pt-2 px-1">
              <Slider
                value={priceRange}
                min={0}
                max={maxPrice}
                step={5}
                onValueChange={(value) => setPriceRange(value as [number, number])}
              />
              <div className="flex justify-between mt-2 text-sm">
                <span>{priceRange[0]} €</span>
                <span>{priceRange[1]} €</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Disponibilité</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="in-stock-mobile" 
                  className="mr-2 h-4 w-4 rounded border-gray-300" 
                  checked={showInStock}
                  onChange={(e) => setShowInStock(e.target.checked)}
                />
                <label htmlFor="in-stock-mobile">En stock</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="out-of-stock-mobile" 
                  className="mr-2 h-4 w-4 rounded border-gray-300" 
                  checked={showOutOfStock}
                  onChange={(e) => setShowOutOfStock(e.target.checked)}
                />
                <label htmlFor="out-of-stock-mobile">Rupture de stock</label>
              </div>
              {setShowPromoOnly && (
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="promo-only-mobile" 
                    className="mr-2 h-4 w-4 rounded border-gray-300" 
                    checked={showPromoOnly || false}
                    onChange={(e) => setShowPromoOnly(e.target.checked)}
                  />
                  <label htmlFor="promo-only-mobile">Promotions uniquement</label>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t p-4 flex gap-4">
          <Button variant="outline" onClick={resetFilters} className="flex-1">
            Réinitialiser
          </Button>
          <Button onClick={() => setFiltersOpen(false)} className="flex-1">
            Appliquer
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilters;
