
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, MapPin, Clock, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface SaleNotification {
  id: string;
  customerName: string;
  productName: string;
  location: string;
  timeAgo: string;
  type: 'purchase' | 'review' | 'signup';
}

const SalesNotificationWidget: React.FC = () => {
  const [notifications, setNotifications] = useState<SaleNotification[]>([]);
  const [currentNotification, setCurrentNotification] = useState<SaleNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Notifications factices
  const mockNotifications: SaleNotification[] = [
    {
      id: '1',
      customerName: 'Marie L.',
      productName: 'iPhone 15 Pro',
      location: 'Paris',
      timeAgo: 'il y a 3 minutes',
      type: 'purchase'
    },
    {
      id: '2',
      customerName: 'Thomas M.',
      productName: 'Samsung Galaxy S24',
      location: 'Lyon',
      timeAgo: 'il y a 7 minutes',
      type: 'purchase'
    },
    {
      id: '3',
      customerName: 'Sophie D.',
      productName: 'Casque Gaming',
      location: 'Marseille',
      timeAgo: 'il y a 12 minutes',
      type: 'review'
    },
    {
      id: '4',
      customerName: 'Lucas B.',
      productName: '',
      location: 'Toulouse',
      timeAgo: 'il y a 15 minutes',
      type: 'signup'
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  useEffect(() => {
    if (notifications.length === 0) return;

    let currentIndex = 0;
    
    const showNextNotification = () => {
      setCurrentNotification(notifications[currentIndex]);
      setIsVisible(true);
      
      setTimeout(() => setIsVisible(false), 4000);
      
      currentIndex = (currentIndex + 1) % notifications.length;
    };

    // Afficher la première notification après 5 secondes
    const initialTimer = setTimeout(showNextNotification, 5000);
    
    // Puis afficher une nouvelle notification toutes les 10 secondes
    const interval = setInterval(showNextNotification, 10000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [notifications]);

  if (!currentNotification) return null;

  const getNotificationContent = (notification: SaleNotification) => {
    switch (notification.type) {
      case 'purchase':
        return {
          icon: <ShoppingCart className="h-4 w-4 text-green-600" />,
          title: 'Nouvelle commande !',
          message: `${notification.customerName} a acheté "${notification.productName}"`,
          bgColor: 'from-green-50 to-emerald-50 border-green-200'
        };
      case 'review':
        return {
          icon: <Users className="h-4 w-4 text-blue-600" />,
          title: 'Nouvel avis !',
          message: `${notification.customerName} a laissé un avis sur "${notification.productName}"`,
          bgColor: 'from-blue-50 to-cyan-50 border-blue-200'
        };
      case 'signup':
        return {
          icon: <Users className="h-4 w-4 text-purple-600" />,
          title: 'Nouveau membre !',
          message: `${notification.customerName} vient de s'inscrire`,
          bgColor: 'from-purple-50 to-pink-50 border-purple-200'
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          title: 'Notification',
          message: notification.customerName,
          bgColor: 'from-gray-50 to-slate-50 border-gray-200'
        };
    }
  };

  const content = getNotificationContent(currentNotification);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-6 z-50 max-w-sm"
        >
          <div className={`bg-gradient-to-r ${content.bgColor} border-2 rounded-lg p-4 shadow-lg backdrop-blur-sm`}>
            <div className="flex items-start space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-white/80 text-gray-700 text-sm">
                  {currentNotification.customerName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  {content.icon}
                  <p className="text-sm font-medium text-gray-900">
                    {content.title}
                  </p>
                </div>
                
                <p className="text-sm text-gray-700 line-clamp-2">
                  {content.message}
                </p>
                
                <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span>{currentNotification.location}</span>
                  <span>•</span>
                  <Clock className="h-3 w-3" />
                  <span>{currentNotification.timeAgo}</span>
                </div>
              </div>
            </div>
            
            {/* Barre de progression */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 4, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-gray-400/30 rounded-b-lg"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SalesNotificationWidget;
