
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { Package, MapPin, Calendar, CreditCard, Eye, ShoppingBag, TrendingUp, Clock, Sparkles } from 'lucide-react';

const OrdersPage = () => {
  const { orders, fetchOrders } = useStore();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  const loadOrders = async () => {
    try {
      await fetchOrders();
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      setLoading(false);
    }
  };

  const handleDataSuccess = () => {
    setLoading(false);
  };

  const handleMaxRetriesReached = () => {
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmée': return <Clock className="h-4 w-4" />;
      case 'en préparation': return <Package className="h-4 w-4" />;
      case 'en livraison': return <MapPin className="h-4 w-4" />;
      case 'livrée': return <Package className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmée': return 'bg-gradient-to-r from-yellow-500 to-orange-600';
      case 'en préparation': return 'bg-gradient-to-r from-blue-500 to-indigo-600';
      case 'en livraison': return 'bg-gradient-to-r from-purple-500 to-pink-600';
      case 'livrée': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder.svg';
    if (imagePath.startsWith('http')) return imagePath;
    
    // Correction: s'assurer que l'URL est correctement formée
    const baseUrl = 'https://riziky-boutic-server.onrender.com';
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${baseUrl}${cleanPath}`;
  };

  if (loading) {
    return (
      <Layout>
        <PageDataLoader
          fetchFunction={loadOrders}
          onSuccess={handleDataSuccess}
          onMaxRetriesReached={handleMaxRetriesReached}
          loadingMessage="Chargement de vos commandes..."
          loadingSubmessage="Récupération de votre historique d'achats..."
          errorMessage="Erreur de chargement des commandes"
        />
      </Layout>
    );
  }

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'confirmée' || o.status === 'en préparation').length;
  const deliveredOrders = orders.filter(o => o.status === 'livrée').length;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-none lg:rounded-3xl lg:mx-8 lg:mt-8 p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div className="space-y-4 mb-6 lg:mb-0">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                    <ShoppingBag className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">Mes Commandes</h1>
                    <p className="text-blue-100 text-lg">Suivez vos achats et livraisons</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto py-12 px-4">
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-100 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Commandes</p>
                    <p className="text-3xl font-bold text-blue-800 mt-1">{totalOrders}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                    <ShoppingBag className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-yellow-100 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">En cours</p>
                    <p className="text-3xl font-bold text-orange-800 mt-1">{pendingOrders}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500 to-yellow-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-100 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Livrées</p>
                    <p className="text-3xl font-bold text-green-800 mt-1">{deliveredOrders}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Orders List */}
          {orders.length === 0 ? (
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center space-y-6">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-full">
                    <ShoppingBag className="h-16 w-16 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-800">Aucune commande trouvée</h3>
                    <p className="text-gray-600 text-lg">Vous n'avez pas encore passé de commande.</p>
                  </div>
                  <Button 
                    onClick={() => navigate('/products')} 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Commencer mes achats
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="group border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center text-gray-800">
                          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl mr-3 shadow-lg">
                            <Package className="h-5 w-5 text-white" />
                          </div>
                          Commande #{order.id}
                        </CardTitle>
                        <CardDescription className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(order.createdAt)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={`${getStatusColor(order.status)} text-white border-0 px-4 py-2 shadow-lg`}>
                          <div className="flex items-center">
                            {getStatusIcon(order.status)}
                            <span className="ml-2 font-medium">
                              {order.status === 'confirmée' && 'Confirmée'}
                              {order.status === 'en préparation' && 'En préparation'}
                              {order.status === 'en livraison' && 'En livraison'}
                              {order.status === 'livrée' && 'Livrée'}
                            </span>
                          </div>
                        </Badge>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-800">{order.totalAmount.toFixed(2)} €</div>
                          <div className="text-sm text-gray-600 flex items-center">
                            <CreditCard className="h-4 w-4 mr-1" />
                            {order.items.length} article{order.items.length > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={`${order.id}-${item.productId}-${index}`} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shadow-md">
                            <img 
                              src={getImageUrl(item.image || '')} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.log('Image loading error for:', item.image);
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{item.name}</h4>
                            <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-800">{(item.price * item.quantity).toFixed(2)} €</div>
                            <div className="text-sm text-gray-600">{item.price.toFixed(2)} € / unité</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex justify-between items-center">
                      <div className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Livraison: {order.shippingAddress.prenom} {order.shippingAddress.nom}, {order.shippingAddress.ville}
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/order/${order.id}`)}
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage;
