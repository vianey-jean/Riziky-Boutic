
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MapPin, Clock, TrendingUp, Calendar, Award } from 'lucide-react';
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
            
            // Afficher la notification pendant 8 secondes
            setTimeout(() => {
              setCurrentNotification(null);
            }, 8000);
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
      {/* Statistiques de commandes - toujours visibles pour l'admin */}
      <div className="fixed top-20 right-4 z-40 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-4 max-w-xs">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-center">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">Statistiques Commandes</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="text-center">
              <Calendar className="h-4 w-4 text-green-600 mx-auto mb-1" />
              <div className="font-bold text-green-600 text-lg">{orderStats.today}</div>
              <div className="text-neutral-600 dark:text-neutral-400">Aujourd'hui</div>
            </div>
            
            <div className="text-center">
              <Award className="h-4 w-4 text-purple-600 mx-auto mb-1" />
              <div className="font-bold text-purple-600 text-lg">{orderStats.week}</div>
              <div className="text-neutral-600 dark:text-neutral-400">Semaine</div>
            </div>
            
            <div className="text-center">
              <TrendingUp className="h-4 w-4 text-orange-600 mx-auto mb-1" />
              <div className="font-bold text-orange-600 text-lg">{orderStats.month}</div>
              <div className="text-neutral-600 dark:text-neutral-400">Mois</div>
            </div>
            
            <div className="text-center">
              <ShoppingBag className="h-4 w-4 text-red-600 mx-auto mb-1" />
              <div className="font-bold text-red-600 text-lg">{orderStats.year}</div>
              <div className="text-neutral-600 dark:text-neutral-400">Année</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification de vente */}
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed bottom-20 left-4 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-xl p-4 max-w-sm border-2 border-green-300"
          >
            <div className="flex items-start space-x-3">
              <div className="bg-white/20 rounded-full p-2 animate-pulse">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-base mb-1">🎉 Nouvelle vente !</p>
                <p className="text-sm opacity-95 mb-1">
                  <span className="font-semibold">{currentNotification.customerName}</span> vient d'acheter
                </p>
                <p className="text-sm font-bold bg-white/20 rounded px-2 py-1 mb-2">
                  {currentNotification.name}
                </p>
                <div className="flex items-center justify-between text-xs opacity-90 mb-2">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{currentNotification.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{currentNotification.time}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/20 rounded px-2 py-1 text-center">
                    <div className="font-bold text-yellow-200">Quantité</div>
                    <div className="font-semibold">{currentNotification.quantity}x</div>
                  </div>
                  <div className="bg-white/20 rounded px-2 py-1 text-center">
                    <div className="font-bold text-yellow-200">Total</div>
                    <div className="font-semibold">{currentNotification.subtotal.toFixed(2)}€</div>
                  </div>
                </div>
                <div className="mt-2 text-xs bg-white/20 rounded px-2 py-1 text-center">
                  <span className="font-semibold">Prix unitaire: {currentNotification.price.toFixed(2)}€</span>
                </div>
              </div>
            </div>
            
            {/* Barre de progression animée */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 8, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SalesNotification;
