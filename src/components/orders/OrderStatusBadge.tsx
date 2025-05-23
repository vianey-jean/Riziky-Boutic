
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getStatusColor } from '@/lib/utils';
import { CheckCircle2, Package, Truck, ShoppingBag, HelpCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, className = '' }) => {
  // Get color based on status
  const colorClass = getStatusColor(status);
  
  // Get appropriate icon based on status
  const getIcon = () => {
    switch (status.toLowerCase()) {
      case 'confirmée':
        return <CheckCircle2 className="h-3.5 w-3.5 mr-1" />;
      case 'en préparation':
        return <Package className="h-3.5 w-3.5 mr-1" />;
      case 'en livraison':
        return <Truck className="h-3.5 w-3.5 mr-1" />;
      case 'livrée':
        return <ShoppingBag className="h-3.5 w-3.5 mr-1" />;
      default:
        return <HelpCircle className="h-3.5 w-3.5 mr-1" />;
    }
  };
  
  return (
    <Badge 
      variant="outline"
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}
    >
      {getIcon()} <span>{status}</span>
    </Badge>
  );
};

export default OrderStatusBadge;
