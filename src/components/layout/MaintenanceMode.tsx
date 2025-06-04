
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { settingsAPI } from '@/services/settingsAPI';
import { useAuth } from '@/contexts/AuthContext';
import { Wrench, Clock, Mail, Phone, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const MaintenanceMode: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAdminAccess, setShowAdminAccess] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsAPI.getSettings,
    staleTime: 10000, // Vérifier plus fréquemment (10 secondes)
    refetchInterval: 30000, // Actualiser toutes les 30 secondes
    retry: false,
  });

  // Si l'utilisateur est admin, laisser passer
  if (user && user.role === 'admin') {
    return <>{children}</>;
  }

  // Si le mode maintenance est activé, afficher la page de maintenance
  if (settings?.general?.maintenanceMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Wrench className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {settings.general.siteName || 'Riziky-Boutic'}
            </h1>
            <div className="w-12 h-1 bg-blue-600 mx-auto mb-4"></div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Site en maintenance
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {settings.general.maintenanceMessage || 
               'Notre site est actuellement en maintenance. Nous travaillons pour améliorer votre expérience et reviendrons bientôt avec de nouvelles fonctionnalités !'}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-2" />
              Nous reviendrons très prochainement
            </div>
          </div>

          {/* Accès administrateur */}
          <div className="mb-6">
            {!showAdminAccess ? (
              <Button 
                variant="outline" 
                onClick={() => setShowAdminAccess(true)}
                className="text-sm"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Accès administrateur
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Connexion administrateur disponible</p>
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Se connecter en tant qu'admin
                </Button>
              </div>
            )}
          </div>

          <div className="border-t pt-6 space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Besoin d'aide ? Contactez-nous :
            </p>
            <div className="space-y-2">
              {settings.general.contactEmail && (
                <div className="flex items-center justify-center text-sm text-blue-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href={`mailto:${settings.general.contactEmail}`} className="hover:underline">
                    {settings.general.contactEmail}
                  </a>
                </div>
              )}
              {settings.general.supportPhone && (
                <div className="flex items-center justify-center text-sm text-blue-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <a href={`tel:${settings.general.supportPhone}`} className="hover:underline">
                    {settings.general.supportPhone}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-center space-x-1 text-xs text-gray-400">
              <span>Powered by</span>
              <span className="font-semibold">Riziky-Boutic</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sinon, afficher le contenu normal
  return <>{children}</>;
};

export default MaintenanceMode;
