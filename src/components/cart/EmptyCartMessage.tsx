
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Sparkles, Shield, Gift, ArrowRight } from 'lucide-react';

interface EmptyCartMessageProps {
  isAuthenticated: boolean;
}

const EmptyCartMessage: React.FC<EmptyCartMessageProps> = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return (
      <div className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 rounded-3xl" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
        
        <div className="relative text-center py-20 px-8 rounded-3xl border border-white/50 dark:border-neutral-700/50 backdrop-blur-sm">
          {/* Icon with luxury styling */}
          <div className="mb-8 relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-xl opacity-40 animate-pulse" />
            <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-3xl shadow-2xl">
              <ShoppingBag className="h-14 w-14 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 p-2 rounded-full shadow-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Connectez-vous pour voir votre panier
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
            Accédez à votre panier personnalisé et profitez d'une expérience d'achat exclusive
          </p>
          
          <Button 
            asChild 
            size="lg"
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-10 py-6 text-lg rounded-2xl group"
          >
            <Link to="/login" className="flex items-center gap-3">
              Se connecter
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          
          {/* Trust badges */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-purple-500" />
              <span>Offres exclusives</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-violet-950/30 rounded-3xl" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-56 h-56 bg-gradient-to-tr from-violet-400/20 to-purple-400/20 rounded-full blur-3xl" />
      
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0s' }} />
      <div className="absolute top-32 right-32 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-24 left-1/3 w-4 h-4 bg-indigo-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1s' }} />
      
      <div className="relative text-center py-20 px-8 rounded-3xl border border-white/50 dark:border-neutral-700/50 backdrop-blur-sm">
        {/* Icon with luxury styling */}
        <div className="mb-8 relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur-xl opacity-40 animate-pulse" />
          <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 p-6 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <ShoppingBag className="h-14 w-14 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 p-2 rounded-full shadow-lg animate-pulse">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Votre panier est vide
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
          Découvrez notre collection exclusive et ajoutez vos coups de cœur à votre panier
        </p>
        
        <Button 
          asChild 
          size="lg"
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-10 py-6 text-lg rounded-2xl group"
        >
          <Link to="/" className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5" />
            Découvrir nos produits
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
        
        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-xl">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Livraison offerte</span>
            <span className="text-xs text-neutral-500">dès 50€ d'achat</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Paiement sécurisé</span>
            <span className="text-xs text-neutral-500">100% protégé</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
              <Gift className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Retour gratuit</span>
            <span className="text-xs text-neutral-500">sous 30 jours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyCartMessage;
