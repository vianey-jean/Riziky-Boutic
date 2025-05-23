
import React from 'react';
import { CheckCircle, Circle, Truck, Package, ShoppingBag } from 'lucide-react';

interface OrderProgressTrackerProps {
  status: 'confirmée' | 'en préparation' | 'en livraison' | 'livrée';
}

const OrderProgressTracker: React.FC<OrderProgressTrackerProps> = ({ status }) => {
  // Définir l'index actuel basé sur le statut
  const steps = ['confirmée', 'en préparation', 'en livraison', 'livrée'];
  const currentIndex = steps.indexOf(status);
  
  return (
    <div className="w-full py-4">
      <div className="flex justify-between">
        {/* Commande confirmée */}
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center
            ${currentIndex >= 0 ? 'border-green-500 text-green-500' : 'border-gray-300 text-gray-300'}`}
          >
            <ShoppingBag size={20} />
          </div>
          <span className={`text-xs mt-2 font-medium
            ${currentIndex >= 0 ? 'text-green-500' : 'text-gray-400'}`}
          >
            Confirmée
          </span>
        </div>
        
        {/* Ligne de connexion */}
        <div className="flex-grow flex items-center mx-2">
          <div className={`h-1 w-full ${currentIndex >= 1 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
        </div>
        
        {/* En préparation */}
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center
            ${currentIndex >= 1 ? 'border-green-500 text-green-500' : 'border-gray-300 text-gray-300'}`}
          >
            <Package size={20} />
          </div>
          <span className={`text-xs mt-2 font-medium text-center
            ${currentIndex >= 1 ? 'text-green-500' : 'text-gray-400'}`}
          >
            En préparation
          </span>
        </div>
        
        {/* Ligne de connexion */}
        <div className="flex-grow flex items-center mx-2">
          <div className={`h-1 w-full ${currentIndex >= 2 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
        </div>
        
        {/* En livraison */}
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center
            ${currentIndex >= 2 ? 'border-green-500 text-green-500' : 'border-gray-300 text-gray-300'}`}
          >
            <Truck size={20} />
          </div>
          <span className={`text-xs mt-2 font-medium
            ${currentIndex >= 2 ? 'text-green-500' : 'text-gray-400'}`}
          >
            En livraison
          </span>
        </div>
        
        {/* Ligne de connexion */}
        <div className="flex-grow flex items-center mx-2">
          <div className={`h-1 w-full ${currentIndex >= 3 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
        </div>
        
        {/* Livrée */}
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center
            ${currentIndex >= 3 ? 'border-green-500 text-green-500' : 'border-gray-300 text-gray-300'}`}
          >
            <CheckCircle size={20} />
          </div>
          <span className={`text-xs mt-2 font-medium
            ${currentIndex >= 3 ? 'text-green-500' : 'text-gray-400'}`}
          >
            Livrée
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderProgressTracker;
