
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, Wrench, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const MaintenancePage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { data: siteSettings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/api/site-settings`);
      return response.data;
    },
  });

  const maintenanceMessage = siteSettings?.system?.maintenanceMessage || "Site en maintenance. Nous serons de retour très bientôt !";

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-red-950/20 dark:via-neutral-950 dark:to-red-950/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border-0 shadow-2xl">
        <CardContent className="p-12 text-center">
          {/* Logo et icône */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-600 to-red-700 rounded-3xl shadow-2xl mb-6">
              <ShoppingBag className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Riziky Boutique
            </h1>
          </div>

          {/* Icône de maintenance */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg mb-6">
              <Wrench className="h-10 w-10 text-white animate-spin" />
            </div>
            <div className="flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400 mb-4">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">Mode Maintenance</span>
            </div>
          </div>

          {/* Message de maintenance */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Maintenance en cours
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              {maintenanceMessage}
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
                <Mail className="h-5 w-5" />
                <span className="font-semibold">Nous travaillons pour vous</span>
              </div>
              <p className="text-blue-600 dark:text-blue-400 text-sm">
                Notre équipe met tout en œuvre pour améliorer votre expérience shopping. 
                Nous serons de retour très prochainement avec de nouvelles fonctionnalités !
              </p>
            </div>
          </div>

          {/* Lien administrateur */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link to="/maintenance-login">
              <Button 
                variant="link" 
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold text-sm"
              >
                🔑 Login Administrateur
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenancePage;
