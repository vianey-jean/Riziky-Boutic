
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { flashSaleAPI } from '@/services/flashSaleAPI';
import { DynamicIcon } from '@/utils/iconLoader';
import { getSecureRoute } from '@/services/secureIds';

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
  backgroundColor?: string;
  icon?: string;
  emoji?: string;
  order?: number;
}

const FlashSaleBanner: React.FC = () => {
  const [timeLeftMap, setTimeLeftMap] = useState<{[key: string]: TimeLeft}>({});
  const [expiredSales, setExpiredSales] = useState<Set<string>>(new Set());
  const [activeFlashSales, setActiveFlashSales] = useState<FlashSale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFlashSaleData = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 Récupération des ventes flash actives via API...');
        
        const response = await flashSaleAPI.getActiveAll();
        
        if (response.data && response.data.length > 0) {
          console.log('✅ Ventes flash actives trouvées:', response.data);
          // Trier par ordre (order) croissant
          const sortedFlashSales = response.data.sort((a, b) => (a.order || 999) - (b.order || 999));
          setActiveFlashSales(sortedFlashSales);
        } else {
          console.log('ℹ️ Aucune vente flash active');
          setActiveFlashSales([]);
        }
        setIsLoading(false);
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log('ℹ️ Aucune vente flash active trouvée');
          setActiveFlashSales([]);
          setIsLoading(false);
        } else if (error.response?.status === 429) {
          console.log('⚠️ Rate limiting atteint, réessai dans 30 secondes');
          setTimeout(fetchFlashSaleData, 30000);
          return;
        } else {
          console.error('❌ Erreur lors du chargement des ventes flash:', error);
          setActiveFlashSales([]);
          setIsLoading(false);
        }
      }
    };

    fetchFlashSaleData();
    const interval = setInterval(fetchFlashSaleData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeFlashSales.length === 0) return;

    const calculateTimeLeft = () => {
      const newTimeLeftMap: {[key: string]: TimeLeft} = {};
      const newExpiredSales = new Set<string>();

      activeFlashSales.forEach(sale => {
        const endTime = new Date(sale.endDate).getTime();
        const now = new Date().getTime();
        const diff = endTime - now;

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          newTimeLeftMap[sale.id] = { days, hours, minutes, seconds };
        } else {
          newTimeLeftMap[sale.id] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
          newExpiredSales.add(sale.id);
        }
      });

      setTimeLeftMap(newTimeLeftMap);
      setExpiredSales(newExpiredSales);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [activeFlashSales]);

  if (isLoading) {
    return (
      <div className="my-6 space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (activeFlashSales.length === 0) {
    return null;
  }

  const activeSales = activeFlashSales.filter(sale => !expiredSales.has(sale.id));

  if (activeSales.length === 0) {
    return null;
  }

  return (
    <div className="my-6 space-y-4">
      {activeSales.map((flashSale, index) => {
        const timeLeft = timeLeftMap[flashSale.id] || { days: 0, hours: 0, minutes: 0, seconds: 0 };
        
        const timeUnits = [
          { label: 'Jours', value: timeLeft.days },
          { label: 'Heures', value: timeLeft.hours },
          { label: 'Min', value: timeLeft.minutes },
          { label: 'Sec', value: timeLeft.seconds }
        ];

        // Utiliser les données spécifiques de chaque vente flash
        const backgroundColor = flashSale.backgroundColor || '#dc2626';
        const iconName = flashSale.icon || 'Flame';
        const emoji = flashSale.emoji || '🔥';

        // Générer le lien sécurisé pour cette vente flash spécifique
        const secureFlashSaleRoute = getSecureRoute('/flash-sale');

        return (
          <motion.div
            key={flashSale.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden relative border-0 shadow-xl">
              <div 
                className="absolute inset-0 z-0" 
                style={{ backgroundColor }}
              />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiIC8+PC9zdmc+')] opacity-30" />

              <div className="p-6 md:p-8 relative z-10 text-white">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="p-2 bg-white/20 backdrop-blur rounded-full">
                        <DynamicIcon name={iconName} className="h-6 w-6 text-white animate-pulse" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{flashSale.title}</h2>
                      <span className="text-2xl">{emoji}</span>
                      <motion.span 
                        className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: [0.9, 1.05, 0.95, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 5 }}
                      >
                        -{flashSale.discount}%
                      </motion.span>
                    </div>

                    <p className="text-lg mb-6 text-white/90 max-w-xl">{flashSale.description}</p>

                    <Button
                      variant="secondary"
                      className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-6 py-6 rounded-full shadow-lg hover:shadow-xl transition-all group"
                      asChild
                    >
                      <Link to={`${secureFlashSaleRoute}?index=${index}`}>
                        <span>Voir les produits</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>

                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full">
                      <Clock className="h-5 w-5" />
                      <span className="text-sm font-bold">Se termine dans :</span>
                    </div>

                    <div className="flex space-x-2">
                      {timeUnits.map((unit, unitIndex) => (
                        <motion.div
                          key={unit.label}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: unitIndex * 0.1 }}
                          className="text-center"
                        >
                          <motion.div
                            key={`${unit.label}-${unit.value}`}
                            initial={{ rotateX: -90 }}
                            animate={{ rotateX: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-black/30 backdrop-blur-md rounded-lg px-3 py-2 min-w-[60px] mb-1 border border-white/10"
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

              {/* Éléments décoratifs animés */}
              <motion.div
                className="absolute top-4 right-4 bg-white/10 w-16 h-16 rounded-full blur-xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-4 left-10 bg-yellow-500/20 w-20 h-20 rounded-full blur-xl"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              />
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FlashSaleBanner;
