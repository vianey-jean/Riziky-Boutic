
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { flashSaleAPI } from '@/services/flashSaleAPI';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface FlashSale {
  id: string;
  title: string;
  description: string;
  discount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  productIds: string[];
  createdAt: string;
}

const FlashSaleBanner: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [activeFlashSale, setActiveFlashSale] = useState<FlashSale | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer les données de vente flash via l'API
  useEffect(() => {
    const fetchFlashSaleData = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 Récupération de la vente flash active via API...');
        
        // Utiliser l'API au lieu d'accéder directement au fichier
        const response = await flashSaleAPI.getActive();
        
        if (response.data) {
          console.log('✅ Vente flash active trouvée:', response.data);
          setActiveFlashSale(response.data);
        } else {
          console.log('ℹ️ Aucune vente flash active');
          setActiveFlashSale(null);
        }
      } catch (error) {
        console.error('❌ Erreur lors du chargement de la vente flash:', error);
        setActiveFlashSale(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashSaleData();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchFlashSaleData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activeFlashSale) return;

    const calculateTimeLeft = () => {
      const endTime = new Date(activeFlashSale.endDate).getTime();
      const now = new Date().getTime();
      const diff = endTime - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [activeFlashSale]);

  if (isLoading || !activeFlashSale || isExpired) return null;

  const timeUnits = [
    { label: 'Jours', value: timeLeft.days },
    { label: 'Heures', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds }
  ];

  const secureFlashSaleUrl = `/flash-sale/${activeFlashSale.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="my-6"
    >
      <Card className="bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 text-white overflow-hidden relative">
        <div className="p-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-4">
                <Flame className="h-6 w-6 text-yellow-300 animate-pulse" />
                <h2 className="text-2xl font-bold">{activeFlashSale.title}</h2>
                <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                  -{activeFlashSale.discount}%
                </span>
              </div>

              <p className="text-lg mb-4 opacity-90">{activeFlashSale.description}</p>

              <Button
                variant="secondary"
                className="bg-white text-red-600 hover:bg-gray-100 font-bold px-6 py-3 rounded-full"
                asChild
              >
                <Link to={secureFlashSaleUrl}>
                  Voir les produits
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">Se termine dans :</span>
              </div>

              <div className="flex space-x-2">
                {timeUnits.map((unit, index) => (
                  <motion.div
                    key={unit.label}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <motion.div
                      key={unit.value}
                      initial={{ rotateX: -90 }}
                      animate={{ rotateX: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-black/30 backdrop-blur rounded-lg px-3 py-2 min-w-[50px] mb-1"
                    >
                      <div className="text-xl font-bold">
                        {unit.value.toString().padStart(2, '0')}
                      </div>
                    </motion.div>
                    <div className="text-xs opacity-80">{unit.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Animation de fond */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 pointer-events-none"
        />
      </Card>
    </motion.div>
  );
};

export default FlashSaleBanner;
