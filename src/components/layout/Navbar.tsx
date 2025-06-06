import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute z-50 w-full bg-white/95 dark:bg-neutral-800/95 backdrop-blur-xl shadow-2xl rounded-2xl mt-3 max-h-[60vh] overflow-auto border border-white/20 dark:border-neutral-700/50"
        >
          {/* <ul className="py-3">
            {searchResults.map((product, index) => (
              <motion.li
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-4 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 cursor-pointer border-b border-neutral-100/50 dark:border-neutral-700/50 last:border-none transition-all duration-300" 
                onClick={() => handleProductClick(product.id)}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <img 
                      src={`${import.meta.env.VITE_API_BASE_URL}${product.image}`} 
                      alt={product.name} 
                      className="w-16 h-16 object-cover rounded-xl mr-4 bg-neutral-50 dark:bg-neutral-700 shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `${import.meta.env.VITE_API_BASE_URL}/uploads/placeholder.jpg`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-left truncate text-gray-800 dark:text-gray-200">{product.name}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 text-left capitalize">{product.category}</p>
                      <div className="flex items-center">
                        <span className="text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg">
                          {Number(product.price).toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul> */}
        </motion.div>
      )}
      {showResults && searchTerm.length >= 3 && searchResults.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-50 w-full bg-white/95 dark:bg-neutral-800/95 backdrop-blur-xl shadow-2xl rounded-2xl mt-3 p-8 text-center border border-white/20 dark:border-neutral-700/50"
        >
          <div className="flex flex-col items-center space-y-3">
            <Search className="h-12 w-12 text-neutral-400" />
            <p className="text-neutral-600 dark:text-neutral-400 font-medium">Aucun produit trouvé pour "{searchTerm}"</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">Essayez avec d'autres mots-clés</p>
          </div>
        </motion.div>
      )}
    </>;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      aria-label="Navigation principale" 
      className="border-b py-4 bg-gradient-to-r from-white/95 via-slate-50/95 to-white/95 dark:from-neutral-900/95 dark:via-black/95 dark:to-neutral-900/95 sticky top-0 z-40 backdrop-blur-xl shadow-lg border-white/20 dark:border-neutral-700/50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/" className="flex items-center" aria-label="Page d'accueil">
              <img src={logo} alt="Riziky Boutique" className="h-16 w-auto drop-shadow-lg" />
            </Link>
          </motion.div>

          {/* Recherche desktop */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-8">
            <motion.div 
              className="relative w-full" 
              ref={searchRef} 
              role="search"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <label htmlFor="search-desktop" className="sr-only">Rechercher des produits</label>
              <div className="relative">
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
                  className="w-full pl-12 pr-12 h-12 rounded-2xl border-2 border-white/30 dark:border-neutral-700/50 shadow-lg focus:ring-2 focus:ring-red-500/50 focus:border-red-300 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
                />
                {isSearching ? 
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="absolute right-4 top-3.5 h-5 w-5 border-2 border-red-300 border-t-red-600 rounded-full"
                  ></motion.div> : 
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400" aria-hidden="true" />
                }
              </div>
              
              <AnimatePresence>
                {renderSearchResults()}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Icônes utilisateur pour desktop */}
          <div className="hidden md:flex items-center space-x-5">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link to="/favoris" className="relative">
                <Button variant="ghost" size="icon" className="nav-icon rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 dark:from-teal-900/20 dark:to-emerald-900/20 dark:hover:from-teal-900/40 dark:hover:to-emerald-900/40 h-12 w-12 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Heart className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </Button>
                {favoriteCount > 0 && 
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Badge variant="destructive" className="w-6 h-6 flex items-center justify-center p-0 text-xs rounded-full shadow-lg">
                      {favoriteCount}
                    </Badge>
                  </motion.div>
                }
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link to="/panier" className="relative">
                <Button variant="ghost" size="icon" className="nav-icon rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 dark:hover:from-violet-900/40 dark:hover:to-purple-900/40 h-12 w-12 shadow-lg hover:shadow-xl transition-all duration-300">
                  <ShoppingCart className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                </Button>
                {cartItemsCount > 0 && 
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Badge variant="destructive" className="w-6 h-6 flex items-center justify-center p-0 text-xs rounded-full shadow-lg">
                      {cartItemsCount}
                    </Badge>
                  </motion.div>
                }
              </Link>
            </motion.div>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="icon" className="nav-icon rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 dark:hover:from-rose-900/40 dark:hover:to-pink-900/40 h-12 w-12 shadow-lg hover:shadow-xl transition-all duration-300">
                      <User className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-xl border border-white/20 dark:border-neutral-700/50 shadow-2xl rounded-2xl" align="end">
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
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login">
                  <Button variant="ghost" size="icon" className="nav-icon rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 dark:hover:from-rose-900/40 dark:hover:to-pink-900/40 h-12 w-12 shadow-lg hover:shadow-xl transition-all duration-300">
                    <User className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>

          {/* Menu mobile */}
          <div className="flex md:hidden items-center space-x-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link to="/panier" className="relative">
                <Button variant="ghost" size="icon" className="nav-icon bg-gradient-to-br from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 dark:hover:from-violet-900/40 dark:hover:to-purple-900/40 rounded-2xl h-11 w-11 shadow-lg">
                  <ShoppingCart className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </Button>
                {cartItemsCount > 0 && 
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Badge variant="destructive" className="w-5 h-5 flex items-center justify-center p-0 text-xs rounded-full shadow-lg">
                      {cartItemsCount}
                    </Badge>
                  </motion.div>
                }
              </Link>
            </motion.div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" className="nav-icon h-11 w-11 rounded-2xl bg-gradient-to-br from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 dark:hover:from-red-900/40 dark:hover:to-pink-900/40 shadow-lg">
                    <Menu className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-l border-white/20 dark:border-neutral-700/50">
                <nav className="flex flex-col h-full">
                  <div className="flex-1 py-4">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 relative"
                    >
                      <Input 
                        type="text" 
                        placeholder="Rechercher des produits..." 
                        className="w-full pl-12 h-12 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm" 
                        value={searchTerm} 
                        onChange={handleSearchChange}
                      />
                      <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                    </motion.div>

                    <div className="space-y-6">    
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <SheetClose asChild>
                          <Link to="/favoris" className="flex items-center hover:text-primary p-3 rounded-xl hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 dark:hover:from-teal-900/20 dark:hover:to-emerald-900/20 transition-all duration-300">
                            <Heart className="mr-3 h-6 w-6 text-teal-600 dark:text-teal-400" />
                            <span className="font-medium">Mes favoris</span>
                            {favoriteCount > 0 && 
                              <Badge variant="outline" className="ml-auto text-red-600 border-red-200">
                                {favoriteCount}
                              </Badge>
                            }
                          </Link>
                        </SheetClose>
                      </motion.div>

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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="md:hidden mt-4 relative" 
          ref={searchRef}
        >
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Rechercher des produits..." 
              className="w-full pl-12 pr-12 h-12 rounded-2xl shadow-lg border-2 border-white/30 dark:border-neutral-700/50 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm" 
              value={searchTerm} 
              onChange={handleSearchChange}
            />
            {isSearching ? 
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="absolute right-4 top-3.5 h-4 w-4 border-2 border-red-300 border-t-red-600 rounded-full"
              ></motion.div> : 
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
            }
          </div>
          
          <AnimatePresence>
            {renderSearchResults()}
          </AnimatePresence>
        </motion.div>

        {/* Menu "Toutes les catégories" - Desktop */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="hidden md:flex mt-4 justify-center" 
          role="navigation" 
          aria-label="Catégories"
        >
          <CategoriesDropdown categories={categories} />
        </motion.div>

        {/* Catégories - Mobile (collapsed by default) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="md:hidden mt-4"
        >
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="categories" className="border-none">
              <AccordionTrigger className="py-3 justify-center text-red-800 dark:text-red-400 font-bold text-lg hover:no-underline rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-300">
                Catégories
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-3 pt-3">
                  {categories.map((cat, index) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link 
                        to={`/categorie/${cat.name}`} 
                        className="text-sm py-3 px-4 rounded-xl bg-gradient-to-br from-neutral-50 to-gray-50 hover:from-red-50 hover:to-pink-50 dark:from-neutral-800 dark:to-neutral-700 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 capitalize text-center transition-all duration-300 font-medium text-red-800 dark:text-red-400 shadow-sm hover:shadow-md block"
                      >
                        {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
