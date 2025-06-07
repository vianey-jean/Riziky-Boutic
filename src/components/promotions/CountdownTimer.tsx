
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Flame } from 'lucide-react';

interface CountdownTimerProps {
  endTime: Date;
  title?: string;
  onExpire?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  endTime, 
  title = "Offre limitée", 
  onExpire 
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime.getTime() - new Date().getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
        onExpire?.();
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  if (isExpired) {
    return (
      <div className="bg-gray-500 text-white p-4 rounded-lg text-center">
        <p className="font-medium">Offre expirée</p>
      </div>
    );
  }

  const timeUnits = [
    { label: 'Jours', value: timeLeft.days },
    { label: 'Heures', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds }
  ];

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 rounded-lg">
      <div className="flex items-center justify-center mb-3">
        <Flame className="h-5 w-5 mr-2 animate-pulse" />
        <span className="font-medium">{title}</span>
        <Clock className="h-4 w-4 ml-2" />
      </div>
      
      <div className="flex justify-center space-x-2">
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
              className="bg-black/30 backdrop-blur rounded-lg px-2 py-1 min-w-[40px] mb-1"
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
  );
};

export default CountdownTimer;
