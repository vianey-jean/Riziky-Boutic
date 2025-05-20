
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  title?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, title }) => {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  
  return (
    <section className="product-section">
     {title && (
  <div className="flex flex-col items-center mb-6">
    <h2 className="text-2xl font-semibold text-red-800 mb-3">{title}</h2>
    <div className="flex items-center gap-2">
      <div className="flex bg-gray-100 rounded-lg p-1">
        <Button 
          type="button"
          variant="ghost" 
          size="sm"
          className={`rounded-md ${layout === 'grid' ? 'bg-white shadow-sm' : ''}`}
          onClick={() => setLayout('grid')}
          aria-label="Affichage en grille"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button 
          type="button"
          variant="ghost" 
          size="sm"
          className={`rounded-md ${layout === 'list' ? 'bg-white shadow-sm' : ''}`}
          onClick={() => setLayout('list')}
          aria-label="Affichage en liste"
        >
          <LayoutList className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
)}

      
      {layout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="list" aria-label="Liste de produits">
          {products.map(product => (
            <div key={product.id} role="listitem">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4" role="list" aria-label="Liste de produits">
          {products.map(product => (
            <div key={product.id} role="listitem" className="border border-gray-200 rounded-lg hover:border-red-200 hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 p-4">
                  <img 
                    src={product.image ? `${import.meta.env.VITE_API_BASE_URL}${product.image}` : '/placeholder.svg'} 
                    alt={product.name}
                    className="w-full h-48 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className="md:w-3/4 p-4">
                  <h3 className="text-lg font-medium mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-end">
                    {product.promotion ? (
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500 line-through">
                          {typeof product.originalPrice === 'number'
                            ? product.originalPrice.toFixed(2)
                            : product.price.toFixed(2)}{' '}
                            €
                        </p>
                        <p className="font-bold text-red-600 text-lg">{product.price.toFixed(2)} €</p>
                      </div>
                    ) : (
                      <p className="font-bold text-lg">{product.price.toFixed(2)} €</p>
                    )}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const { toggleFavorite } = require('@/contexts/StoreContext').useStore();
                          toggleFavorite(product);
                        }}
                      >
                        Favoris
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => {
                          const { addToCart } = require('@/contexts/StoreContext').useStore();
                          addToCart(product);
                        }}
                        disabled={!product.isSold || (product.stock !== undefined && product.stock <= 0)}
                      >
                        Ajouter au panier
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {products.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-muted-foreground">Aucun produit trouvé</p>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
