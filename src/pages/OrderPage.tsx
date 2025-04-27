
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/contexts/StoreContext';
import { Check, Truck, Package, ShoppingBag } from 'lucide-react';

const OrderPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useStore();
  
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Commande non trouvée</h1>
          <p className="mb-6">La commande que vous recherchez n'existe pas ou a été supprimée.</p>
          <Button asChild>
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Order status steps
  const steps = [
    { name: 'Commande confirmée', icon: Check, completed: true },
    { name: 'En préparation', icon: Package, completed: order.status !== 'en attente' },
    { name: 'En cours de livraison', icon: Truck, completed: order.status === 'expédiée' || order.status === 'livrée' },
    { name: 'Livrée', icon: ShoppingBag, completed: order.status === 'livrée' }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Commande #{order.id.split('-')[1]}</h1>
            <p className="text-muted-foreground">Placée le {formatDate(order.date)}</p>
          </div>
          <div className="mt-2 sm:mt-0">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              order.status === 'livrée' ? 'bg-green-100 text-green-800' : 
              order.status === 'expédiée' ? 'bg-blue-100 text-blue-800' : 
              'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Order status tracker */}
        <div className="bg-white border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-6">Statut de la commande</h2>
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center relative">
                {index > 0 && (
                  <div className={`absolute h-1 top-4 transform -translate-x-1/2 -left-1/2 w-full ${
                    step.completed ? 'bg-brand-blue' : 'bg-gray-200'
                  }`} />
                )}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                  step.completed ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  <step.icon className="h-4 w-4" />
                </div>
                <span className="text-xs text-center mt-2 max-w-[70px]">{step.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Produits commandés</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.product.id} className="flex">
                      <div className="w-16 h-16 rounded overflow-hidden">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <div className="flex justify-between mt-1">
                          <span className="text-sm text-muted-foreground">Quantité: {item.quantity}</span>
                          <span className="font-medium">{(item.product.price * item.quantity).toFixed(2)} €</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="p-6">
                <div className="flex justify-between mb-2">
                  <span>Sous-total</span>
                  <span>{order.total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Livraison</span>
                  <span>0.00 €</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Taxes</span>
                  <span>{(order.total * 0.2).toFixed(2)} €</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>{(order.total * 1.2).toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white border rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Informations de livraison</h2>
              <p className="text-sm mb-1">Jean Dupont</p>
              <p className="text-sm mb-1">123 Rue de Paris</p>
              <p className="text-sm mb-1">75001 Paris</p>
              <p className="text-sm">France</p>
            </div>
            
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Besoin d'aide?</h2>
              <Button variant="outline" className="w-full mb-2">
                Contacter le support
              </Button>
              <Button variant="outline" className="w-full">
                Suivre la livraison
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderPage;
