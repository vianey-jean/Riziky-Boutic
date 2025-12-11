/**
 * @fileoverview Composant d'affichage pour panier vide ou utilisateur non connecté
 * 
 * Ce composant affiche un message moderne et animé lorsque le panier est vide
 * ou lorsque l'utilisateur n'est pas connecté.
 * 
 * @version 2.0.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ShoppingCart, Heart, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyCartMessageProps {
  isAuthenticated: boolean;
}

/**
 * Affiche un message stylisé pour le panier vide
 */
const EmptyCartMessage: React.FC<EmptyCartMessageProps> = ({ isAuthenticated }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { duration: 0.5, ease: "backOut", delay: 0.2 }
    }
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  };

  // Non connecté
  if (!isAuthenticated) {
    return (
      <motion.div 
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border border-blue-200/50 dark:border-blue-800/50 shadow-xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative py-16 px-8 text-center">
          {/* Icon animé */}
          <motion.div 
            className="mb-8"
            variants={iconVariants}
          >
            <motion.div 
              className="relative inline-flex"
              animate={floatingAnimation}
            >
              <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-6 rounded-3xl shadow-2xl">
                <Lock className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-full shadow-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </motion.div>
          </motion.div>

          {/* Titre */}
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Connectez-vous pour voir votre panier
          </motion.h2>

          {/* Description */}
          <motion.p 
            className="text-neutral-600 dark:text-neutral-300 mb-8 max-w-lg mx-auto text-lg leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Accédez à votre panier personnalisé et profitez d'une expérience shopping unique avec des offres exclusives
          </motion.p>

          {/* Features */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
              <Heart className="h-4 w-4 text-rose-500" />
              <span>Sauvegardez vos favoris</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
              <ShoppingCart className="h-4 w-4 text-blue-500" />
              <span>Panier synchronisé</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>Offres exclusives</span>
            </div>
          </motion.div>

          {/* Boutons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl px-8 py-6 h-auto text-lg font-semibold"
            >
              <Link to="/login" className="flex items-center gap-2">
                Se connecter
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline"
              size="lg"
              className="border-2 border-neutral-300 dark:border-neutral-600 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl px-8 py-6 h-auto text-lg font-semibold transition-all duration-300"
            >
              <Link to="/inscription">Créer un compte</Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Panier vide (utilisateur connecté)
  return (
    <motion.div 
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 border border-emerald-200/50 dark:border-emerald-800/50 shadow-xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl" />
        {/* Floating elements */}
        <motion.div 
          className="absolute top-20 left-20 opacity-20"
          animate={{ y: [-5, 5, -5], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <ShoppingBag className="h-12 w-12 text-emerald-500" />
        </motion.div>
        <motion.div 
          className="absolute bottom-20 right-20 opacity-20"
          animate={{ y: [5, -5, 5], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <ShoppingCart className="h-16 w-16 text-teal-500" />
        </motion.div>
      </div>

      <div className="relative py-16 px-8 text-center">
        {/* Icon animé */}
        <motion.div 
          className="mb-8"
          variants={iconVariants}
        >
          <motion.div 
            className="relative inline-flex"
            animate={floatingAnimation}
          >
            <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-6 rounded-3xl shadow-2xl">
              <ShoppingBag className="h-12 w-12 text-white" />
            </div>
            <motion.div 
              className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-full shadow-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-4 w-4 text-white" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Titre */}
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Votre panier est vide
        </motion.h2>

        {/* Description */}
        <motion.p 
          className="text-neutral-600 dark:text-neutral-300 mb-8 max-w-lg mx-auto text-lg leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Découvrez notre collection exceptionnelle et ajoutez vos produits préférés pour commencer votre shopping
        </motion.p>

        {/* Suggestions */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white/60 dark:bg-neutral-900/40 rounded-2xl p-4 border border-emerald-200/50 dark:border-emerald-800/50">
            <Sparkles className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Nouveautés</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Derniers arrivages</p>
          </div>
          <div className="bg-white/60 dark:bg-neutral-900/40 rounded-2xl p-4 border border-teal-200/50 dark:border-teal-800/50">
            <Heart className="h-8 w-8 text-rose-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Populaires</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Les plus aimés</p>
          </div>
          <div className="bg-white/60 dark:bg-neutral-900/40 rounded-2xl p-4 border border-cyan-200/50 dark:border-cyan-800/50">
            <ShoppingBag className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Promotions</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Offres spéciales</p>
          </div>
        </motion.div>

        {/* Bouton */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button 
            asChild 
            size="lg"
            className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl px-10 py-6 h-auto text-lg font-semibold"
          >
            <Link to="/" className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Découvrir nos produits
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmptyCartMessage;
