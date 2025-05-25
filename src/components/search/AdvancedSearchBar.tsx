
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchSuggestion {
  id: string;
  query: string;
  type: 'trending' | 'recent' | 'suggestion';
  count?: number;
}

interface AdvancedSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({ 
  onSearch, 
  placeholder = "Rechercher des produits..." 
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Suggestions factices pour la démo
  const mockSuggestions: SearchSuggestion[] = [
    { id: '1', query: 'iPhone 15', type: 'trending', count: 1250 },
    { id: '2', query: 'Samsung Galaxy', type: 'trending', count: 980 },
    { id: '3', query: 'Écouteurs Bluetooth', type: 'trending', count: 756 },
    { id: '4', query: 'Chargeur sans fil', type: 'recent' },
    { id: '5', query: 'Coque téléphone', type: 'recent' },
    { id: '6', query: 'Montre connectée', type: 'suggestion' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = mockSuggestions.filter(s => 
        s.query.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions(mockSuggestions.slice(0, 6));
    }
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    onSearch(searchQuery);
    setQuery(searchQuery);
    setIsOpen(false);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.query);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder={placeholder}
          className="pl-10 pr-10 h-12 text-lg border-2 border-gray-200 focus:border-red-500 rounded-full"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="p-4 shadow-lg border border-gray-200">
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {suggestion.type === 'trending' && (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      )}
                      {suggestion.type === 'recent' && (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                      {suggestion.type === 'suggestion' && (
                        <Search className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm">{suggestion.query}</span>
                    </div>
                    {suggestion.count && (
                      <span className="text-xs text-gray-500">
                        {suggestion.count} recherches
                      </span>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100">
                <Button
                  onClick={() => handleSearch(query)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full"
                >
                  Rechercher "{query}"
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearchBar;
