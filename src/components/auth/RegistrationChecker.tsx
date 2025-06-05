
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RegistrationCheckerProps {
  children: React.ReactNode;
}

const RegistrationChecker: React.FC<RegistrationCheckerProps> = ({ children }) => {
  const [registrationAllowed, setRegistrationAllowed] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkRegistrationStatus();
  }, []);

  const checkRegistrationStatus = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public-settings/general`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Paramètres inscription récupérés:', data);
        setRegistrationAllowed(data?.allowRegistration || false);
      } else {
        console.error('Erreur API paramètres inscription:', response.status);
        setRegistrationAllowed(true); // Par défaut, autoriser les inscriptions
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des inscriptions:', error);
      setRegistrationAllowed(true); // Par défaut, autoriser les inscriptions
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div>Chargement...</div>
      </div>
    );
  }

  if (!registrationAllowed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              Inscriptions Fermées
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Alert>
              <AlertDescription>
                Les nouvelles inscriptions sont actuellement fermées. 
                Veuillez contacter l'administrateur pour plus d'informations.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default RegistrationChecker;
