
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import PromoBanner from './PromoBanner';
import BenefitsSection from './BenefitsSection';
import PaymentBadges from './PaymentBadges';
import SecurityInfo from './SecurityInfo';
import LayoutPrompts from './LayoutPrompts';
import ClientServiceChatWidget from '@/components/chat/ClientServiceChatWidget';
import AdminServiceChatWidget from '@/components/chat/AdminServiceChatWidget';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/contexts/StoreContext';
import { productsAPI } from '@/services/api';
import pubLayoutAPI, { PubLayout } from '@/services/pubLayoutAPI';
import { useScrollDetection } from '@/hooks/useScrollDetection';

interface LayoutProps {
  children: React.ReactNode;
  hidePrompts?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hidePrompts = false }) => {
  const { data: trendingProducts } = useQuery({
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
    enabled: !hidePrompts,
    staleTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const { data: pubLayoutItems = [], isLoading: isLoadingPubLayout } = useQuery({
    queryKey: ['pub-layout'],
    queryFn: async (): Promise<PubLayout[]> => {
      try {
        return await pubLayoutAPI.getAll();
      } catch (error) {
        console.error('Erreur lors du chargement des publicités:', error);
        return [
          { id: "1", icon: "ThumbsUp", text: "Livraison gratuite à partir de 50€ d'achat" },
          { id: "2", icon: "Gift", text: "-10% sur votre première commande avec le code WELCOME10" },
          { id: "3", icon: "Clock", text: "Satisfait ou remboursé sous 30 jours" }
        ];
      }
    },
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  const hasScrolled = useScrollDetection(200, hidePrompts);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="sticky top-0 z-50">
        <Navbar />
        <PromoBanner pubLayoutItems={pubLayoutItems} isLoading={isLoadingPubLayout} />
      </header>
      
      <main className="flex-grow" role="main">
        {children}
        <BenefitsSection hidePrompts={hidePrompts} />
        <PaymentBadges hidePrompts={hidePrompts} />
      </main>
      
      <SecurityInfo />
      <Footer />
      
      <LayoutPrompts 
        hidePrompts={hidePrompts}
        trendingProducts={trendingProducts}
        hasScrolled={hasScrolled}
      />

      <ClientServiceChatWidget />
      <AdminServiceChatWidget />
      <ScrollToTop />
    </div>
  );
};

export default Layout;
