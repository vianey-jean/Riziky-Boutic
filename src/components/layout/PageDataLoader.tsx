
import React from 'react';
import DataRetryLoader from '@/components/data-loading/DataRetryLoader';

interface PageDataLoaderProps {
  fetchFunction: () => Promise<any>;
  onSuccess: (data: any) => void;
  onMaxRetriesReached?: () => void;
  loadingMessage?: string;
  loadingSubmessage?: string;
  errorMessage?: string;
  children?: React.ReactNode;
}

const PageDataLoader: React.FC<PageDataLoaderProps> = ({
  fetchFunction,
  onSuccess,
  onMaxRetriesReached,
  loadingMessage = "Chargement de votre boutique...",
  loadingSubmessage = "Préparation de votre expérience shopping premium...",
  errorMessage = "Erreur de chargement des données",
  children
}) => {
  return (
    <DataRetryLoader
      fetchFunction={fetchFunction}
      onSuccess={onSuccess}
      onMaxRetriesReached={onMaxRetriesReached}
      maxRetries={6}
      retryInterval={5000}
      errorMessage={errorMessage}
      loadingVariant="boutique"
      loadingMessage={loadingMessage}
      loadingSubmessage={loadingSubmessage}
    >
      {children}
    </DataRetryLoader>
  );
};

export default PageDataLoader;
