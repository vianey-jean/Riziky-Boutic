
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Shield } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </header>
      <main className="container mx-auto px-4 py-6 flex-grow" role="main">
        {children}
      </main>
      <div className="bg-gray-50 py-4 border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-gray-600">
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
    </div>
  );
};

export default Layout;
