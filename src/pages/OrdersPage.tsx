import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Truck, Package, ShoppingBag, Trash2, RefreshCw, Eye, Star, Calendar, MapPin, CreditCard, Clock, Tag, Percent } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { ordersAPI, remboursementsAPI, type Remboursement } from '@/services/api';
import RefundForm from '@/components/orders/RefundForm';
import RefundTracking from '@/components/orders/RefundTracking';
import { motion } from 'framer-motion';
import { getSecureOrderId } from '@/services/secureIds';

const OrdersPage = () => {
  const { orders, loadingOrders, fetchOrders } = useStore();
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [userRemboursements, setUserRemboursements] = useState<Remboursement[]>([]);
  const [selectedRemboursement, setSelectedRemboursement] = useState<Remboursement | null>(null);

  useEffect(() => {
    fetchOrders();
    fetchUserRemboursements();
    console.log("Chargement des commandes depuis la page des commandes");
  }, []);

  const fetchUserRemboursements = async () => {
    try {
      const response = await remboursementsAPI.getUserRemboursements();
      setUserRemboursements(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des remboursements:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmée': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg';
      case 'en préparation': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg';
      case 'en livraison': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg';
      case 'livrée': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg';
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${AUTH_BASE_URL}${imagePath}`;
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      setProcessingOrder(orderId);
      
      console.log('Suppression complète de la commande:', orderId);
      
      const response = await ordersAPI.cancelOrder(orderId, []);
      
      toast.success('Commande supprimée avec succès');
      
      await fetchOrders();
      
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de la commande');
    } finally {
      setProcessingOrder(null);
    }
  };

  const canDeleteOrder = (order: any) => {
    return order.status === 'confirmée';
  };

  const canRequestRefund = (order: any) => {
    return ['en préparation', 'en livraison', 'livrée'].includes(order.status);
  };

  const getOrderRemboursement = (orderId: string) => {
    return userRemboursements.find(r => r.orderId === orderId);
  };

  const handleRefundRequest = (orderId: string) => {
    setSelectedOrderId(orderId);
    setRefundDialogOpen(true);
  };

  const handleRefundSuccess = () => {
    setRefundDialogOpen(false);
    setSelectedOrderId('');
    fetchUserRemboursements();
    toast.success('Demande de remboursement envoyée avec succès');
  };

  const handleTrackRefund = (orderId: string) => {
    const remboursement = getOrderRemboursement(orderId);
    if (remboursement) {
      setSelectedRemboursement(remboursement);
      setTrackingDialogOpen(true);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto p-4 py-8">
          {/* En-tête moderne avec gradient */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-6 shadow-xl">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Mes Commandes
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Suivez vos commandes, gérez vos retours et découvrez l'historique de vos achats
            </p>
            
            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <motion.div 
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
                    <p className="text-gray-600 font-medium">Commandes totales</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-green-600">{orders.filter(o => o.status === 'livrée').length}</p>
                    <p className="text-gray-600 font-medium">Livrées</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-purple-600">{orders.filter(o => o.status === 'en livraison').length}</p>
                    <p className="text-gray-600 font-medium">En cours</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Truck className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {loadingOrders ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-6 animate-pulse">
                <Package className="h-8 w-8" />
              </div>
              <p className="text-xl text-gray-600 font-medium">Chargement de vos commandes...</p>
            </motion.div>
          ) : orders.length > 0 ? (
            <div className="space-y-8">
              {orders.map((order, index) => {
                const remboursement = getOrderRemboursement(order.id);
                
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
                      <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                              <ShoppingBag className="h-8 w-8 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-2xl font-bold text-gray-900">
                                Commande #{order.id.split('-')[1]}
                              </CardTitle>
                              <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center text-gray-600">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  <span className="font-medium">{formatDate(order.createdAt)}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Package className="h-4 w-4 mr-2" />
                                  <span className="font-medium">{order.items.length} produit{order.items.length > 1 ? 's' : ''}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-3">
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${getStatusBadgeClass(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            {remboursement && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Remboursement: {remboursement.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-8">
                        {/* Produits */}
                        <div className="space-y-6 mb-8">
                          {order.items.slice(0, 3).map((item, itemIndex) => (
                            <motion.div 
                              key={item.productId} 
                              className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: itemIndex * 0.1 }}
                            >
                              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg ring-4 ring-white">
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
                                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                    <ShoppingBag className="h-10 w-10 text-gray-500" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-6 flex-1">
                                <h4 className="font-bold text-gray-900 text-lg mb-2">{item.name}</h4>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                  <div className="flex items-center space-x-3">
                                    <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-gray-200 shadow-sm">
                                      Quantité: {item.quantity}
                                    </span>
                                    <span className="bg-blue-100 px-4 py-2 rounded-full text-sm font-medium text-blue-700">
                                      {item.price.toFixed(2)} € / unité
                                    </span>
                                  </div>
                                  <span className="font-bold text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    {(item.price * item.quantity).toFixed(2)} €
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}

                          {order.items.length > 3 && (
                            <motion.div 
                              className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5, delay: 0.3 }}
                            >
                              <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center shadow-lg">
                                <span className="text-lg font-bold text-purple-700">+{order.items.length - 3}</span>
                              </div>
                              <div className="ml-6">
                                <span className="text-purple-700 font-medium">
                                  {order.items.length - 3} autre{order.items.length - 3 > 1 ? 's' : ''} produit{order.items.length - 3 > 1 ? 's' : ''}
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        {/* Détails financiers de la commande */}
                        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-blue-100">
                          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <CreditCard className="h-5 w-5 mr-3 text-blue-600" />
                            Détails de la commande
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700 font-medium">Sous-total produits:</span>
                                <span className="font-bold text-gray-900">{(order.subtotalProduits || order.originalAmount || 0).toFixed(2)} €</span>
                              </div>
                              
                              {order.codePromoUsed && typeof order.codePromoUsed === 'object' && (
                                <div className="flex justify-between items-center text-green-600">
                                  <span className="flex items-center font-medium">
                                    <Tag className="h-4 w-4 mr-2" />
                                    Code promo ({order.codePromoUsed.pourcentage}%):
                                  </span>
                                  <span className="font-bold">-{(order.discount || 0).toFixed(2)} €</span>
                                </div>
                              )}
                              
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700 font-medium">Sous-total après promo:</span>
                                <span className="font-bold text-gray-900">{(order.subtotalApresPromo || order.subtotalProduits || order.originalAmount || 0).toFixed(2)} €</span>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="flex items-center text-gray-700 font-medium">
                                  <Truck className="h-4 w-4 mr-2" />
                                  Frais de livraison:
                                </span>
                                <span className="font-bold text-gray-900">{(order.deliveryPrice || 0).toFixed(2)} €</span>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <span className="flex items-center text-gray-700 font-medium">
                                  <Percent className="h-4 w-4 mr-2" />
                                  TVA ({((order.taxRate || 0.20) * 100).toFixed(0)}%):
                                </span>
                                <span className="font-bold text-gray-900">{(order.taxAmount || 0).toFixed(2)} €</span>
                              </div>
                              
                              <Separator className="my-2" />
                              
                              <div className="flex justify-between items-center text-lg">
                                <span className="font-bold text-gray-900">Total TTC:</span>
                                <span className="font-bold text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                  {order.totalAmount.toFixed(2)} €
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Suivi de commande avec design amélioré */}
                        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-blue-100">
                          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <Truck className="h-5 w-5 mr-3 text-blue-600" />
                            Suivi de livraison
                          </h3>
                          <div className="flex justify-between items-center">
                            <div className="flex flex-col items-center relative">
                              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 text-white z-10 shadow-lg">
                                <Check className="h-6 w-6" />
                              </div>
                              <span className="text-sm text-center mt-3 font-medium text-green-600">Confirmée</span>
                            </div>

                            <div className="flex flex-col items-center relative">
                              <div className={`absolute h-2 top-5 transform -translate-x-1/2 -left-1/2 w-full rounded-full ${
                                order.status !== 'confirmée' ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gray-200'
                              }`} />
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shadow-lg ${
                                order.status !== 'confirmée' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-400'
                              }`}>
                                <Package className="h-6 w-6" />
                              </div>
                              <span className={`text-sm text-center mt-3 font-medium ${
                                order.status !== 'confirmée' ? 'text-blue-600' : 'text-gray-400'
                              }`}>En préparation</span>
                            </div>

                            <div className="flex flex-col items-center relative">
                              <div className={`absolute h-2 top-5 transform -translate-x-1/2 -left-1/2 w-full rounded-full ${
                                order.status === 'en livraison' || order.status === 'livrée' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
                              }`} />
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shadow-lg ${
                                order.status === 'en livraison' || order.status === 'livrée' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-200 text-gray-400'
                              }`}>
                                <Truck className="h-6 w-6" />
                              </div>
                              <span className={`text-sm text-center mt-3 font-medium ${
                                order.status === 'en livraison' || order.status === 'livrée' ? 'text-purple-600' : 'text-gray-400'
                              }`}>En livraison</span>
                            </div>

                            <div className="flex flex-col items-center relative">
                              <div className={`absolute h-2 top-5 transform -translate-x-1/2 -left-1/2 w-full rounded-full ${
                                order.status === 'livrée' ? 'bg-gradient-to-r from-pink-500 to-red-500' : 'bg-gray-200'
                              }`} />
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shadow-lg ${
                                order.status === 'livrée' ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white' : 'bg-gray-200 text-gray-400'
                              }`}>
                                <Star className="h-6 w-6" />
                              </div>
                              <span className={`text-sm text-center mt-3 font-medium ${
                                order.status === 'livrée' ? 'text-pink-600' : 'text-gray-400'
                              }`}>Livrée</span>
                            </div>
                          </div>
                        </div>

                        <Separator className="my-6" />

                        {/* Total et actions */}
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                <CreditCard className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600">Total de la commande</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                  {order.totalAmount.toFixed(2)} €
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-3">
                            {/* Bouton Supprimer */}
                            {canDeleteOrder(order) && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="destructive" 
                                    size="lg"
                                    disabled={processingOrder === order.id}
                                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300"
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
                            )}

                            {/* Bouton Remboursement */}
                            {canRequestRefund(order) && !remboursement && (
                              <Button 
                                variant="outline" 
                                size="lg"
                                onClick={() => handleRefundRequest(order.id)}
                                className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Remboursement
                              </Button>
                            )}

                            {/* Bouton Suivi remboursement */}
                            {remboursement && (
                              <Button 
                                variant="outline" 
                                size="lg"
                                onClick={() => handleTrackRefund(order.id)}
                                className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Suivre remboursement
                              </Button>
                            )}
                            
                            <Button 
                              asChild 
                              size="lg"
                              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              <Link to={`/${getSecureOrderId(order.id)}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Voir les détails
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="max-w-md mx-auto">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <ShoppingBag className="h-16 w-16 text-blue-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Aucune commande trouvée</h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Vous n'avez pas encore passé de commande. Découvrez nos produits exceptionnels !
                </p>
                <Button 
                  asChild 
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg"
                >
                  <Link to="/">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Explorer nos produits
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Dialog pour demande de remboursement */}
          <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Demande de remboursement</DialogTitle>
              </DialogHeader>
              {selectedOrderId && (
                <RefundForm
                  orderId={selectedOrderId}
                  onSuccess={handleRefundSuccess}
                  onCancel={() => setRefundDialogOpen(false)}
                />
              )}
            </DialogContent>
          </Dialog>

          {/* Dialog pour suivi de remboursement */}
          <Dialog open={trackingDialogOpen} onOpenChange={setTrackingDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Suivi de remboursement</DialogTitle>
              </DialogHeader>
              {selectedRemboursement && (
                <RefundTracking
                  remboursement={selectedRemboursement}
                  order={orders.find(o => o.id === selectedRemboursement.orderId)}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage;
