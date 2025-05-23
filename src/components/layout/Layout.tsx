import React, { useState, useEffect, Suspense } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Shield, Award, Clock, CreditCard, TrendingUp, Gift, ThumbsUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import CookieConsent from '../prompts/CookieConsent';
import WelcomePrompt from '../prompts/WelcomePrompt';
import TrendingProductsPrompt from '../prompts/TrendingProductsPrompt';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { productsAPI } from '@/services/api';
import { Product } from '@/contexts/StoreContext';
import { Skeleton } from "@/components/ui/skeleton";
import visa from "@/assets/visa.png"; 
import applepay from "@/assets/applepay.png"; 
import mastercard from "@/assets/mastercard.png"; 
import american from "@/assets/american.png"; 
import paypal from "@/assets/paypal.png"; 
import { DynamicIcon } from '@/utils/iconLoader';
import pubLayoutAPI, { PubLayout } from '@/services/pubLayoutAPI';

interface LayoutProps {
  children: React.ReactNode;
  hidePrompts?: boolean;
}

  // Avantages du site e-commerce
  const benefits = [
    { icon: Shield, text: "Paiements sécurisés", description: "Toutes vos transactions sont protégées" },
    { icon: Clock, text: "Livraison rapide", description: "Expédition sous 24-48h" },
    { icon: Award, text: "Qualité garantie", description: "Des produits sélectionnés avec soin" },
    { icon: CreditCard, text: "Paiement facile", description: "Plusieurs méthodes de paiement" },
    { icon: TrendingUp, text: "Top tendances", description: "Produits à la mode" },
    { icon: Gift, text: "Offres exclusives", description: "Promotions régulières" },
  ];

    // Animation pour les éléments
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };


// Lazy-loaded TrendingProductsPrompt pour améliorer les performances
const LazyTrendingPrompt = React.lazy(() => import('../prompts/TrendingProductsPrompt'));

const Layout: React.FC<LayoutProps> = ({ children, hidePrompts = false }) => {
  // Charger les produits populaires pour le prompt avec optimisation et gestion d'erreur
  const { data: trendingProducts, error: trendingError } = useQuery({
    queryKey: ['trending-products'],
    queryFn: async (): Promise<Product[]> => {
      try {
        const response = await productsAPI.getMostFavorited();
        return response.data || [];
      } catch (error) {
        console.error('Erreur lors du chargement des produits populaires:', error);
        return [];
      }
    },
    enabled: !hidePrompts, // Ne pas charger si les prompts sont désactivés
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2, // Réessayer 2 fois en cas d'échec
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });

  // Charger les publicités depuis l'API avec refetch interval pour avoir les données en temps réel
  const { data: pubLayoutItems = [], isLoading: isLoadingPubLayout } = useQuery({
    queryKey: ['pub-layout'],
    queryFn: async (): Promise<PubLayout[]> => {
      try {
        return await pubLayoutAPI.getAll();
      } catch (error) {
        console.error('Erreur lors du chargement des publicités:', error);
        // Valeurs par défaut si l'API échoue
        return [
          { id: "1", icon: "ThumbsUp", text: "Livraison gratuite à partir de 50€ d'achat" },
          { id: "2", icon: "Gift", text: "-10% sur votre première commande avec le code WELCOME10" },
          { id: "3", icon: "Clock", text: "Satisfait ou remboursé sous 30 jours" }
        ];
      }
    },
    staleTime: 30 * 1000, // 30 secondes - données considérées fraîches pendant 30s
    refetchInterval: 30 * 1000, // Rafraîchir toutes les 30 secondes pour avoir des données en temps réel
    refetchOnWindowFocus: true, // Rafraîchir quand la fenêtre reprend le focus
  });

  // État pour suivre si l'utilisateur a scrollé
  const [hasScrolled, setHasScrolled] = useState(false);

  // Détecter le défilement pour afficher/masquer certains éléments
  useEffect(() => {
    if (hidePrompts) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHasScrolled(scrollPosition > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hidePrompts]);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="sticky top-0 z-50">
        <Navbar />

        {/* Barre d'annonces promotionnelles rotatives */}
        <div className="bg-red-600 text-white py-1.5 overflow-hidden">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            autoPlay={true}
            interval={5000}
            className="w-full"
          >
            <CarouselContent className="mx-auto">
              {isLoadingPubLayout ? (
                <CarouselItem className="basis-full flex justify-center items-center">
                  <Skeleton className="h-4 w-60" />
                </CarouselItem>
              ) : (
                pubLayoutItems.map((pub) => (
                  <CarouselItem key={pub.id} className="basis-full flex justify-center items-center text-center text-sm">
                    <DynamicIcon name={pub.icon} className="h-4 w-4 mr-2" /> {pub.text}
                  </CarouselItem>
                ))
              )}
            </CarouselContent>
          </Carousel>
        </div>

      </header>
      
      <main className="flex-grow" role="main">
        {children}

        {/*Bannière d'avantages, visible uniquement si on n'est pas sur une route avec hidePrompts */} 
        {!hidePrompts && (
          <motion.section 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="bg-white dark:bg-neutral-900 py-12 border-t border-neutral-200 dark:border-neutral-800"
          >
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                Pourquoi choisir <span className="text-red-600">Riziky Boutique</span> ?
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="text-center p-4"
                  >
                    <div className="bg-red-50 dark:bg-red-900/20 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                      <benefit.icon className="h-7 w-7 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="font-medium mb-1">{benefit.text}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Badges de confiance */}
        {!hidePrompts && (
          <div className="bg-white dark:bg-neutral-900 py-6 border-t border-b border-neutral-200 dark:border-neutral-800">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap items-center justify-center gap-8">
                <img src={visa} alt="Visa" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
                <img src={mastercard} alt="Mastercard" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
                <img src={american} alt="American Express" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
                <img src={paypal} alt="PayPal" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
                <img src={applepay} alt="Apple Pay" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        )}
      </main>
      
      <div className="bg-white dark:bg-neutral-900 py-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Shield className="h-5 w-5 text-green-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Site sécurisé avec protection contre les attaques XSS, injections et force brute.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span>Site sécurisé</span>
          </div>
          <div>Paiements sécurisés et cryptés</div>
          <div>Protection des données personnelles</div>
        </div>
      </div>
      
      <Footer />
      
      {/* Prompts et notifications - chargés de façon optimisée */}
      {!hidePrompts && (
        <>
          <CookieConsent />
          <WelcomePrompt />
          {trendingProducts && trendingProducts.length > 0 && hasScrolled && (
            <Suspense fallback={null}>
              <LazyTrendingPrompt products={trendingProducts} />
            </Suspense>
          )}
        </>
      )}
    </div>
  );
};

export default Layout;
