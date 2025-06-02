
import React, { useState, useEffect } from 'react';
import { Users, Eye } from 'lucide-react';
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

  useEffect(() => {
    // Ne pas afficher si pas admin ou pas sur la page d'accueil
    if (!isAdmin || location.pathname !== '/') {
      return;
    }

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
      if (recordInterval) clearInterval(recordInterval);
      if (statsInterval) clearInterval(statsInterval);
      if (heartbeatInterval) clearInterval(heartbeatInterval);
    };
  }, [isAdmin, location.pathname]);

  // Ne pas afficher si pas admin ou pas sur la page d'accueil
  if (!isAdmin || location.pathname !== '/') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-4 max-w-xs">
      <div className="space-y-3">
        <motion.div 
          className="flex items-center space-x-2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <Users className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium">
            <span className="font-bold text-green-600 text-lg">{visitorStats.today.toLocaleString()}</span> visiteurs aujourd'hui
          </span>
        </motion.div>
        
        <motion.div 
          className="flex items-center space-x-2"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        >
          <Eye className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            <span className="font-bold text-blue-600 text-lg">{visitorStats.currentViewing}</span> personnes consultent actuellement
          </span>
        </motion.div>

        <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
          <div>Semaine: <span className="font-bold text-purple-600 text-sm">{visitorStats.week.toLocaleString()}</span></div>
          <div>Mois: <span className="font-bold text-orange-600 text-sm">{visitorStats.month.toLocaleString()}</span></div>
          <div>Année: <span className="font-bold text-red-600 text-sm">{visitorStats.year.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
};

export default LiveVisitorCounter;
