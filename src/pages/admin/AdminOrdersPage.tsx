
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { ordersAPI, Order } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Check, Package, Truck, ShoppingBag } from 'lucide-react';
import AdminLayout from './AdminLayout';

const AdminOrdersPage = () => {
  const queryClient = useQueryClient();
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await ordersAPI.getAll();
      return response.data;
    }
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string, status: string }) => {
      await ordersAPI.updateStatus(orderId, status as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Statut de la commande mis à jour');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  });

  const handleStatusChange = (orderId: string, status: string) => {
    updateOrderStatus.mutate({ orderId, status });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
  };

  // Helper function to ensure image URL has correct format
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    
    // If the image already has the full URL, return it
    if (imagePath.startsWith('http')) return imagePath;
    
    // If it's a relative path, add the base URL
    return `${AUTH_BASE_URL}${imagePath}`;
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Chargement des commandes...</div>;
  }

  return (
    <AdminLayout>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des Commandes</h1>

      {orders.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <p>Aucune commande trouvée.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order: Order) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <CardTitle>Commande #{order.id.split('-')[1]}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)} par {order.userName} ({order.userEmail})
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <p className="font-bold">{order.totalAmount.toFixed(2)} €</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Produits:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden mr-2">
                          {item.image ? (
                            <img 
                              src={getImageUrl(item.image)} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `${AUTH_BASE_URL}/uploads/placeholder.jpg`;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <ShoppingBag className="h-4 w-4 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.quantity} x {item.price.toFixed(2)} €</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Adresse de livraison:</h3>
                  <p className="text-sm">
                    {order.shippingAddress.prenom} {order.shippingAddress.nom}, {order.shippingAddress.adresse}, 
                    {order.shippingAddress.codePostal} {order.shippingAddress.ville}, {order.shippingAddress.pays}
                  </p>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="flex space-x-2 mb-2 sm:mb-0">
                    <div className={`w-3 h-3 rounded-full ${
                      order.status === 'confirmée' ? 'bg-blue-500' : 
                      order.status === 'en préparation' ? 'bg-yellow-500' :
                      order.status === 'en livraison' ? 'bg-orange-500' :
                      'bg-green-500'
                    }`} />
                    <span className="text-sm">
                      Statut actuel: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <Select 
                    defaultValue={order.status} 
                    onValueChange={(value) => handleStatusChange(order.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Changer le statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmée">
                        <div className="flex items-center">
                          <Check className="mr-2 h-4 w-4" />
                          <span>Confirmée</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="en préparation">
                        <div className="flex items-center">
                          <Package className="mr-2 h-4 w-4" />
                          <span>En préparation</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="en livraison">
                        <div className="flex items-center">
                          <Truck className="mr-2 h-4 w-4" />
                          <span>En livraison</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="livrée">
                        <div className="flex items-center">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          <span>Livrée</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
