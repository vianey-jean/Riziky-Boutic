import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { Product } from '@/contexts/StoreContext';
import { productsAPI } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import { Badge } from '@/components/ui/badge';
import { Filter, ShoppingBag, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const NewArrivalsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [maxPrice, setMaxPrice] = useState(200);
  const [sortOption, setSortOption] = useState('newest');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInStock, setShowInStock] = useState(true);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

  // Calcul du nombre de filtres actifs
  useEffect(() => {
    let count = 0;
    if (searchTerm) count++;
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) count++;
    if (showInStock !== true || showOutOfStock !== false) count++;
    setActiveFilters(count);
  }, [searchTerm, priceRange, showInStock, showOutOfStock, maxPrice]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Essayer d'abord de récupérer les nouveautés via l'API spécialisée
        try {
          const newArrivalsResponse = await productsAPI.getNewArrivals();
          if (newArrivalsResponse.data && Array.isArray(newArrivalsResponse.data)) {
            setProducts(newArrivalsResponse.data);
            
            const highestPrice = Math.max(...newArrivalsResponse.data.map(p => p.price), 200);
            setMaxPrice(Math.ceil(highestPrice / 10) * 10);
            setPriceRange([0, highestPrice]);
            
            setFilteredProducts(newArrivalsResponse.data);
            setSortedProducts(newArrivalsResponse.data);
            return;
          }
        } catch (error) {
          console.log("API nouveautés non disponible, fallback sur tous les produits");
        }
        
        // Fallback: récupérer tous les produits et trier par date
        const response = await productsAPI.getAll();
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Format de données incorrect');
        }
        
        // Trier par date d'ajout pour avoir les nouveautés
        const sortedByDate = [...response.data].sort((a, b) => {
          const dateA = a.dateAjout ? new Date(a.dateAjout).getTime() : 0;
          const dateB = b.dateAjout ? new Date(b.dateAjout).getTime() : 0;
          return dateB - dateA;
        });
        
        // Prendre les 50 produits les plus récents
        const newArrivals = sortedByDate.slice(0, 50);
        
        setProducts(newArrivals);
        
        const highestPrice = Math.max(...newArrivals.map(p => p.price), 200);
        setMaxPrice(Math.ceil(highestPrice / 10) * 10);
        setPriceRange([0, highestPrice]);
        
        setFilteredProducts(newArrivals);
        setSortedProducts(newArrivals);
      } catch (error) {
        console.error("Erreur lors du chargement des nouveautés:", error);
        toast.error("Impossible de charger les nouveautés");
        setFilteredProducts([]);
        setSortedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];
    
    if (searchTerm) {
      const normalizedSearchTerm = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(normalizedSearchTerm) ||
        product.description.toLowerCase().includes(normalizedSearchTerm)
      );
    }
    
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    result = result.filter(product => 
      (showInStock && product.isSold && (product.stock === undefined || product.stock > 0)) || 
      (showOutOfStock && (!product.isSold || (product.stock !== undefined && product.stock <= 0)))
    );
    
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
    
    setFilteredProducts(result);
    setSortedProducts(result);
    setCurrentPage(1);
  }, [products, searchTerm, priceRange, sortOption, showInStock, showOutOfStock]);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  const resetFilters = () => {
    setSearchTerm('');
    setPriceRange([0, maxPrice]);
    setSortOption('newest');
    setShowInStock(true);
    setShowOutOfStock(false);
    setCurrentPage(1);
    setFiltersOpen(false);
  };

  const FilterBadge = ({ label, onRemove }: { label: string, onRemove: () => void }) => (
    <Badge variant="outline" className="flex items-center gap-1 py-1 px-3 bg-white">
      {label}
      <button onClick={onRemove} className="ml-1 hover:text-red-500">
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );

  const MobileFilters = () => (
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-neutral-800 dark:text-neutral-100">Dernières nouveautés</h1>
            <p className="text-muted-foreground">
              {sortedProducts.length} nouveauté{sortedProducts.length > 1 ? 's' : ''} trouvée{sortedProducts.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <MobileFilters />
            
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trier par..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Plus récent</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="name-asc">Nom: A à Z</SelectItem>
                <SelectItem value="name-desc">Nom: Z à A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {activeFilters > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchTerm && (
              <FilterBadge 
                label={`Recherche: ${searchTerm}`} 
                onRemove={() => setSearchTerm('')} 
              />
            )}
            
            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <FilterBadge 
                label={`Prix: ${priceRange[0]}€ - ${priceRange[1]}€`} 
                onRemove={() => setPriceRange([0, maxPrice])} 
              />
            )}
            
            {(!showInStock || showOutOfStock) && (
              <FilterBadge 
                label={showOutOfStock ? "Ruptures de stock" : "En stock uniquement"} 
                onRemove={() => { setShowInStock(true); setShowOutOfStock(false); }} 
              />
            )}
            
            {activeFilters > 1 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters} 
                className="text-sm h-8"
              >
                Effacer tous les filtres
              </Button>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
          
          <div className="md:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="border rounded-xl p-4 h-[300px] animate-pulse">
                    <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : currentProducts.length > 0 ? (
              <>
                <ProductGrid products={currentProducts} />
                
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-8">
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} sur {totalPages} - {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''} au total
                    </div>
                    <div className="flex gap-2">
                      {currentPage > 1 && (
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          className="flex items-center gap-2"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Précédent
                        </Button>
                      )}
                      
                      {currentPage < totalPages && (
                        <Button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          className="flex items-center gap-2"
                        >
                          Suivant
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-6 bg-neutral-50 dark:bg-neutral-900 rounded-xl text-center">
                <ShoppingBag className="h-14 w-14 text-neutral-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Aucune nouveauté trouvée</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Nous n'avons trouvé aucune nouveauté correspondant à vos critères de recherche.
                </p>
                <Button onClick={resetFilters}>
                  Réinitialiser tous les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewArrivalsPage;
