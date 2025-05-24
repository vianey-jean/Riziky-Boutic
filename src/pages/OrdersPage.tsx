
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Truck, Package, ShoppingBag, X, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { Separator } from '@/components/ui/separator';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/sonner';
import { ordersAPI } from '@/services/api';

const OrdersPage = () => {
  const { orders, loadingOrders, fetchOrders } = useStore();
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [selectedItems, setSelectedItems] = useState<{[orderId: string]: string[]}>({});
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);

  useEffect(() => {
    // Forcer un rechargement des commandes à chaque fois
    fetchOrders();
    console.log("Chargement des commandes depuis la page des commandes");
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmée': return 'bg-blue-100 text-blue-800';
      case 'en préparation': return 'bg-yellow-100 text-yellow-800';
      case 'en livraison': return 'bg-orange-100 text-orange-800';
      case 'livrée': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to ensure image URL has correct format
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    
    // If the image already has the full URL, return it
    if (imagePath.startsWith('http')) return imagePath;
    
    // If it's a relative path, add the base URL
    return `${AUTH_BASE_URL}${imagePath}`;
  };

  const handleItemSelection = (orderId: string, itemId: string, checked: boolean) => {
    setSelectedItems(prev => {
      const orderItems = prev[orderId] || [];
      if (checked) {
        return { ...prev, [orderId]: [...orderItems, itemId] };
      } else {
        return { ...prev, [orderId]: orderItems.filter(id => id !== itemId) };
      }
    });
  };

  const handleSelectAllItems = (orderId: string, orderItems: any[], checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => ({ 
        ...prev, 
        [orderId]: orderItems.map(item => item.productId) 
      }));
    } else {
      setSelectedItems(prev => ({ ...prev, [orderId]: [] }));
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      setProcessingOrder(orderId);
      
      console.log('Suppression complète de la commande:', orderId);
      
      const response = await ordersAPI.cancelOrder(orderId, []);
      
      toast.success('Commande supprimée avec succès');
      
      // Recharger les commandes pour voir les changements
      await fetchOrders();
      
      // Réinitialiser les sélections
      setSelectedItems(prev => ({ ...prev, [orderId]: [] }));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de la commande');
    } finally {
      setProcessingOrder(null);
    }
  };

  const handleCancelProducts = async (orderId: string) => {
    try {
      setProcessingOrder(orderId);
      const itemsToCancel = selectedItems[orderId] || [];
      
      console.log('Annulation des produits:', itemsToCancel);
      
      const response = await ordersAPI.cancelOrder(orderId, itemsToCancel);
      
      if (response.data.cancelled) {
        toast.success('Commande complètement supprimée');
      } else {
        toast.success('Produits sélectionnés annulés avec succès. La commande a été mise à jour.');
      }
      
      // Recharger les commandes pour voir les changements
      await fetchOrders();
      
      // Réinitialiser les sélections
      setSelectedItems(prev => ({ ...prev, [orderId]: [] }));
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      toast.error('Erreur lors de l\'annulation des produits');
    } finally {
      setProcessingOrder(null);
    }
  };

  const canModifyOrder = (order: any) => {
    return order.status === 'confirmée' || order.status === 'en préparation';
  };

  const getSelectedItemsCount = (orderId: string) => {
    return selectedItems[orderId]?.length || 0;
  };

  const hasMultipleProducts = (order: any) => {
    return order.items.length > 1;
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Mes commandes</h1>

        {loadingOrders ? (
          <div className="text-center py-10">Chargement des commandes...</div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <CardTitle>Commande #{order.id.split('-')[1]}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.items.length} produit{order.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4 mb-4">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.productId} className="flex items-center">
                        <div className="w-12 h-12 rounded overflow-hidden">
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
                              <ShoppingBag className="h-6 w-6 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} × {item.price.toFixed(2)} €
                          </p>
                        </div>
                      </div>
                    ))}

                    {order.items.length > 3 && (
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                          <span className="text-sm font-medium">+{order.items.length - 3}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Status Steps */}
                  <div className="bg-white border rounded-lg p-4 mb-4">
                    <div className="flex justify-between">
                      <div className="flex flex-col items-center relative">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-brand-blue text-white z-10">
                          <Check className="h-4 w-4" />
                        </div>
                        <span className="text-xs text-center mt-2 max-w-[70px]">Confirmée</span>
                      </div>

                      <div className="flex flex-col items-center relative">
                        <div className={`absolute h-1 top-4 transform -translate-x-1/2 -left-1/2 w-full ${
                          order.status !== 'confirmée' ? 'bg-brand-blue' : 'bg-gray-200'
                        }`} />
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                          order.status !== 'confirmée' ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          <Package className="h-4 w-4" />
                        </div>
                        <span className="text-xs text-center mt-2 max-w-[70px]">En préparation</span>
                      </div>

                      <div className="flex flex-col items-center relative">
                        <div className={`absolute h-1 top-4 transform -translate-x-1/2 -left-1/2 w-full ${
                          order.status === 'en livraison' || order.status === 'livrée' ? 'bg-brand-blue' : 'bg-gray-200'
                        }`} />
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                          order.status === 'en livraison' || order.status === 'livrée' ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          <Truck className="h-4 w-4" />
                        </div>
                        <span className="text-xs text-center mt-2 max-w-[70px]">En livraison</span>
                      </div>

                      <div className="flex flex-col items-center relative">
                        <div className={`absolute h-1 top-4 transform -translate-x-1/2 -left-1/2 w-full ${
                          order.status === 'livrée' ? 'bg-brand-blue' : 'bg-gray-200'
                        }`} />
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                          order.status === 'livrée' ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          <ShoppingBag className="h-4 w-4" />
                        </div>
                        <span className="text-xs text-center mt-2 max-w-[70px]">Livrée</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="text-sm font-medium">Total</p>
                      <p className="text-xl font-bold">{order.totalAmount.toFixed(2)} €</p>
                    </div>
                    
                    <div className="flex gap-3">
                      {canModifyOrder(order) && (
                        <>
                          {/* Bouton Supprimer - toujours visible */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                disabled={processingOrder === order.id}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-md">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer la commande</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer complètement cette commande ? 
                                  Tous les produits seront remis en stock et la commande sera définitivement supprimée.
                                  Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {processingOrder === order.id ? 'Suppression...' : 'Confirmer la suppression'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          {/* Bouton Annuler - seulement si plusieurs produits */}
                          {/** {hasMultipleProducts(order) && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  disabled={processingOrder === order.id}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Annuler des produits
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="max-w-md">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Annuler des produits</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    <div className="space-y-4">
                                      <p className="text-sm">
                                        Sélectionnez les produits à annuler. Les produits non sélectionnés resteront dans votre commande.
                                      </p>
                                      <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`select-all-${order.id}`}
                                            checked={getSelectedItemsCount(order.id) === order.items.length}
                                            onCheckedChange={(checked) => 
                                              handleSelectAllItems(order.id, order.items, checked as boolean)
                                            }
                                          />
                                          <label htmlFor={`select-all-${order.id}`} className="text-sm font-medium">
                                            Tout sélectionner
                                          </label>
                                        </div>
                                        {order.items.map((item) => (
                                          <div key={item.productId} className="flex items-center space-x-2">
                                            <Checkbox
                                              id={`item-${item.productId}`}
                                              checked={selectedItems[order.id]?.includes(item.productId) || false}
                                              onCheckedChange={(checked) => 
                                                handleItemSelection(order.id, item.productId, checked as boolean)
                                              }
                                            />
                                            <label htmlFor={`item-${item.productId}`} className="text-sm">
                                              {item.name} (x{item.quantity}) - {item.price.toFixed(2)}€
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                      {getSelectedItemsCount(order.id) > 0 && (
                                        <p className="text-sm text-blue-600">
                                          {getSelectedItemsCount(order.id)} produit{getSelectedItemsCount(order.id) > 1 ? 's' : ''} sélectionné{getSelectedItemsCount(order.id) > 1 ? 's' : ''}
                                        </p>
                                      )}
                                    </div>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleCancelProducts(order.id)}
                                    disabled={getSelectedItemsCount(order.id) === 0}
                                    className="bg-orange-600 hover:bg-orange-700"
                                  >
                                    {processingOrder === order.id ? 'Annulation...' : 
                                     `Annuler ${getSelectedItemsCount(order.id)} produit${getSelectedItemsCount(order.id) > 1 ? 's' : ''}`
                                    }
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}*/}
                        </>
                      )}
                      
                      <Button asChild>
                        <Link to={`/commande/${order.id}`}>
                          Voir les détails
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <div className="mb-4">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">Vous n'avez pas encore de commandes</h2>
            <p className="text-muted-foreground mb-6">Commencez vos achats pour créer votre première commande</p>
            <Button asChild>
              <Link to="/">Explorer nos produits</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrdersPage;
