import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/contexts/StoreContext';
import { Check, Truck, Package, ShoppingBag, ArrowLeft, MapPin, Phone, Mail, Calendar, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { getRealId, getSecureRoute } from '@/services/secureIds';

const OrderPage = () => {
  const { secureOrderId } = useParams<{ secureOrderId: string }>();
  const { orders } = useStore();
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  console.log('OrderPage - Secure ID:', secureOrderId);
  
  // Récupérer l'ID réel de la commande à partir de l'ID sécurisé
  const realOrderId = secureOrderId ? getRealId(secureOrderId) : null;
  console.log('OrderPage - Real ID:', realOrderId);

  // Trouver la commande dans les données
  const order = realOrderId ? orders.find(o => o.id === realOrderId) : null;
  console.log('OrderPage - Order found:', order?.id);

  if (!order) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
          <motion.div 
            className="text-center max-w-md mx-auto p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Commande non trouvée</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              La commande que vous recherchez n'existe pas ou a été supprimée de nos registres.
            </p>
            <Button asChild className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to="/" className="flex items-center">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to ensure image URL has correct format
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    
    // If the image already has the full URL, return it
    if (imagePath.startsWith('http')) return imagePath;
    
    // If it's a relative path, add the base URL
    return `${AUTH_BASE_URL}${imagePath}`;
  };

  const steps = [
    { name: 'Commande confirmée', icon: Check, completed: true },
    { name: 'En préparation', icon: Package, completed: order.status !== 'confirmée' },
    { name: 'En cours de livraison', icon: Truck, completed: ['en livraison', 'livrée'].includes(order.status) },
    { name: 'Livrée', icon: ShoppingBag, completed: order.status === 'livrée' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'livrée':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'en livraison':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'en préparation':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* En-tête moderne avec gradient */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                      <ShoppingBag className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                        Commande #{order.id.split('-')[1]}
                      </h1>
                      <div className="flex items-center text-gray-600 mt-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Placée le {formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <span className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold ${getStatusColor(order.status)} shadow-lg`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <Button 
                    asChild 
                    variant="outline"
                    className="border-gray-300 hover:border-red-500 hover:text-red-600 transition-all duration-300"
                  >
                    <Link to={getSecureRoute('/commandes')} className="flex items-center">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Mes commandes
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Étapes de la commande avec design moderne */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <Truck className="h-6 w-6 mr-3 text-blue-600" />
                Suivi de votre commande
              </h2>
              <div className="relative">
                <div className="flex justify-between items-center">
                  {steps.map((step, index) => (
                    <motion.div 
                      key={index} 
                      className="flex flex-col items-center relative z-10"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                        step.completed 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-110' 
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        <step.icon className="h-8 w-8" />
                      </div>
                      <span className={`text-sm font-medium text-center max-w-[100px] ${
                        step.completed ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {step.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
                
                {/* Ligne de progression */}
                <div className="absolute top-8 left-8 right-8 h-1 bg-gray-200 rounded-full -z-10">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: steps.filter(step => step.completed).length > 0 
                        ? `${((steps.filter(step => step.completed).length - 1) / (steps.length - 1)) * 100}%`
                        : '0%'
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contenu principal */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <motion.div 
              className="xl:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Package className="h-6 w-6 mr-3 text-purple-600" />
                    Produits commandés
                  </h2>
                  <div className="space-y-6">
                    {order.items.map((item, index) => (
                      <motion.div 
                        key={item.productId} 
                        className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md">
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
                              <ShoppingBag className="h-8 w-8 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-6 flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg mb-2">{item.name}</h4>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <span className="text-gray-600 bg-white px-3 py-1 rounded-full text-sm border">
                              Quantité: {item.quantity}
                            </span>
                            <span className="font-bold text-xl text-red-600">
                              {(item.price * item.quantity).toFixed(2)} €
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Separator className="mx-8" />

                <div className="p-8">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-700 font-medium">Sous-total</span>
                      <span className="font-semibold text-lg">{order.totalAmount.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-700 font-medium flex items-center">
                        <Truck className="h-4 w-4 mr-2" />
                        Livraison
                      </span>
                      <span className="font-semibold text-lg text-green-600">Gratuit</span>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-red-600">
                        {order.totalAmount.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Adresse de livraison */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                  Informations de livraison
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {order.shippingAddress.prenom} {order.shippingAddress.nom}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">{order.shippingAddress.adresse}</p>
                      <p className="text-gray-600 text-sm">
                        {order.shippingAddress.codePostal} {order.shippingAddress.ville}
                      </p>
                      <p className="text-gray-600 text-sm">{order.shippingAddress.pays}</p>
                    </div>
                  </div>
                  {order.shippingAddress.telephone && (
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <Phone className="h-4 w-4 mr-3 text-green-600" />
                      <span className="text-gray-700">{order.shippingAddress.telephone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Méthode de paiement */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-3 text-green-600" />
                  Paiement
                </h2>
                <div className="p-4 bg-green-50 rounded-lg">
                  <span className="text-green-800 font-medium capitalize">
                    {order.paymentMethod === 'cash' ? 'Paiement à la livraison' : order.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Besoin d'aide?</h2>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 h-12"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contacter le support
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400 h-12"
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Suivre la livraison
                  </Button>
                </div>
              </div>

              {/* Informations de sécurité */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-blue-900 mb-2">Commande sécurisée</h3>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Votre commande est protégée et suivie en temps réel
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderPage;
