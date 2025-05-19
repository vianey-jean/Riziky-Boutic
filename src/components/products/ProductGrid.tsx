
import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/contexts/StoreContext';

interface ProductGridProps {
  products: Product[];
  title?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, title }) => {
  return (
    <section className="product-section">
      {title && <h2 className="text-2xl font-semibold mb-6 text-red-800">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="list" aria-label="Liste de produits">
        {products.map(product => (
          <div key={product.id} role="listitem">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Aucun produit trouvé</p>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
