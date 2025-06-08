
import React, { useState, useEffect } from 'react';
import { Users, Eye, TrendingUp, Globe, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

interface VisitorStats {
  today: number;
  week: number;
  month: number;
  year: number;
  currentViewing: number;
}

const LiveVisitorCounter: React.FC = () => {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({
    today: 0,
    week: 0,
    month: 0,
    year: 0,
    currentViewing: 0
  });
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Ne pas afficher si pas admin ou pas sur la page d'accueil
    if (!isAdmin || location.pathname !== '/') {
      return;
    }

    // Cacher le widget après 2 secondes
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    let recordInterval: NodeJS.Timeout;
    let statsInterval: NodeJS.Timeout;
    let heartbeatInterval: NodeJS.Timeout;

    // Enregistrer la visite initiale
    const recordInitialVisit = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/visitors/record`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const stats = await response.json();
          setVisitorStats(stats);
          console.log('Visite initiale enregistrée:', stats);
        }
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la visite initiale:', error);
      }
    };

    // Récupérer les statistiques en temps réel
    const fetchStats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/visitors/stats`);
        if (response.ok) {
          const stats = await response.json();
          setVisitorStats(stats);
          console.log('Stats mises à jour:', stats);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
      }
    };

    // Envoyer un heartbeat pour maintenir le statut en ligne
    const sendHeartbeat = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/visitors/heartbeat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Heartbeat envoyé, utilisateurs en ligne:', result.currentViewing);
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi du heartbeat:', error);
      }
    };

    // Démarrer les processus
    recordInitialVisit();

    // Enregistrer les visites toutes les 5 secondes pour simuler de nouvelles visites
    recordInterval = setInterval(async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/visitors/record`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement périodique:', error);
      }
    }, 5000);

    // Mettre à jour les statistiques chaque seconde
    statsInterval = setInterval(fetchStats, 1000);

    // Envoyer un heartbeat toutes les 10 secondes
    heartbeatInterval = setInterval(sendHeartbeat, 10000);

    // Heartbeat initial
    sendHeartbeat();

    return () => {
      clearTimeout(hideTimer);
      if (recordInterval) clearInterval(recordInterval);
      if (statsInterval) clearInterval(statsInterval);
      if (heartbeatInterval) clearInterval(heartbeatInterval);
    };
  }, [isAdmin, location.pathname]);

  // Ne pas afficher si pas admin ou pas sur la page d'accueil
  if (!isAdmin || location.pathname !== '/') {
    return null;
  }

  const statsData = [
    {
      label: 'visiteurs aujourd\'hui',
      value: visitorStats.today,
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'from-emerald-500 to-green-500',
      pulse: true
    },
    {
      label: 'personnes consultent actuellement',
      value: visitorStats.currentViewing,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'from-blue-500 to-cyan-500',
      pulse: false
    }
  ];

  const additionalStats = [
    { label: 'Semaine', value: visitorStats.week, color: 'text-purple-600', icon: TrendingUp },
    { label: 'Mois', value: visitorStats.month, color: 'text-orange-600', icon: Globe },
    { label: 'Année', value: visitorStats.year, color: 'text-red-600', icon: Activity }
  ];

  return (
    <motion.div 
        className="fixed bottom-4 left-4 z-40 max-w-xs overflow-hidden h-[250px]"
      initial={{ opacity: 1, x: 0 }}
      animate={{ 
        opacity: isVisible || isHovered ? 1 : 0.7,
        x: isVisible || isHovered ? 0 : -280 
      }}
      transition={{ 
        duration: 0.5, 
        type: "spring", 
        damping: 25,
        stiffness: 120
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700 p-4 backdrop-blur-sm">
        {/* Éléments décoratifs animés */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full translate-y-6 -translate-x-6"></div>
        
        <div className="relative space-y-3">
          {/* En-tête avec gradient moderne */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Analytics Live</h3>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse"></div>
                <span>En temps réel</span>
              </div>
            </div>
          </div>

          {/* Statistiques principales avec design moderne */}
          <div className="space-y-2">
            {statsData.map((stat, index) => (
              <motion.div 
                key={index}
                className="flex items-center space-x-2 p-3 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300"
                animate={stat.pulse ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                whileHover={{ scale: 1.02 }}
              >
                <div className={`w-8 h-8 bg-gradient-to-r ${stat.bgColor} rounded-xl flex items-center justify-center relative shadow-lg`}>
                  <stat.icon className="h-4 w-4 text-white" />
                  {stat.pulse && (
                    <div className="absolute inset-0 bg-emerald-500 rounded-xl animate-ping opacity-20"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline space-x-1">
                    <span className={`font-bold text-lg ${stat.color}`}>
                      {stat.value.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 leading-tight">
                    {stat.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Statistiques supplémentaires avec design épuré */}
          <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-3 border border-gray-100 dark:border-gray-600 shadow-sm">
            <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Vue d'ensemble
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {additionalStats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center group cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mb-1 group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-300">
                      <stat.icon className="h-3 w-3 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className={`font-bold text-xs ${stat.color}`}>
                      {stat.value.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Indicateur de mise à jour moderne */}
          <motion.div 
            className="flex items-center justify-center space-x-1 text-xs text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-200 dark:border-gray-700"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full shadow-sm"></div>
            <span className="font-medium text-xs">Données synchronisées</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveVisitorCounter;
