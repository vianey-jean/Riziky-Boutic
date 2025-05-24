
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface DataRetryLoaderProps<T> {
  fetchFunction: () => Promise<T>;
  onSuccess: (data: T) => void;
  onMaxRetriesReached?: () => void;
  maxRetries?: number;
  retryInterval?: number;
  loadingComponent?: React.ReactNode;
  errorMessage?: string;
  children?: React.ReactNode;
}

export function DataRetryLoader<T>({
  fetchFunction,
  onSuccess,
  onMaxRetriesReached,
  maxRetries = 6,
  retryInterval = 5000,
  loadingComponent,
  errorMessage = "Erreur de chargement des données",
  children
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
      <div className="flex flex-col items-center justify-center p-8">
        {loadingComponent || (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
            <p className="text-gray-600">
              Chargement des données... {retryCount > 0 && `(Tentative ${retryCount + 1}/${maxRetries})`}
            </p>
          </>
        )}
      </div>
    );
  }

  if (hasError) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="flex items-center justify-between">
          <span>{errorMessage}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRetry}
            className="ml-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}

export default DataRetryLoader;
