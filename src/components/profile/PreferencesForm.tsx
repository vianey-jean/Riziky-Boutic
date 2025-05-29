import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import { API } from '@/services/api';

interface UserPreferences {
  emailNotifications: boolean;
  marketingEmails: boolean;
  productUpdates: boolean;
  orderStatusUpdates: boolean;
}

const PreferencesForm: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    emailNotifications: true,
    marketingEmails: false,
    productUpdates: true,
    orderStatusUpdates: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Charger les préférences existantes depuis la base de données si l'utilisateur est connecté
    const loadPreferences = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const response = await API.get(`/users/${user.id}/preferences`);
        if (response.data) {
          setPreferences(response.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des préférences:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPreferences();
  }, [user]);

  const handleCheckboxChange = (key: keyof UserPreferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePreferences = async () => {
    if (!user?.id) {
      toast.error("Vous devez être connecté pour enregistrer vos préférences");
      return;
    }
    
    setLoading(true);
    try {
      await API.post(`/users/${user.id}/preferences`, preferences);
      toast.success('Préférences enregistrées avec succès');
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des préférences:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement des préférences");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences</CardTitle>
        <CardDescription>Gérez vos préférences et notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="emailNotifications" 
              checked={preferences.emailNotifications}
              onCheckedChange={() => handleCheckboxChange('emailNotifications')}
            />
            <Label htmlFor="emailNotifications">Recevoir des notifications par email</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="marketingEmails" 
              checked={preferences.marketingEmails}
              onCheckedChange={() => handleCheckboxChange('marketingEmails')}
            />
            <Label htmlFor="marketingEmails">Recevoir des emails marketing</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="productUpdates" 
              checked={preferences.productUpdates}
              onCheckedChange={() => handleCheckboxChange('productUpdates')}
            />
            <Label htmlFor="productUpdates">Mises à jour des produits</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="orderStatusUpdates" 
              checked={preferences.orderStatusUpdates}
              onCheckedChange={() => handleCheckboxChange('orderStatusUpdates')}
            />
            <Label htmlFor="orderStatusUpdates">Mises à jour du statut des commandes</Label>
          </div>
          
          <Button 
            onClick={handleSavePreferences} 
            className="mt-4"
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer les préférences'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesForm;
