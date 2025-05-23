
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate } from '@/lib/utils';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { ChevronRight, Package } from 'lucide-react';
import { Order } from '@/services/api';

interface OrderSummaryProps {
  order: Order;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  const totalItems = order.items.reduce((total, item) => total + item.quantity, 0);
  
  // URL de base pour les images
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  // Sélectionnez jusqu'à 3 images de produits pour l'aperçu
  const previewImages = order.items.slice(0, 3).map(item => {
    const imagePath = item.image;
    if (!imagePath) return null;
    
    const fullImageUrl = `${AUTH_BASE_URL}/${imagePath.startsWith('/') ? imagePath.slice(1) : imagePath}`;
    
    return {
      url: fullImageUrl,
      name: item.name
    };
  }).filter(Boolean);
  
  return (
    <div className="bg-white border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <div className="flex items-center">
            <Package className="h-5 w-5 mr-2 text-gray-500" />
            <h3 className="font-medium text-lg">{order.id}</h3>
          </div>
          
          <div className="mt-1 text-sm text-gray-500">
            {formatDate(order.createdAt)} • {totalItems} {totalItems > 1 ? 'articles' : 'article'}
          </div>
          
          <div className="mt-2">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-medium">{formatPrice(order.totalAmount)}</div>
          <Button variant="ghost" size="sm" asChild className="mt-2">
            <Link to={`/commande/${order.id}`}>
              Détails <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
      
      {previewImages.length > 0 && (
        <div className="mt-3 flex items-center space-x-2">
          {previewImages.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={image.name}
              className="w-12 h-12 object-cover rounded-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `${AUTH_BASE_URL}/uploads/placeholder.jpg`;
              }}
            />
          ))}
          {order.items.length > 3 && (
            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-500">
              +{order.items.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
