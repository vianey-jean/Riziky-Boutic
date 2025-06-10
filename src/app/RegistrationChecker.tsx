
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import RegisterBlockPage from '@/pages/RegisterBlockPage';
import LoadingFallback from './LoadingFallback';

interface RegistrationCheckerProps {
  children: React.ReactNode;
}

const RegistrationChecker: React.FC<RegistrationCheckerProps> = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const { data: siteSettings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/api/site-settings`);
      return response.data;
    },
  });

  if (isLoading) {
    return <LoadingFallback />;
  }

  const isRegistrationEnabled = siteSettings?.system?.registrationEnabled;
  
  if (!isRegistrationEnabled) {
    return <RegisterBlockPage />;
  }

  return <>{children}</>;
};

export default RegistrationChecker;
