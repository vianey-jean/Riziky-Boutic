
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface PromoBannerProps {
  title: string;
  description: string;
  buttonText: string;
  link: string;
  imageUrl: string;
  discount?: string;
  endDate?: Date;
  theme?: 'red' | 'dark' | 'light' | 'purple';
  size?: 'small' | 'medium' | 'large';
}

const PromoBanner: React.FC<PromoBannerProps> = ({
  title,
  description,
  buttonText,
  link,
  imageUrl,
  discount,
  endDate,
  theme = 'dark',
  size = 'medium'
}) => {
  // Calculer le temps restant
  const getRemainingTime = () => {
    if (!endDate) return null;
    
    const now = new Date();
    const diffInMs = endDate.getTime() - now.getTime();
    
    if (diffInMs <= 0) return 'Promotion terminée';
    
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffInDays > 0) {
      return `${diffInDays} jour${diffInDays > 1 ? 's' : ''} restant${diffInDays > 1 ? 's' : ''}`;
    } else {
      return `${diffInHours} heure${diffInHours > 1 ? 's' : ''} restante${diffInHours > 1 ? 's' : ''}`;
    }
  };

  const heightClasses = {
    small: 'h-40 md:h-48',
    medium: 'h-60 md:h-72',
    large: 'h-80 md:h-96',
  };

  const themeClasses = {
    red: 'bg-gradient-to-r from-red-600 to-red-700 text-white',
    dark: 'bg-gradient-to-r from-gray-900 to-black text-white',
    light: 'bg-gradient-to-r from-gray-100 to-white text-gray-900',
    purple: 'bg-gradient-to-r from-purple-600 to-purple-900 text-white'
  };

  const buttonVariants = {
    red: 'bg-white text-red-600 hover:bg-gray-100',
    dark: 'bg-white text-gray-900 hover:bg-gray-100',
    light: 'bg-gray-900 text-white hover:bg-gray-800',
    purple: 'bg-white text-purple-600 hover:bg-gray-100'
  };

  return (
    <div className={`relative ${heightClasses[size]} ${themeClasses[theme]} rounded-xl overflow-hidden shadow-lg my-6`}>
      {/* Image d'arrière-plan avec effet parallaxe */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          initial={{ scale: 1.05 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        />
        <div className={`absolute inset-0 ${theme === 'light' ? 'bg-white/50' : 'bg-black/50'}`}></div>
      </div>

      {/* Contenu */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between h-full">
          <div className="md:w-2/3 text-center md:text-left py-6">
            {discount && (
              <div className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                {discount}
              </div>
            )}
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{title}</h2>
            <p className="mb-6 opacity-90 max-w-md">{description}</p>
            
            {endDate && (
              <p className="text-sm font-medium mb-4 opacity-80">
                {getRemainingTime()}
              </p>
            )}
            
            <Button asChild className={buttonVariants[theme]}>
              <Link to={link}>{buttonText}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
