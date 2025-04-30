
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, Heart, Search, User, LogOut, Settings, Package } from 'lucide-react';
import { productsAPI, Product } from '@/services/api';
import { debounce } from 'lodash';

const Navbar = () => {
  const { cart, favoriteCount } = useStore();
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);
  const baseImageUrl = "https://riziky-boutic-server.onrender.com";
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const debouncedSearch = debounce(async (term: string) => {
    if (term.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await productsAPI.search(term);
      if (response.data && Array.isArray(response.data)) {
        setSearchResults(response.data);
      } else {
        setSearchResults([]);
      }
      setShowResults(true);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, 300);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length >= 3) {
      debouncedSearch(value);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };
  
  const handleProductClick = (productId: string) => {
    setShowResults(false);
    setSearchTerm('');
    navigate(`/produit/${productId}`);
  };
  
  return (
    <nav className="border-b py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-red-800">Riziky Boutique</Link>
          
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full" ref={searchRef}>
              <Input 
                type="text" 
                placeholder="Rechercher des produits..." 
                className="w-full pl-10" 
                value={searchTerm} 
                onChange={handleSearchChange} 
              />
              {isSearching ? (
                <div className="absolute right-3 top-2.5 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-brand-blue"></div>
              ) : (
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              )}
              
              {showResults && searchResults.length > 0 && (
                <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-2 max-h-60 overflow-auto">
                  <ul className="py-1">
                    {searchResults.map(product => (
                      <li 
                        key={product.id} 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleProductClick(product.id)}
                      >
                        <div className="flex items-center">
                          <img 
                            src={`${baseImageUrl}${product.images && product.images.length > 0 ? product.images[0] : product.image}`} 
                            alt={product.name} 
                            className="w-10 h-10 object-cover rounded mr-3" 
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.price.toFixed(2)} €</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {showResults && searchTerm.length >= 3 && searchResults.length === 0 && (
                <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-2 p-4 text-center">
                  Aucun produit trouvé pour "{searchTerm}"
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/favoris" className="relative">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              {favoriteCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs rounded-full">
                  {favoriteCount}
                </Badge>
              )}
            </Link>
            
            <Link to="/panier" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {cartItemsCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs rounded-full">
                  {cartItemsCount}
                </Badge>
              )}
            </Link>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
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
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        <div className="md:hidden mt-4 relative" ref={searchRef}>
          <Input 
            type="text" 
            placeholder="Rechercher des produits..." 
            className="w-full pl-10" 
            value={searchTerm} 
            onChange={handleSearchChange} 
          />
          {isSearching ? (
            <div className="absolute right-3 top-2.5 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-brand-blue"></div>
          ) : (
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          )}
          
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-2 max-h-60 overflow-auto">
              <ul className="py-1">
                {searchResults.map(product => (
                  <li 
                    key={product.id} 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="flex items-center">
                      <img 
                        src={`${baseImageUrl}${product.images && product.images.length > 0 ? product.images[0] : product.image}`} 
                        alt={product.name} 
                        className="w-10 h-10 object-cover rounded mr-3" 
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.price.toFixed(2)} €</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {showResults && searchTerm.length >= 3 && searchResults.length === 0 && (
            <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-2 p-4 text-center">
              Aucun produit trouvé pour "{searchTerm}"
            </div>
          )}
        </div>
        
        <div className="mt-4 flex space-x-4 overflow-x-auto py-2">
          <Link to="/categorie/electronique" className="text-sm whitespace-nowrap text-red-800 hover:text-red-600">Électronique</Link>
          <Link to="/categorie/mode" className="text-sm whitespace-nowrap text-red-800 hover:text-red-600">Mode</Link>
          <Link to="/categorie/maison" className="text-sm whitespace-nowrap text-red-800 hover:text-red-600">Maison</Link>
          <Link to="/categorie/beaute" className="text-sm whitespace-nowrap text-red-800 hover:text-red-600">Beauté</Link>
          <Link to="/categorie/sport" className="text-sm whitespace-nowrap text-red-800 hover:text-red-600">Sport</Link>
          <Link to="/categorie/bijoux" className="text-sm whitespace-nowrap text-red-800 hover:text-red-600">Bijoux</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
