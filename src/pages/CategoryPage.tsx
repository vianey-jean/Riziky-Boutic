
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortOption, setSortOption] = useState('default');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInStock, setShowInStock] = useState(true);
  const [showOutOfStock, setShowOutOfStock] = useState(false);

  // Convertir le nom de catégorie de l'URL en format lisible
  const categoryTitle = categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : '';

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productsAPI.getAll();
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Format de données incorrect');
        }
        
        const allProducts = response.data;
        setProducts(allProducts);
        
        // Filtrer par catégorie - on compare en ignorant la casse
        const categoryProducts = allProducts.filter((product: Product) => 
          product.category.toLowerCase() === categoryName?.toLowerCase()
        );
        
        console.log(`Catégorie: ${categoryName}, Produits trouvés: ${categoryProducts.length}`);
        
        setFilteredProducts(categoryProducts);
        setSortedProducts(categoryProducts);
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
        toast.error("Impossible de charger les produits");
        setFilteredProducts([]);
        setSortedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [categoryName]);

  // Appliquer les filtres
  useEffect(() => {
    let result = [...filteredProducts];
    
    // Filtre de recherche
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtre de prix
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Filtre de disponibilité
    result = result.filter(product => 
      (showInStock && product.isSold) || (showOutOfStock && !product.isSold)
    );
    
    // Tri
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
      default:
        // Par défaut, pas de tri particulier
        break;
    }
    
    setSortedProducts(result);
  }, [filteredProducts, searchTerm, priceRange, sortOption, showInStock, showOutOfStock]);

  const resetFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 200]);
    setSortOption('default');
    setShowInStock(true);
    setShowOutOfStock(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-red-800">{categoryTitle}</h1>
        <p className="text-muted-foreground mb-6">
          {sortedProducts.length} produits trouvés
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="space-y-6">
            <div className="mb-4">
              <h2 className="font-medium mb-2">Rechercher</h2>
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Accordion type="single" collapsible defaultValue="price">
              <AccordionItem value="price">
                <AccordionTrigger>Prix</AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4">
                    <Slider
                      value={priceRange}
                      min={0}
                      max={200}
                      step={10}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                    />
                    <div className="flex justify-between mt-2 text-sm">
                      <span>{priceRange[0]} €</span>
                      <span>{priceRange[1]} €</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="availability">
                <AccordionTrigger>Disponibilité</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="in-stock" 
                        className="mr-2" 
                        checked={showInStock}
                        onChange={(e) => setShowInStock(e.target.checked)}
                      />
                      <label htmlFor="in-stock">En stock</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="out-of-stock" 
                        className="mr-2" 
                        checked={showOutOfStock}
                        onChange={(e) => setShowOutOfStock(e.target.checked)}
                      />
                      <label htmlFor="out-of-stock">Rupture de stock</label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div>
              <Button variant="outline" className="w-full" onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
          
          {/* Products */}
          <div className="md:col-span-3">
            <div className="flex justify-between mb-6">
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trier par..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Pertinence</SelectItem>
                  <SelectItem value="price-asc">Prix: Croissant</SelectItem>
                  <SelectItem value="price-desc">Prix: Décroissant</SelectItem>
                  <SelectItem value="name-asc">Nom: A à Z</SelectItem>
                  <SelectItem value="name-desc">Nom: Z à A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {isLoading ? (
              <div className="text-center py-10">Chargement des produits...</div>
            ) : sortedProducts.length > 0 ? (
              <ProductGrid products={sortedProducts} />
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">Aucun produit trouvé pour cette catégorie</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
