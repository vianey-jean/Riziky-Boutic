
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Edit, Trash2 } from 'lucide-react';

interface ProductListProps {
  products: any[];
  onEdit: (product: any) => void;
  onDelete: (productId: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete }) => {
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-3xl w-fit mx-auto mb-6">
          <Package className="h-16 w-16 text-gray-400 mx-auto" />
        </div>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">Aucun produit trouvé</h3>
        <p className="text-gray-500">Commencez par ajouter votre premier produit</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {products.map((product) => (
        <div key={product.id} className="group bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-6 flex-1">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                {product.image ? (
                  <img 
                    src={`${AUTH_BASE_URL}${product.image}`} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-500" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2 flex-1">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 line-clamp-2">{product.description}</p>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                    {product.price}€
                  </Badge>
                  <Badge variant="outline" className="border-blue-200 text-blue-600">
                    Stock: {product.stock || 0}
                  </Badge>
                  {product.categoryName && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      {product.categoryName}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(product)}
                className="border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDelete(product.id)}
                className="border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
