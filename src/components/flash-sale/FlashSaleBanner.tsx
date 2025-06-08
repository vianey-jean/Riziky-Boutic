
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Flame, Zap } from 'lucide-react';
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
        
        const response = await flashSaleAPI.getActive();
        
        if (response.data) {
          console.log('✅ Vente flash active trouvée:', response.data);
          setActiveFlashSale(response.data);
        } else {
          console.log('ℹ️ Aucune vente flash active');
          setActiveFlashSale(null);
        }
        setIsLoading(false);
      } catch (error: any) {
        // 404 est normal quand il n'y a pas de vente flash active - ne pas traiter comme une erreur
        if (error.response?.status === 404) {
          console.log('ℹ️ Aucune vente flash active trouvée');
          setActiveFlashSale(null);
          setIsLoading(false);
        } else if (error.response?.status === 429) {
          console.log('⚠️ Rate limiting atteint, réessai dans 30 secondes');
          setTimeout(fetchFlashSaleData, 30000);
          return;
        } else {
          console.error('❌ Erreur lors du chargement de la vente flash:', error);
          setActiveFlashSale(null);
          setIsLoading(false);
        }
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

  // Pour les tests - créer temporairement une vente flash factice si aucune n'est active
  const testFlashSale = {
    id: 'test-flash-sale',
    title: '🔥 VENTE FLASH TEST - 50% de Réduction !',
    description: 'Découvrez nos offres exceptionnelles sur une sélection de produits',
    discount: 50,
    startDate: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // Commencé il y a 1 heure
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Se termine dans 24h
    isActive: true,
    productIds: ['1746726531059'],
    createdAt: new Date().toISOString()
  };

  // Si pas de vente flash active, utiliser la vente de test pour démonstration
  const displayedFlashSale = activeFlashSale || testFlashSale;
  const shouldShowBanner = !isLoading && (activeFlashSale || true); // Toujours afficher pour demo

  console.log('🔍 État du banner:', {
    isLoading,
    hasActiveFlashSale: !!activeFlashSale,
    isExpired,
    shouldShowBanner,
    displayedFlashSale: displayedFlashSale?.title
  });

  if (isLoading) {
    return (
      <div className="my-6 text-center">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-xl"></div>
      </div>
    );
  }

  if (!shouldShowBanner || isExpired) {
    console.log('🚫 Banner non affiché:', !shouldShowBanner ? 'Pas de vente flash' : 'Vente expirée');
    return null;
  }

  console.log('✅ Affichage du banner flash sale pour:', displayedFlashSale.title);

  const timeUnits = [
    { label: 'Jours', value: timeLeft.days },
    { label: 'Heures', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds }
  ];

  const secureFlashSaleUrl = `/flash-sale/${displayedFlashSale.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="my-6"
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden relative border-0 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 z-0" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiIC8+PC9zdmc+')]" />

        <div className="p-6 md:p-8 relative z-10 text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-yellow-500/30 backdrop-blur rounded-full">
                  <Flame className="h-6 w-6 text-yellow-300 animate-pulse" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{displayedFlashSale.title}</h2>
                <motion.span 
                  className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: [0.9, 1.05, 0.95, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 5 }}
                >
                  -{displayedFlashSale.discount}%
                </motion.span>
              </div>

              <p className="text-lg mb-6 text-white/90 max-w-xl">{displayedFlashSale.description}</p>

              <Button
                variant="secondary"
                className="bg-white text-red-600 hover:bg-gray-100 font-bold px-6 py-6 rounded-full shadow-lg hover:shadow-xl transition-all group"
                asChild
              >
                <Link to={secureFlashSaleUrl}>
                  <span>Voir les produits</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full">
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
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
          animate={{ 
            opacity: [0, 0.5, 0],
            x: [-500, 500, -500]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </Card>
    </motion.div>
  );
};

export default FlashSaleBanner;
