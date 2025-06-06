
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MapPin, Clock, TrendingUp, Calendar, Award, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

interface SaleNotification {
  id: string;
  customerName: string;
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  subtotal: number;
  orderId: string;
  location: string;
  timeAgo: string;
  timestamp: string;
  date: string;
  time: string;
}

interface OrderStats {
  today: number;
  week: number;
  month: number;
  year: number;
}

const SalesNotification: React.FC = () => {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const [currentNotification, setCurrentNotification] = useState<SaleNotification | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStats>({
    today: 0,
    week: 0,
    month: 0,
    year: 0
  });
  const [lastCheckTime, setLastCheckTime] = useState<string>(new Date().toISOString());

  useEffect(() => {
    // Ne pas afficher si pas admin ou pas sur la page d'accueil
    if (!isAdmin || location.pathname !== '/') {
      return;
    }

    const checkForNewSales = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales-notifications/latest?since=${lastCheckTime}`);
        if (response.ok) {
          const data = await response.json();
          
          // Mettre à jour les statistiques de commandes
          if (data.orderStats) {
            setOrderStats(data.orderStats);
          }
          
          if (data.notification) {
            console.log('Nouvelle notification de vente reçue:', data.notification);
            setCurrentNotification(data.notification);
            setLastCheckTime(new Date().toISOString());
            
            // Afficher la notification pendant 5 secondes
            setTimeout(() => {
              setCurrentNotification(null);
            }, 5000);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des nouvelles ventes:', error);
      }
    };

    // Vérifier les nouvelles ventes toutes les secondes pour une réactivité maximale
    const interval = setInterval(checkForNewSales, 1000);

    // Vérification initiale
    checkForNewSales();

    return () => clearInterval(interval);
  }, [isAdmin, location.pathname, lastCheckTime]);

  // Ne pas afficher si pas admin ou pas sur la page d'accueil
  if (!isAdmin || location.pathname !== '/') {
    return null;
  }

  return (
    <>
      {/* Statistiques de commandes - design amélioré */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed right-4 z-40 rounded-2xl shadow-2xl border max-w-xs lg:top-20"
        style={{ marginTop: '100px' }}
      >
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 backdrop-blur-lg border border-white/20 dark:border-gray-700 rounded-2xl p-4 shadow-xl">
          <div className="space-y-3">
            <motion.div 
              className="flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Statistiques Live
              </span>
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </motion.div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <motion.div 
                className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700"
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-green-500 p-1 rounded-full w-6 h-6 mx-auto mb-2 flex items-center justify-center">
                  <Calendar className="h-3 w-3 text-white" />
                </div>
                <motion.div 
                  className="font-bold text-green-600 text-lg"
                  key={orderStats.today}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {orderStats.today}
                </motion.div>
                <div className="text-green-600 text-xs font-medium">Aujourd'hui</div>
              </motion.div>
              
              <motion.div 
                className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-700"
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-purple-500 p-1 rounded-full w-6 h-6 mx-auto mb-2 flex items-center justify-center">
                  <Award className="h-3 w-3 text-white" />
                </div>
                <motion.div 
                  className="font-bold text-purple-600 text-lg"
                  key={orderStats.week}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {orderStats.week}
                </motion.div>
                <div className="text-purple-600 text-xs font-medium">Semaine</div>
              </motion.div>
              
              <motion.div 
                className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200 dark:border-orange-700"
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-orange-500 p-1 rounded-full w-6 h-6 mx-auto mb-2 flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 text-white" />
                </div>
                <motion.div 
                  className="font-bold text-orange-600 text-lg"
                  key={orderStats.month}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {orderStats.month}
                </motion.div>
                <div className="text-orange-600 text-xs font-medium">Mois</div>
              </motion.div>
              
              <motion.div 
                className="text-center p-3 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border border-red-200 dark:border-red-700"
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-red-500 p-1 rounded-full w-6 h-6 mx-auto mb-2 flex items-center justify-center">
                  <ShoppingBag className="h-3 w-3 text-white" />
                </div>
                <motion.div 
                  className="font-bold text-red-600 text-lg"
                  key={orderStats.year}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {orderStats.year}
                </motion.div>
                <div className="text-red-600 text-xs font-medium">Année</div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notification de vente - design amélioré */}
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            initial={{ opacity: 0, x: -400, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -400, scale: 0.8 }}
            transition={{ 
              type: "spring",
              stiffness: 120,
              damping: 20,
              duration: 0.6
            }}
            className="fixed bottom-4 left-4 z-50 max-w-xs sm:max-w-sm mt-16 sm:mt-0"
          >
            <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 text-white rounded-2xl shadow-2xl p-4 border-2 border-green-300/50 backdrop-blur-sm relative overflow-hidden">
              {/* Éléments décoratifs */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
              
              <div className="relative flex items-start space-x-3">
                <motion.div 
                  className="bg-white/25 backdrop-blur-sm rounded-full p-2 flex-shrink-0"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ShoppingBag className="h-5 w-5" />
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="font-bold text-sm mb-1 flex items-center">
                      🎉 Nouvelle vente ! 
                      <Zap className="h-3 w-3 ml-1 text-yellow-300" />
                    </p>
                    <p className="text-xs opacity-95 mb-1 truncate">
                      <span className="font-semibold">{currentNotification.customerName}</span> vient d'acheter
                    </p>
                  </motion.div>
                  
                  <motion.p 
                    className="text-xs font-bold bg-white/25 backdrop-blur-sm rounded-lg px-2 py-1 mb-2 truncate border border-white/20"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {currentNotification.name}
                  </motion.p>
                  
                  <motion.div 
                    className="flex items-center justify-between text-xs opacity-90 mb-2 space-x-1"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center space-x-1 flex-1 min-w-0 bg-white/15 rounded-md px-2 py-1">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{currentNotification.location}</span>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0 bg-white/15 rounded-md px-2 py-1">
                      <Clock className="h-3 w-3" />
                      <span>{currentNotification.time}</span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="grid grid-cols-2 gap-2 text-xs"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-2 text-center border border-white/20">
                      <div className="font-bold text-yellow-200 text-xs">Quantité</div>
                      <div className="font-semibold text-lg">{currentNotification.quantity}x</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-2 text-center border border-white/20">
                      <div className="font-bold text-yellow-200 text-xs">Total</div>
                      <div className="font-semibold text-lg">{currentNotification.subtotal.toFixed(2)}€</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="mt-2 text-xs bg-gradient-to-r from-white/20 to-white/30 backdrop-blur-sm rounded-lg px-2 py-1 text-center border border-white/20"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <span className="font-semibold">Prix: {currentNotification.price.toFixed(2)}€</span>
                  </motion.div>
                </div>
              </div>
              
              {/* Barre de progression animée améliorée */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-b-2xl"
              />
              
              {/* Indicateur de temps restant */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute top-2 right-2 text-xs opacity-75"
              >
                5s
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SalesNotification;
