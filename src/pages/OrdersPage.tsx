
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { EnhancedCard, EnhancedCardContent, EnhancedCardDescription, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Package, Search, Eye, Download, Truck, Clock, CheckCircle, AlertCircle, Calendar, CreditCard } from 'lucide-react';
import { formatEuropeanPrice } from '@/lib/ecommerce-utils';
import LoadingSpinner from '@/components/ui/loading-spinner';

const OrdersPage = () => {
  const { user } = useAuth();
  const { orders, loading } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = orders?.filter(order => 
    order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.status?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'en préparation':
        return <Clock className="w-4 h-4" />;
      case 'en livraison':
        return <Truck className="w-4 h-4" />;
      case 'livrée':
        return <CheckCircle className="w-4 h-4" />;
      case 'annulée':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'en préparation':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'en livraison':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'livrée':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'annulée':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmée':
        return 'Confirmée';
      case 'en préparation':
        return 'En préparation';
      case 'en livraison':
        return 'En livraison';
      case 'livrée':
        return 'Livrée';
      case 'annulée':
        return 'Annulée';
      default:
        return 'En attente';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Chargement de vos commandes..." />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-24">
          <div className="absolute inset-0 bg-black/20"></div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 relative z-10"
          >
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Package className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                Mes commandes
              </h1>
              <p className="text-xl text-green-100 leading-relaxed max-w-2xl mx-auto">
                Suivez vos commandes en temps réel et accédez à tout votre historique d'achats
              </p>
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto space-y-8"
          >
            {/* Search and Stats */}
            <motion.div variants={itemVariants}>
              <EnhancedCard>
                <EnhancedCardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input 
                          placeholder="Rechercher une commande..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total des commandes</p>
                      <p className="text-2xl font-bold text-green-600">{filteredOrders.length}</p>
                    </div>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            </motion.div>

            {/* Orders List */}
            <motion.div variants={itemVariants} className="space-y-6">
              <AnimatePresence>
                {filteredOrders.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <EnhancedCard>
                      <EnhancedCardContent className="p-12">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune commande trouvée</h3>
                        <p className="text-gray-500 mb-6">
                          {searchQuery ? 'Aucune commande ne correspond à votre recherche.' : 'Vous n\'avez pas encore passé de commande.'}
                        </p>
                        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                          Découvrir nos produits
                        </Button>
                      </EnhancedCardContent>
                    </EnhancedCard>
                  </motion.div>
                ) : (
                  filteredOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -2 }}
                    >
                      <EnhancedCard className="overflow-hidden border-0 shadow-lg">
                        <EnhancedCardContent className="p-0">
                          <div className="p-6">
                            {/* Order Header */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                                  {getStatusIcon(order.status)}
                                  <span className="text-white"></span>
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    Commande #{order.id.split('-')[1] || order.id}
                                  </h3>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="w-4 h-4" />
                                      <span>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <CreditCard className="w-4 h-4" />
                                      <span>{formatEuropeanPrice(order.totalAmount)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <Badge className={`${getStatusColor(order.status)} border`}>
                                  {getStatusText(order.status)}
                                </Badge>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                                  className="border-green-200 hover:bg-green-50 hover:border-green-300"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  {selectedOrder?.id === order.id ? 'Masquer' : 'Détails'}
                                </Button>
                              </div>
                            </div>

                            {/* Order Items Preview */}
                            <div className="flex -space-x-2 mb-4">
                              {order.items?.slice(0, 3).map((item: any, idx: number) => (
                                <div key={idx} className="w-12 h-12 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600 shadow-sm">
                                  {item.name?.charAt(0)}
                                </div>
                              ))}
                              {order.items?.length > 3 && (
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 border-2 border-white flex items-center justify-center text-xs font-medium text-white shadow-sm">
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>

                            {/* Expanded Details */}
                            <AnimatePresence>
                              {selectedOrder?.id === order.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="border-t border-gray-100 pt-6 mt-6"
                                >
                                  <div className="grid md:grid-cols-2 gap-6">
                                    {/* Items List */}
                                    <div>
                                      <h4 className="font-semibold text-gray-900 mb-4">Articles commandés</h4>
                                      <div className="space-y-3">
                                        {order.items?.map((item: any, idx: number) => (
                                          <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                              <span className="text-sm font-medium text-gray-600">
                                                {item.name?.charAt(0)}
                                              </span>
                                            </div>
                                            <div className="flex-1">
                                              <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                                              <p className="text-xs text-gray-500">Quantité: {item.quantity}</p>
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                              {formatEuropeanPrice(item.price * item.quantity)}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Order Summary & Actions */}
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-semibold text-gray-900 mb-4">Résumé</h4>
                                        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                                          <div className="flex justify-between">
                                            <span>Sous-total</span>
                                            <span>{formatEuropeanPrice(order.originalAmount || order.totalAmount)}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Livraison</span>
                                            <span>{formatEuropeanPrice(0)}</span>
                                          </div>
                                          <div className="border-t border-gray-200 pt-2 font-semibold">
                                            <div className="flex justify-between">
                                              <span>Total</span>
                                              <span>{formatEuropeanPrice(order.totalAmount)}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <Button 
                                          variant="outline" 
                                          className="w-full justify-start border-green-200 hover:bg-green-50"
                                        >
                                          <Download className="w-4 h-4 mr-2" />
                                          Télécharger la facture
                                        </Button>
                                        {order.status !== 'livrée' && order.status !== 'annulée' && (
                                          <Button 
                                            variant="outline" 
                                            className="w-full justify-start border-blue-200 hover:bg-blue-50"
                                          >
                                            <Truck className="w-4 h-4 mr-2" />
                                            Suivre la livraison
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </EnhancedCardContent>
                      </EnhancedCard>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage;
