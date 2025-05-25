
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FlashSale {
  id: string;
  title: string;
  discount: number;
  endTime: Date;
  itemsLeft: number;
  totalItems: number;
}

const FlashSaleBanner: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  
  // Données factices pour la démo
  const flashSale: FlashSale = {
    id: '1',
    title: 'VENTE FLASH - Électronique',
    discount: 70,
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 heures
    itemsLeft: 23,
    totalItems: 100
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = flashSale.endTime.getTime() - new Date().getTime();
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [flashSale.endTime]);

  const progressPercentage = ((flashSale.totalItems - flashSale.itemsLeft) / flashSale.totalItems) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="my-6"
    >
      <Card className="bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 text-white overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-yellow-300 animate-pulse" />
              <h2 className="text-2xl font-bold">{flashSale.title}</h2>
              <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                -{flashSale.discount}%
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm">Se termine dans:</span>
              </div>
              
              <div className="flex space-x-2">
                {[
                  { label: 'H', value: timeLeft.hours },
                  { label: 'M', value: timeLeft.minutes },
                  { label: 'S', value: timeLeft.seconds }
                ].map((time, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-black/30 backdrop-blur rounded-lg px-3 py-2 min-w-[50px]">
                      <div className="text-xl font-bold">
                        {time.value.toString().padStart(2, '0')}
                      </div>
                    </div>
                    <div className="text-xs mt-1">{time.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Vendus: {flashSale.totalItems - flashSale.itemsLeft}/{flashSale.totalItems}</span>
                <span>{flashSale.itemsLeft} restants</span>
              </div>
              
              <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full rounded-full"
                />
              </div>
            </div>
            
            <Button 
              variant="secondary" 
              className="bg-white text-red-600 hover:bg-gray-100 font-bold px-6 py-3 rounded-full"
            >
              Voir les offres
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Animation de fond */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 40% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          />
        </div>
      </Card>
    </motion.div>
  );
};

export default FlashSaleBanner;
