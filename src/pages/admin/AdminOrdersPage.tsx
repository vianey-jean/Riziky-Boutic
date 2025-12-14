import React, { useState } from 'react';
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
import PageDataLoader from '@/components/layout/PageDataLoader';
import { Check, Package, Truck, ShoppingBag, MapPin, User, Calendar, CreditCard } from 'lucide-react';
import AdminLayout from './AdminLayout';

const AdminOrdersPage = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const queryClient = useQueryClient();
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await ordersAPI.getAll();
      return response.data;
    },
    enabled: dataLoaded,
  });

  const loadOrdersData = async () => {
    const response = await ordersAPI.getAll();
    return response.data;
  };

  const handleDataSuccess = () => {
    setDataLoaded(true);
  };

  const handleMaxRetriesReached = () => {
    toast.error('Impossible de charger les commandes');
  };

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

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${AUTH_BASE_URL}${imagePath}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmée': return 'from-blue-500 to-blue-600';
      case 'en préparation': return 'from-yellow-500 to-orange-500';
      case 'en livraison': return 'from-orange-500 to-red-500';
      case 'livrée': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmée': return Check;
      case 'en préparation': return Package;
      case 'en livraison': return Truck;
      case 'livrée': return ShoppingBag;
      default: return Check;
    }
  };

  if (!dataLoaded) {
    return (
      <AdminLayout>
        <PageDataLoader
          fetchFunction={loadOrdersData}
          onSuccess={handleDataSuccess}
          onMaxRetriesReached={handleMaxRetriesReached}
          loadingMessage="Chargement des commandes..."
          loadingSubmessage="Récupération des données de commandes..."
          errorMessage="Erreur de chargement des commandes"
        >
        </PageDataLoader>
      </AdminLayout>
    );
  }

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum: number, order: Order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter((order: Order) => order.status !== 'livrée').length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-2xl p-8 border border-indigo-200 dark:border-indigo-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
                  Gestion des Commandes
                </h1>
                <p className="text-indigo-600 dark:text-indigo-400">
                  Suivi et gestion des commandes clients
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-indigo-200 dark:border-indigo-700">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                    <p className="text-xl font-bold text-indigo-700 dark:text-indigo-300">{totalOrders}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-green-200 dark:border-green-700">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Revenus</p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-300">{totalRevenue.toFixed(2)}€</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-orange-200 dark:border-orange-700">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">En cours</p>
                    <p className="text-xl font-bold text-orange-700 dark:text-orange-300">{pendingOrders}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl w-fit mx-auto mb-6">
              <ShoppingBag className="h-16 w-16 text-gray-500 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Aucune commande</h3>
            <p className="text-gray-600 dark:text-gray-400">Les nouvelles commandes apparaîtront ici.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order: Order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <Card key={order.id} className="overflow-hidden shadow-xl border-0 bg-white dark:bg-gray-900 hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className={`bg-gradient-to-r ${getStatusColor(order.status)} p-3 rounded-xl shadow-lg`}>
                          <StatusIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                            Commande #{order.id.split('-')[1]}
                          </CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{order.userName} ({order.userEmail})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {order.totalAmount.toFixed(2)} €
                          </p>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getStatusColor(order.status)}`}>
                            <StatusIcon className="h-4 w-4 mr-1" />
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 space-y-6">
                    {/* Products */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                        <Package className="h-5 w-5 mr-2" />
                        Produits commandés
                      </h3>
                      <div className="grid gap-3">
                        {order.items.map((item) => (
                          <div key={item.productId} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
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
                                <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingBag className="h-6 w-6 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Quantité: {item.quantity} × {item.price.toFixed(2)} €
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 dark:text-gray-100">
                                {(item.quantity * item.price).toFixed(2)} €
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-emerald-600" />
                        Détails financiers
                      </h3>
                      <div className="space-y-3">
                        {order.subtotalProduits !== undefined && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Sous-total produits</span>
                            <span className="font-medium">{(order.subtotalProduits || 0).toFixed(2)} €</span>
                          </div>
                        )}
                        {order.discount !== undefined && order.discount > 0 && (
                          <div className="flex justify-between text-sm text-emerald-600">
                            <span>Remise appliquée</span>
                            <span className="font-medium">-{order.discount.toFixed(2)} €</span>
                          </div>
                        )}
                        {order.deliveryPrice !== undefined && order.deliveryPrice > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <Truck className="h-4 w-4" />
                              Frais de livraison ({order.shippingAddress.ville})
                            </span>
                            <span className="font-medium">{order.deliveryPrice.toFixed(2)} €</span>
                          </div>
                        )}
                        <div className="border-t border-emerald-200 dark:border-emerald-700 pt-3 mt-3">
                          <div className="flex justify-between">
                            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Total</span>
                            <span className="text-lg font-bold text-emerald-600">{order.totalAmount.toFixed(2)} €</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Adresse de livraison
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {order.shippingAddress.prenom} {order.shippingAddress.nom}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {order.shippingAddress.adresse}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {order.shippingAddress.codePostal} {order.shippingAddress.ville}, {order.shippingAddress.pays}
                        </p>
                      </div>
                    </div>

                    {/* Status Management */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getStatusColor(order.status)}`} />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Statut actuel: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <Select 
                        defaultValue={order.status} 
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-full sm:w-[200px] border-gray-300 dark:border-gray-600">
                          <SelectValue placeholder="Changer le statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmée">
                            <div className="flex items-center">
                              <Check className="mr-2 h-4 w-4 text-blue-600" />
                              <span>Confirmée</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="en préparation">
                            <div className="flex items-center">
                              <Package className="mr-2 h-4 w-4 text-yellow-600" />
                              <span>En préparation</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="en livraison">
                            <div className="flex items-center">
                              <Truck className="mr-2 h-4 w-4 text-orange-600" />
                              <span>En livraison</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="livrée">
                            <div className="flex items-center">
                              <ShoppingBag className="mr-2 h-4 w-4 text-green-600" />
                              <span>Livrée</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
