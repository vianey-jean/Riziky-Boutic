
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Zap, Sparkles, Gift, Star, ShoppingBag, Percent, Crown } from 'lucide-react';

interface PromoBannerProps {
  title: string;
  description: string;
  buttonText: string;
  link: string;
  imageUrl: string;
  discount?: string;
  endDate?: Date;
  theme?: 'red' | 'dark' | 'light' | 'purple' | 'gradient';
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
  theme = 'gradient',
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
    small: 'h-56 md:h-64',
    medium: 'h-72 md:h-96',
    large: 'h-96 md:h-[28rem]',
  };

  const themeClasses = {
    red: 'from-red-600 via-pink-600 to-red-700',
    dark: 'from-gray-900 via-slate-900 to-black',
    light: 'from-gray-100 via-white to-gray-200',
    purple: 'from-purple-600 via-violet-600 to-purple-900',
    gradient: 'from-red-500 via-pink-500 to-purple-600'
  };

  const buttonVariants = {
    red: 'bg-white text-red-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl border-2 border-white/20',
    dark: 'bg-white text-gray-900 hover:bg-gray-100 shadow-xl hover:shadow-2xl border-2 border-white/20',
    light: 'bg-gray-900 text-white hover:bg-gray-800 shadow-xl hover:shadow-2xl border-2 border-gray-900/20',
    purple: 'bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl border-2 border-white/20',
    gradient: 'bg-white text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 shadow-xl hover:shadow-2xl border-2 border-white/30 hover:border-white/50'
  };

  return (
    <motion.div 
      className={`relative ${heightClasses[size]} bg-gradient-to-br ${themeClasses[theme]} rounded-3xl overflow-hidden shadow-2xl my-12 border border-white/20 group`}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, type: "spring", damping: 25 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Éléments décoratifs animés améliorés */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 group-hover:scale-125 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24 group-hover:scale-125 transition-transform duration-700"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 group-hover:rotate-45 transition-transform duration-1000"></div>
      </div>
      
      {/* Particules flottantes améliorées */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/20"
          style={{
            width: `${4 + i % 3}px`,
            height: `${4 + i % 3}px`,
            left: `${15 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [-15, 15, -15],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Image d'arrière-plan avec effets avancés */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover opacity-25 group-hover:opacity-30 transition-opacity duration-500"
          initial={{ scale: 1.1 }}
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 0.8 }}
        />
        <div className={`absolute inset-0 ${theme === 'light' ? 'bg-white/70' : 'bg-black/30'} group-hover:bg-black/20 transition-colors duration-500`}></div>
      </div>

      {/* Badge de promotion flottant */}
      {discount && (
        <motion.div 
          className="absolute top-6 right-6 z-20"
          initial={{ scale: 0, rotate: -45 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", delay: 0.5, damping: 15 }}
        >
          <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl shadow-xl border-2 border-white/30 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5" />
              <span className="font-bold text-lg">-{discount}</span>
              <Percent className="h-4 w-4" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Contenu principal */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-8 flex flex-col md:flex-row items-center justify-between h-full">
          <motion.div 
            className="md:w-2/3 text-center md:text-left py-8 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >            
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {title}
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl opacity-95 max-w-lg leading-relaxed text-white/95"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {description}
            </motion.p>
            
            {endDate && (
              <motion.div 
                className="flex items-center justify-center md:justify-start space-x-3 text-base font-semibold text-white/90 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 inline-flex"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                <Clock className="h-5 w-5" />
                <span>{getRemainingTime()}</span>
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Button 
                asChild 
                className={`${buttonVariants[theme]} px-10 py-6 rounded-2xl font-bold text-xl transition-all duration-500 hover:scale-110 transform group/button relative overflow-hidden`}
              >
                <Link to={link} className="inline-flex items-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></div>
                  <ShoppingBag className="h-6 w-6 mr-3 relative z-10" />
                  <span className="relative z-10">{buttonText}</span>
                  <ArrowRight className="h-6 w-6 ml-3 transition-transform group-hover/button:translate-x-2 relative z-10" />
                </Link>
              </Button>
            </motion.div>

            {/* Indicateurs de confiance améliorés */}
            <motion.div 
              className="flex items-center justify-center md:justify-start space-x-6 text-sm text-white/80"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="font-semibold">4.9/5</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span className="font-semibold">+15,000 clients</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Animation de fond pulsante améliorée */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)',
            'radial-gradient(circle at 80% 70%, rgba(255,255,255,0.15) 0%, transparent 60%)',
            'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)',
            'radial-gradient(circle at 30% 80%, rgba(255,255,255,0.15) 0%, transparent 60%)',
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Effet de lueur au survol */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      </div>
    </motion.div>
  );
};

export default PromoBanner;
