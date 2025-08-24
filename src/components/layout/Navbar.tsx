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
import CategoriesDropdown from './CategoriesDropdown';
import UserAvatar from '@/components/user/UserAvatar';

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
        <div className="absolute z-50 w-full bg-white dark:bg-neutral-800 shadow-xl rounded-xl mt-2 max-h-[60vh] overflow-auto border border-neutral-200 dark:border-neutral-700 backdrop-blur-md bg-white/95 dark:bg-neutral-800/95">
          {/* <ul className="py-2">
            {searchResults.map(product => (
              <li 
                key={product.id} 
                className="px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer border-b border-neutral-100 dark:border-neutral-700 last:border-none transition-all duration-200" 
                onClick={() => handleProductClick(product.id)}
              >
                <div className="flex items-center">
                  <img 
                    src={`${import.meta.env.VITE_API_BASE_URL}${product.image}`} 
                    alt={product.name} 
                    className="w-14 h-14 object-cover rounded-lg mr-4 bg-neutral-50 dark:bg-neutral-700"
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
        <div className="absolute z-50 w-full bg-white dark:bg-neutral-800 shadow-lg rounded-xl mt-2 p-6 text-center border border-neutral-200 dark:border-neutral-700 backdrop-blur-md bg-white/95 dark:bg-neutral-800/95">
          <p className="text-neutral-600 dark:text-neutral-400">Aucun produit trouvé pour "{searchTerm}"</p>
        </div>
      )}
    </>;

  return (
    <nav aria-label="Navigation principale" className="border-b border-neutral-200/50 dark:border-neutral-700/50 py-3 bg-gradient-to-r from-white via-slate-50 to-white dark:from-neutral-900 dark:via-black dark:to-neutral-900 sticky top-0 z-40 backdrop-blur-lg bg-white/90 dark:bg-neutral-900/90 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center group" aria-label="Page d'accueil">
            <div className="relative">
              <img src={logo} alt="Riziky Boutique" className="h-20 w-auto transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          </Link>

          {/* Recherche desktop améliorée */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-8">
            <div className="relative w-full" ref={searchRef} role="search">
              <label htmlFor="search-desktop" className="sr-only">Rechercher des produits</label>
              <div className="relative group">
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
                  className="w-full pl-12 pr-14 py-3 rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 shadow-sm focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all duration-300 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm group-hover:shadow-md text-base" 
                />
                {isSearching ? 
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-red-600"></div> : 
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400 transition-colors group-hover:text-red-500" aria-hidden="true" />
                }
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
              
              {renderSearchResults()}
            </div>
          </div>

          {/* Icônes utilisateur pour desktop améliorées */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/favoris" className="relative group">
              <Button variant="ghost" size="icon" className="nav-icon rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 dark:from-teal-900/20 dark:to-cyan-900/20 dark:hover:from-teal-900/40 dark:hover:to-cyan-900/40 h-12 w-12 transition-all duration-300 hover:scale-110 hover:shadow-lg border border-teal-200/50 dark:border-teal-700/50">
                <Heart className="h-5 w-5 text-teal-600 dark:text-teal-400 transition-transform group-hover:scale-110" />
              </Button>
              {favoriteCount > 0 && 
                <Badge variant="destructive" className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center p-0 text-xs rounded-full animate-bounce shadow-lg bg-gradient-to-r from-red-500 to-pink-500">
                  {favoriteCount}
                </Badge>
              }
            </Link>

            <Link to="/panier" className="relative group">
              <Button variant="ghost" size="icon" className="nav-icon rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 dark:hover:from-violet-900/40 dark:hover:to-purple-900/40 h-12 w-12 transition-all duration-300 hover:scale-110 hover:shadow-lg border border-violet-200/50 dark:border-violet-700/50">
                <ShoppingCart className="h-5 w-5 text-violet-600 dark:text-violet-400 transition-transform group-hover:scale-110" />
              </Button>
              {cartItemsCount > 0 && 
                <Badge variant="destructive" className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center p-0 text-xs rounded-full animate-bounce shadow-lg bg-gradient-to-r from-red-500 to-pink-500">
                  {cartItemsCount}
                </Badge>
              }
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="nav-icon rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 dark:hover:from-rose-900/40 dark:hover:to-pink-900/40 h-12 w-12 transition-all duration-300 hover:scale-110 hover:shadow-lg border border-rose-200/50 dark:border-rose-700/50 group p-1">
                    <UserAvatar user={user!} size="md" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl backdrop-blur-lg p-2" align="end">
                  <DropdownMenuLabel className="px-4 py-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl mb-2">
                    <div className="font-bold text-gray-900 dark:text-white">Mon compte</div>
                    <div className="text-sm text-green-600 dark:text-gray-400 mt-1 font-bold">
                      {user?.nom} · {user?.role === 'admin' ? 'Admin' : 'Client'}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem asChild className="rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 transition-all duration-200">
                    <Link to="/profil" className="flex items-center px-4 py-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                         <div className="mr-2">
                                    <UserAvatar user={user!} size="sm" />
                                  </div>
                      </div>
                      <span className="font-medium">Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all duration-200">
                    <Link to="/commandes" className="flex items-center px-4 py-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                        <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="font-medium">Mes commandes</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator className="my-2" />
                      <DropdownMenuItem asChild className="rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 dark:hover:from-purple-900/20 dark:hover:to-violet-900/20 transition-all duration-200">
                        <Link to="/admin/produits" className="flex items-center px-4 py-3">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                            <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <span className="font-medium">Administration</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem onClick={logout} className="rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-200 cursor-pointer">
                    <div className="flex items-center px-4 py-3 w-full">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-3">
                        <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <span className="font-medium text-red-600 dark:text-red-400">Déconnexion</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className="group">
                <Button variant="ghost" size="icon" className="nav-icon rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 dark:hover:from-rose-900/40 dark:hover:to-pink-900/40 h-12 w-12 transition-all duration-300 hover:scale-110 hover:shadow-lg border border-rose-200/50 dark:border-rose-700/50">
                  <User className="h-5 w-5 text-rose-600 dark:text-rose-400 transition-transform group-hover:scale-110" />
                </Button>
              </Link>
            )}
          </div>

          {/* Menu mobile amélioré */}
          <div className="flex md:hidden items-center space-x-3">
            <Link to="/panier" className="relative group">
              <Button variant="ghost" size="icon" className="nav-icon bg-violet-50 hover:bg-violet-100 dark:bg-violet-900/20 dark:hover:bg-violet-900/40 rounded-xl h-10 w-10 transition-all duration-300 hover:scale-105">
                <ShoppingCart className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </Button>
              {cartItemsCount > 0 && 
                <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs rounded-full animate-bounce">
                  {cartItemsCount}
                </Badge>
              }
            </Link>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="nav-icon h-10 w-10 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-all duration-300 hover:scale-105">
                  <Menu className="h-5 w-5 text-red-600 dark:text-red-400" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg">
                <nav className="flex flex-col h-full">
                  <div className="flex-1 py-4">
                    <div className="mb-6 relative">
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
                                  <div className="mr-2">
                                    <UserAvatar user={user!} size="sm" />
                                  </div>
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

        {/* Recherche mobile améliorée */}
        <div className="md:hidden mt-3 relative" ref={searchRef}>
          <div className="relative group">
            <Input 
              type="text" 
              placeholder="Rechercher des produits..." 
              className="w-full pl-12 pr-4 py-3 rounded-2xl shadow-sm border-2 border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all duration-300 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm group-hover:shadow-md" 
              value={searchTerm} 
              onChange={handleSearchChange}
            />
            {isSearching ? 
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-600"></div> : 
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-hover:text-red-500" />
            }
          </div>
          
          {renderSearchResults()}
        </div>

        {/* Menu "Toutes les catégories" - Desktop amélioré */}
        <div className="hidden md:flex mt-3 justify-center" role="navigation" aria-label="Catégories">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-1 shadow-sm border border-red-200/50 dark:border-red-700/50">
            <CategoriesDropdown categories={categories} />
          </div>
        </div>

        {/* Catégories - Mobile (collapsed by default) */}
        <div className="md:hidden mt-3">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl border border-red-200/50 dark:border-red-700/50">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="categories" className="border-none">
                <AccordionTrigger className="py-3 px-4 justify-center text-red-800 font-bold hover:no-underline hover:bg-red-100/50 dark:hover:bg-red-900/30 rounded-2xl transition-colors">
                  Catégories
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid grid-cols-2 gap-2 pt-2 text-red-800 font-bold">
                    {categories.map(cat => (
                      <Link 
                        key={cat.id} 
                        to={`/categorie/${cat.name}`} 
                        className="text-sm py-2 px-3 rounded-xl bg-white dark:bg-neutral-800 hover:bg-red-100 dark:hover:bg-red-900/30 capitalize text-center transition-all duration-200 hover:scale-105 shadow-sm border border-red-200/30 dark:border-red-700/30"
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
      </div>
    </nav>
  );
};

export default Navbar;
