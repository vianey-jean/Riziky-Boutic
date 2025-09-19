
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
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [hasNewSale, setHasNewSale] = useState(false);
  const [previousStats, setPreviousStats] = useState<OrderStats>({
    today: 0,
    week: 0,
    month: 0,
    year: 0
  });

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
          
          // Vérifier si les statistiques ont changé
          if (data.orderStats) {
            const statsChanged = 
              data.orderStats.today !== previousStats.today ||
              data.orderStats.week !== previousStats.week ||
              data.orderStats.month !== previousStats.month ||
              data.orderStats.year !== previousStats.year;

            if (statsChanged && (previousStats.today > 0 || previousStats.week > 0 || previousStats.month > 0 || previousStats.year > 0)) {
              console.log('Changement détecté dans les statistiques:', data.orderStats);
              setHasNewSale(true);
              setIsStatsVisible(true);
              
              // Masquer après 5 secondes
              setTimeout(() => {
                setHasNewSale(false);
                setIsStatsVisible(false);
              }, 5000);
            }
            
            setOrderStats(data.orderStats);
            setPreviousStats(data.orderStats);
          }
          
          if (data.notification) {
            console.log('Nouvelle notification de vente reçue:', data.notification);
            setCurrentNotification(data.notification);
            setLastCheckTime(new Date().toISOString());
            setHasNewSale(true);
            setIsStatsVisible(true);
            
            // Afficher la notification pendant 5 secondes
            setTimeout(() => {
              setCurrentNotification(null);
              setHasNewSale(false);
              setIsStatsVisible(false);
            }, 5000);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des nouvelles ventes:', error);
      }
    };

    // Vérifier les nouvelles ventes toutes les 2 secondes pour une synchronisation continue
    const interval = setInterval(checkForNewSales, 2000);

    // Vérification initiale
    checkForNewSales();

    return () => clearInterval(interval);
  }, [isAdmin, location.pathname, lastCheckTime, previousStats.today, previousStats.week, previousStats.month, previousStats.year]);

  // Ne pas afficher si pas admin ou pas sur la page d'accueil
  if (!isAdmin || location.pathname !== '/') {
    return null;
  }

  return (
    <>
      {/* Statistiques de commandes - cachées à droite par défaut */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isStatsVisible ? 0 : '100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed right-4 z-40 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-3 max-w-xs lg:top-20"
        style={{ marginTop: '100px' }}
        onMouseEnter={() => setIsStatsVisible(true)}
        onMouseLeave={() => !hasNewSale && setIsStatsVisible(false)}
      >
        <div className="space-y-2">

          <div className="flex items-center space-x-2 text-center">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600">Statistiques</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center">
              <Calendar className="h-3 w-3 text-green-600 mx-auto mb-1" />
              <div className="font-bold text-green-600 text-sm">{orderStats.today}</div>
              <div className="text-neutral-600 dark:text-neutral-400 text-xs">Aujourd'hui</div>
            </div>
            
            <div className="text-center">
              <Award className="h-3 w-3 text-purple-600 mx-auto mb-1" />
              <div className="font-bold text-purple-600 text-sm">{orderStats.week}</div>
              <div className="text-neutral-600 dark:text-neutral-400 text-xs">Semaine</div>
            </div>
            
            <div className="text-center">
              <TrendingUp className="h-3 w-3 text-orange-600 mx-auto mb-1" />
              <div className="font-bold text-orange-600 text-sm">{orderStats.month}</div>
              <div className="text-neutral-600 dark:text-neutral-400 text-xs">Mois</div>
            </div>
            
             <div className="text-center">
               <ShoppingBag className="h-3 w-3 text-red-600 mx-auto mb-1" />
               <div className="font-bold text-red-600 text-sm">{orderStats.year}</div>
               <div className="text-neutral-600 dark:text-neutral-400 text-xs">Année</div>
             </div>
           </div>
         </div>
       </motion.div>

      {/* Notification de vente - améliorée pour tous les écrans */}
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            initial={{ opacity: 0, x: -400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -400 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 20,
              duration: 0.6
            }}
            className="fixed mt-100px bottom-4  left-4 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-xl p-4 max-w-xs sm:max-w-sm border-2 border-green-300 mt-16 sm:mt-0"
          >
            <div className="flex items-start space-x-3">
              <div className="bg-white/20 rounded-full p-2 animate-pulse flex-shrink-0">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm mb-1">🎉 Nouvelle vente !</p>
                <p className="text-xs opacity-95 mb-1 truncate">
                  <span className="font-semibold">{currentNotification.customerName}</span> vient d'acheter
                </p>
                <p className="text-xs font-bold bg-white/20 rounded px-2 py-1 mb-2 truncate">
                  {currentNotification.name}
                </p>
                <div className="flex items-center justify-between text-xs opacity-90 mb-2 space-x-1">
                  <div className="flex items-center space-x-1 flex-1 min-w-0">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{currentNotification.location}</span>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Clock className="h-3 w-3" />
                    <span>{currentNotification.time}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/20 rounded px-2 py-1 text-center">
                    <div className="font-bold text-yellow-200 text-xs">Quantité</div>
                    <div className="font-semibold">{currentNotification.quantity}x</div>
                  </div>
                  <div className="bg-white/20 rounded px-2 py-1 text-center">
                    <div className="font-bold text-yellow-200 text-xs">Total</div>
                    <div className="font-semibold">{currentNotification.subtotal.toFixed(2)}€</div>
                  </div>
                </div>
                <div className="mt-2 text-xs bg-white/20 rounded px-2 py-1 text-center">
                  <span className="font-semibold">Prix: {currentNotification.price.toFixed(2)}€</span>
                </div>
              </div>
            </div>
            
            {/* Barre de progression animée */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SalesNotification;
