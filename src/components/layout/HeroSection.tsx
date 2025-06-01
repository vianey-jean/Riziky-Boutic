
import React from 'react';
import { TrendingUp, Heart, ShoppingBag, Star } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  title, 
  description, 
  icon: Icon = TrendingUp 
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 dark:from-amber-500/5 dark:via-rose-500/5 dark:to-purple-500/5">
      <div className="absolute inset-0 bg-grid-neutral-100/50 dark:bg-grid-neutral-800/50" />
      <div className="container mx-auto px-4 py-16 relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-3 rounded-2xl shadow-lg">
              <Icon className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 bg-clip-text text-transparent mb-6">
            {title}
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
            {description}
          </p>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-rose-500" />
              <span>Les plus aimés</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-amber-500" />
              <span>Les plus achetés</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-purple-500" />
              <span>Recommandés</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
