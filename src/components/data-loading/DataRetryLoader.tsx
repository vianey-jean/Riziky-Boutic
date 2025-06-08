
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface DataRetryLoaderProps<T> {
  fetchFunction: () => Promise<T>;
  onSuccess: (data: T) => void;
  onMaxRetriesReached?: () => void;
  maxRetries?: number;
  retryInterval?: number;
  loadingComponent?: React.ReactNode;
  errorMessage?: string;
  children?: React.ReactNode;
  loadingVariant?: 'default' | 'boutique' | 'elegant' | 'premium';
  loadingMessage?: string;
  loadingSubmessage?: string;
}

export function DataRetryLoader<T>({
  fetchFunction,
  onSuccess,
  onMaxRetriesReached,
  maxRetries = 6,
  retryInterval = 5000,
  loadingComponent,
  errorMessage = "Erreur de chargement des données",
  children,
  loadingVariant = 'boutique',
  loadingMessage = "Chargement de votre boutique...",
  loadingSubmessage = "Connexion au serveur en cours..."
}: DataRetryLoaderProps<T>) {
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  const attemptDataFetch = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const data = await fetchFunction();
      onSuccess(data);
      setIsLoading(false);
      setRetryCount(0);
    } catch (error) {
      console.error(`Tentative ${retryCount + 1} échouée:`, error);
      
      if (retryCount < maxRetries - 1) {
        setRetryCount(prev => prev + 1);
        setTimeout(attemptDataFetch, retryInterval);
      } else {
        setIsLoading(false);
        setHasError(true);
        toast({
          variant: "destructive",
          title: errorMessage,
          description: `Impossible de charger les données après ${maxRetries} tentatives.`,
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRetryCount(0);
                setHasError(false);
                attemptDataFetch();
              }}
            >
              Réessayer
            </Button>
          )
        });
        onMaxRetriesReached?.();
      }
    }
  };

  useEffect(() => {
    attemptDataFetch();
  }, []);

  const handleManualRetry = () => {
    setRetryCount(0);
    setHasError(false);
    attemptDataFetch();
  };

  if (isLoading) {
    return (
      loadingComponent || (
        <LoadingSpinner
          variant={loadingVariant}
          size="lg"
          message={`${loadingMessage} ${retryCount > 0 ? `(Tentative ${retryCount + 1}/${maxRetries})` : ''}`}
          submessage={loadingSubmessage}
        />
      )
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20 max-w-md">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-red-800 dark:text-red-200">{errorMessage}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRetry}
              className="ml-4 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}

export default DataRetryLoader;
