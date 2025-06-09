
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { NotificationSettings } from '@/types/siteSettings';
import { Bell } from 'lucide-react';

interface NotificationSettingsFormProps {
  settings: NotificationSettings;
  onSave: (data: NotificationSettings) => void;
  loading?: boolean;
}

const NotificationSettingsForm: React.FC<NotificationSettingsFormProps> = ({ 
  settings, 
  onSave, 
  loading = false 
}) => {
  const { handleSubmit, setValue, watch } = useForm<NotificationSettings>({
    defaultValues: settings
  });

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-red-100">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl shadow-lg">
            <Bell className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-orange-700 to-red-800 bg-clip-text text-transparent">
              Notifications
            </CardTitle>
            <CardDescription className="text-orange-600">
              Gestion des notifications et alertes
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications par email</Label>
                <p className="text-sm text-orange-600">Activer l'envoi d'emails de notification</p>
              </div>
              <Switch 
                checked={watch('enableEmailNotifications')}
                onCheckedChange={(checked) => setValue('enableEmailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Confirmation de commande</Label>
                <p className="text-sm text-orange-600">Envoyer un email de confirmation de commande</p>
              </div>
              <Switch 
                checked={watch('enableOrderConfirmation')}
                onCheckedChange={(checked) => setValue('enableOrderConfirmation', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications d'expédition</Label>
                <p className="text-sm text-orange-600">Notifier l'expédition des commandes</p>
              </div>
              <Switch 
                checked={watch('enableShippingNotifications')}
                onCheckedChange={(checked) => setValue('enableShippingNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Emails promotionnels</Label>
                <p className="text-sm text-orange-600">Envoyer des offres et promotions</p>
              </div>
              <Switch 
                checked={watch('enablePromotionalEmails')}
                onCheckedChange={(checked) => setValue('enablePromotionalEmails', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications SMS</Label>
                <p className="text-sm text-orange-600">Envoyer des SMS de notification</p>
              </div>
              <Switch 
                checked={watch('enableSmsNotifications')}
                onCheckedChange={(checked) => setValue('enableSmsNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications push</Label>
                <p className="text-sm text-orange-600">Notifications push dans le navigateur</p>
              </div>
              <Switch 
                checked={watch('enablePushNotifications')}
                onCheckedChange={(checked) => setValue('enablePushNotifications', checked)}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg"
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder les paramètres de notification'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NotificationSettingsForm;
