import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, Heart, Search, User, LogOut, Settings, Package, Menu } from 'lucide-react';
import { productsAPI, Product } from '@/services/api';
import { categoriesAPI } from '@/services/categoriesAPI';
import { Category } from '@/types/category';
import { debounce } from 'lodash';
import { useIsMobile } from '@/hooks/use-mobile';
import logo from "@/assets/logo.png"; 

// Fonction améliorée pour normaliser les chaînes de caractères (supprime les accents et met en minuscule)
const normalizeString = (str: string) => {
  return str.normalize("NFD") // Décompose les caractères accentués
  .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
  .toLowerCase() // Met en minuscule
  .trim(); // Supprime les espaces inutiles
};

const sanitizeInput = (input: string) => {
  // Simple sanitization - more advanced would use DOMPurify
  return input.replace(/[<>]/g, '');
};

const Navbar = () => {
  const {
    cart,
    favoriteCount
  } = useStore();
  const {
    isAuthenticated,
    user,
    isAdmin,
    logout
  } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Charger les catégories depuis la base de données
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoriesAPI.getActive();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        // Fallback vers les catégories par défaut si l'API échoue
        setCategories([
          { id: '1', name: 'perruques', description: '', order: 1, isActive: true, createdAt: '' },
          { id: '2', name: 'tissages', description: '', order: 2, isActive: true, createdAt: '' },
          { id: '3', name: 'queue de cheval', description: '', order: 3, isActive: true, createdAt: '' },
          { id: '4', name: 'peigne chauffante', description: '', order: 4, isActive: true, createdAt: '' },
          { id: '5', name: 'colle - dissolvant', description: '', order: 5, isActive: true, createdAt: '' }
        ]);
      }
    };
    loadCategories();
  }, []);

  // Ferme les résultats si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const debouncedSearch = useCallback(debounce(async (term: string) => {
    if (term.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
      return;
    }

    // Sanitize input before searching
    const sanitizedTerm = sanitizeInput(term);
    setIsSearching(true);
    try {
      // Normalize search term for better search results
      const normalizedTerm = normalizeString(sanitizedTerm);

      // Search via API
      const response = await productsAPI.search(normalizedTerm);
      const results = Array.isArray(response.data) ? response.data : [];

      // Enhanced filtering
      const filteredResults = results.filter(product => {
        const normalizedProductName = normalizeString(product.name);
        const normalizedProductDesc = normalizeString(product.description);
        return normalizedProductName.includes(normalizedTerm) || normalizedProductDesc.includes(normalizedTerm);
      });
      setSearchResults(filteredResults);
      setShowResults(true);
      if (location.pathname === '/') {
        setSearchParams({
          q: sanitizedTerm
        });
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, 300), [location.pathname, setSearchParams]);

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
      if (query.length >= 3) {
        debouncedSearch(query);
      }
    }
  }, [searchParams, debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length >= 3) {
      debouncedSearch(value);
    } else {
      setSearchResults([]);
      setShowResults(false);
      if (location.pathname === '/' && searchParams.has('q')) {
        setSearchParams({});
      }
    }
  };

  const handleProductClick = (productId: string) => {
    setShowResults(false);
    setSearchTerm('');
    navigate(`/produit/${productId}`);
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/categorie/${category}`);
    setCategoriesOpen(false);
    setIsOpen(false);
  };

  const renderSearchResults = () => <>
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 w-full bg-white dark:bg-neutral-800 shadow-xl rounded-md mt-2 max-h-[60vh] overflow-auto border border-neutral-200 dark:border-neutral-700">
          {/* <ul className="py-2">
            {searchResults.map(product => (
              <li 
                key={product.id} 
                className="px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer border-b border-neutral-100 dark:border-neutral-700 last:border-none" 
                onClick={() => handleProductClick(product.id)}
              >
                <div className="flex items-center">
                  <img 
                    src={`${import.meta.env.VITE_API_BASE_URL}${product.image}`} 
                    alt={product.name} 
                    className="w-14 h-14 object-cover rounded-md mr-4 bg-neutral-50 dark:bg-neutral-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `${import.meta.env.VITE_API_BASE_URL}/uploads/placeholder.jpg`;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-left truncate">{product.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 text-left">{product.category}</p>
                      <p className="text-sm font-semibold text-red-600 dark:text-red-400">{Number(product.price).toFixed(2)} €</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul> */}
        </div>
      )}
      {showResults && searchTerm.length >= 3 && searchResults.length === 0 && (
        <div className="absolute z-50 w-full bg-white dark:bg-neutral-800 shadow-lg rounded-md mt-2 p-6 text-center border border-neutral-200 dark:border-neutral-700">
          <p className="text-neutral-600 dark:text-neutral-400">Aucun produit trouvé pour "{searchTerm}"</p>
        </div>
      )}
    </>;

  return (
    <nav aria-label="Navigation principale" className="border-b py-4 bg-gradient-to-r from-slate-100 via-white to-slate-100 dark:from-neutral-900 dark:via-black dark:to-neutral-900 sticky top-0 z-40 backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center" aria-label="Page d'accueil">
            <img src={logo} alt="Riziky Boutique" className="h-16 w-auto" />
          </Link>

          {/* Recherche desktop */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-8">
            <div className="relative w-full" ref={searchRef} role="search">
              <label htmlFor="search-desktop" className="sr-only">Rechercher des produits</label>
              <Input 
                id="search-desktop" 
                type="search" 
                placeholder="Rechercher des produits..." 
                value={searchTerm} 
                onChange={e => {
                  const value = sanitizeInput(e.target.value);
                  handleSearchChange({
                    ...e,
                    target: {
                      ...e.target,
                      value
                    }
                  });
                }} 
                aria-label="Rechercher des produits" 
                className="w-full pl-10 rounded-xl border-neutral-300 dark:border-neutral-700 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10 bg-white dark:bg-neutral-800" 
              />
              {isSearching ? 
                <div className="absolute right-3 top-2.5 h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-red-600"></div> : 
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" aria-hidden="true" />
              }
              {renderSearchResults()}
            </div>
          </div>

          {/* Icônes utilisateur pour desktop */}
          <div className="hidden md:flex items-center space-x-5">
            <Link to="/favoris" className="relative">
              <Button variant="ghost" size="icon" className="nav-icon rounded-full bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/20 dark:hover:bg-teal-900/40 h-12 w-12">
                <Heart className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </Button>
              {favoriteCount > 0 && 
                <Badge variant="destructive" className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center p-0 text-xs rounded-full">
                  {favoriteCount}
                </Badge>
              }
            </Link>

            <Link to="/panier" className="relative">
              <Button variant="ghost" size="icon" className="nav-icon rounded-full bg-violet-50 hover:bg-violet-100 dark:bg-violet-900/20 dark:hover:bg-violet-900/40 h-12 w-12">
                <ShoppingCart className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </Button>
              {cartItemsCount > 0 && 
                <Badge variant="destructive" className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center p-0 text-xs rounded-full">
                  {cartItemsCount}
                </Badge>
              }
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="nav-icon rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 h-12 w-12">
                    <User className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuLabel className="font-normal text-xs">
                    {user?.nom} ({user?.role === 'admin' ? 'Admin' : 'Client'})
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profil">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/commandes">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Mes commandes</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin/produits">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Administration</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" className="nav-icon rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 h-12 w-12">
                  <User className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                </Button>
              </Link>
            )}
          </div>

          {/* Menu mobile */}
          <div className="flex md:hidden items-center space-x-4">
            <Link to="/panier" className="relative">
              <Button variant="ghost" size="icon" className="nav-icon bg-violet-50 hover:bg-violet-100 dark:bg-violet-900/20 dark:hover:bg-violet-900/40 rounded-full h-10 w-10">
                <ShoppingCart className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </Button>
              {cartItemsCount > 0 && 
                <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs rounded-full">
                  {cartItemsCount}
                </Badge>
              }
            </Link>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="nav-icon h-10 w-10 rounded-full bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40">
                  <Menu className="h-6 w-6 text-red-600 dark:text-red-400" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col h-full">
                  <div className="flex-1 py-4">
                    <div className="mb-6">
                      <Input 
                        type="text" 
                        placeholder="Rechercher des produits..." 
                        className="w-full pl-10 border-neutral-300" 
                        value={searchTerm} 
                        onChange={handleSearchChange}
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="space-y-6">    
                      <div>
                        <SheetClose asChild>
                          <Link to="/favoris" className="flex items-center hover:text-primary">
                            <Heart className="mr-2 h-6 w-6 text-teal-600 dark:text-teal-400" />
                            <span>Mes favoris</span>
                            {favoriteCount > 0 && 
                              <Badge variant="outline" className="ml-2 text-red-600">
                                {favoriteCount}
                              </Badge>
                            }
                          </Link>
                        </SheetClose>
                      </div>
                      {isAuthenticated && (
                        <div className="pb-4 border-b">
                          <h3 className="text-sm font-medium mb-3">Mon compte</h3>
                          <ul className="space-y-3">
                            <li>
                              <SheetClose asChild>
                                <Link to="/profil" className="flex items-center text-sm hover:text-primary">
                                  <User className="mr-2 h-6 w-6" />
                                  <span>Profil</span>
                                </Link>
                              </SheetClose>
                            </li>
                            <li>
                              <SheetClose asChild>
                                <Link to="/commandes" className="flex items-center text-sm hover:text-primary">
                                  <Package className="mr-2 h-6 w-6" />
                                  <span>Mes commandes</span>
                                </Link>
                              </SheetClose>
                            </li>
                            {isAdmin && (
                              <li>
                                <SheetClose asChild>
                                  <Link to="/admin/produits" className="flex items-center text-sm hover:text-primary">
                                    <Settings className="mr-2 h-6 w-6" />
                                    <span>Administration</span>
                                  </Link>
                                </SheetClose>
                              </li>
                            )}
                            <li>
                              <button 
                                className="flex items-center text-sm text-red-600 hover:text-red-800" 
                                onClick={() => {
                                  logout();
                                  setIsOpen(false);
                                }}
                              >
                                <LogOut className="mr-2 h-6 w-6" />
                                <span>Déconnexion</span>
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}

                      {!isAuthenticated && (
                        <div className="pb-4 border-b">
                          <SheetClose asChild>
                            <Link to="/login" className="flex w-full justify-center items-center py-2 px-4 bg-red-700 text-white rounded hover:bg-red-800 transition-colors">
                              Se connecter
                            </Link>
                          </SheetClose>
                        </div>
                      )}
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Recherche mobile */}
        <div className="md:hidden mt-4 relative" ref={searchRef}>
          <Input 
            type="text" 
            placeholder="Rechercher des produits..." 
            className="w-full pl-10 rounded-xl shadow-sm" 
            value={searchTerm} 
            onChange={handleSearchChange}
          />
          {isSearching ? 
            <div className="absolute right-3 top-2.5 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-600"></div> : 
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          }
          {renderSearchResults()}
        </div>

        {/* Liens catégories - Desktop */}
        <div className="hidden md:flex mt-4 space-x-6 overflow-x-auto py-2 justify-center" role="navigation" aria-label="Catégories">
          <ul className="flex space-x-6 ">
            {categories.map(cat => (
              <li key={cat.id}>
                <Link 
                  to={`/categorie/${cat.name}`} 
                  className=" text-red-900  text-lg font-bold whitespace-nowrap text-neutral-700 hover:text-red-600 dark:text-neutral-200 dark:hover:text-red-400 capitalize transition-colors"
                >
                  {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Catégories - Mobile (collapsed by default) */}
        <div className="md:hidden mt-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="categories">
              <AccordionTrigger className="py-2 justify-center">
                Catégories
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {categories.map(cat => (
                    <Link 
                      key={cat.id} 
                      to={`/categorie/${cat.name}`} 
                      className="text-sm py-2 px-3 rounded-md bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 capitalize text-center transition-colors"
                    >
                      {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
