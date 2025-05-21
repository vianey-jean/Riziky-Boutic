
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
import { productsAPI } from '@/services/api';
import { Product } from '@/contexts/StoreContext';
import { Skeleton } from "@/components/ui/skeleton";

interface LayoutProps {
  children: React.ReactNode;
  hidePrompts?: boolean;
}

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
              <CarouselItem className="basis-full flex justify-center items-center text-center text-sm">
                <ThumbsUp className="h-4 w-4 mr-2" /> Livraison gratuite à partir de 50€ d'achat
              </CarouselItem>
              <CarouselItem className="basis-full flex justify-center items-center text-center text-sm">
                <Gift className="h-4 w-4 mr-2" /> -10% sur votre première commande avec le code WELCOME10
              </CarouselItem>
              <CarouselItem className="basis-full flex justify-center items-center text-center text-sm">
                <Clock className="h-4 w-4 mr-2" /> Satisfait ou remboursé sous 30 jours
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>


      </header>
      
      <main className="flex-grow" role="main">
        {children}
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
