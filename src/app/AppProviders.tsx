
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { StoreProvider } from '@/contexts/StoreContext';
import { Toaster } from '@/components/ui/sonner';

interface AppProvidersProps {
  children: React.ReactNode;
}

// Création d'un nouveau QueryClient avec configuration optimisée
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60000,
      gcTime: 5 * 60 * 1000,
    },
  },
});

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StoreProvider>
          {children}
          <Toaster closeButton richColors position="top-center" />
        </StoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
