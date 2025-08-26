
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Crown, Star, ArrowRight } from 'lucide-react';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { motion } from 'framer-motion';

const LuxuryHeroSection: React.FC = () => {
  return (
   <section className="relative overflow-hidden hero-section">
  {/* Background Elements */}
  <div className="absolute inset-0">
    <div className="absolute top-10 left-5 w-16 h-16 bg-luxury-gold/20 rounded-full blur-2xl animate-float" />
    <div
      className="absolute bottom-10 right-5 w-20 h-20 bg-luxury-rose/20 rounded-full blur-2xl animate-float"
      style={{ animationDelay: "2s" }}
    />
    <div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-luxury-premium/10 rounded-full blur-2xl animate-float"
      style={{ animationDelay: "4s" }}
    />
  </div>

  <div className="relative container mx-auto px-4 py-10 md:py-16">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Content */}
        <motion.div
          className="text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Crown className="h-3 w-3 text-luxury-gold" />
            <span className="text-xs font-semibold">Collection Premium</span>
            <Sparkles className="h-3 w-3 text-luxury-gold" />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-2xl md:text-4xl font-playfair font-bold mb-3 leading-snug"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            L'Élégance
            <span className="block bg-luxury-gradient bg-clip-text text-transparent animate-gradient">
              Redéfinie
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-base md:text-lg text-white/80 mb-4 max-w-md mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Découvrez notre collection exclusive de perruques et accessoires
            haut de gamme
          </motion.p>

          {/* Features */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-luxury-gold" />
              <span className="text-xs">Qualité Premium</span>
            </div>
            <div className="flex items-center space-x-1">
              <Crown className="h-4 w-4 text-luxury-gold" />
              <span className="text-xs">Design Exclusif</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="h-4 w-4 text-luxury-gold" />
              <span className="text-xs">Finition Luxe</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link to="/tous-les-produits">
              <LuxuryButton size="sm" className="group">
                Découvrir la Collection
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </LuxuryButton>
            </Link>
            <Link to="/nouveautes">
              <LuxuryButton
                variant="outline"
                size="sm"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-luxury-deep"
              >
                Nouveautés
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </LuxuryButton>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="text-center">
              <div className="text-lg font-bold text-luxury-gold">10K+</div>
              <div className="text-xs text-white/70">Clientes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-luxury-gold">500+</div>
              <div className="text-xs text-white/70">Produits</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-luxury-gold">5★</div>
              <div className="text-xs text-white/70">Note</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Visual */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative">
            {/* Main Image Placeholder */}
            <div className="aspect-square bg-gradient-to-br from-luxury-gold/20 to-luxury-rose/20 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <div className="text-center">
                <Crown className="h-12 w-12 text-luxury-gold mx-auto mb-2 animate-float" />
                <p className="text-white/80 text-sm font-semibold">
                  Collection Premium
                </p>
                <p className="text-white/60 text-xs">Perruques & Accessoires</p>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-2 -right-2 bg-luxury-gradient p-2 rounded-xl shadow-glow-rose"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-4 w-4 text-white" />
            </motion.div>

            <motion.div
              className="absolute -bottom-2 -left-2 bg-white/10 backdrop-blur-sm p-2 rounded-xl border border-white/20"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Star className="h-4 w-4 text-luxury-gold" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  </div>

  {/* Bottom Wave */}
  <div className="absolute bottom-0 left-0 right-0">
    <svg
      viewBox="0 0 1200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 120L50 110C100 100 200 80 300 70C400 60 500 60 600 65C700 70 800 80 900 85C1000 90 1100 90 1150 90L1200 90V120H1150C1100 120 1000 120 900 120C800 120 700 120 600 120C500 120 400 120 300 120C200 120 100 120 50 120H0Z"
        fill="hsl(0, 0%, 100%)"
      />
    </svg>
  </div>
</section>

  );
};

export default LuxuryHeroSection;
