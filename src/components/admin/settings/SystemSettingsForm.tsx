
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { SystemSettings } from '@/types/siteSettings';
import { Settings } from 'lucide-react';

interface SystemSettingsFormProps {
  settings: SystemSettings;
  onSave: (data: SystemSettings) => void;
  loading?: boolean;
}

const SystemSettingsForm: React.FC<SystemSettingsFormProps> = ({ 
  settings, 
  onSave, 
  loading = false 
}) => {
  const { register, handleSubmit, setValue, watch } = useForm<SystemSettings>({
    defaultValues: settings
  });

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-gray-50 to-slate-100">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-gray-500 to-slate-600 p-3 rounded-xl shadow-lg">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-gray-700 to-slate-800 bg-clip-text text-transparent">
              Paramètres Système
            </CardTitle>
            <CardDescription className="text-gray-600">
              Gestion des accès et maintenance du site
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Autoriser les inscriptions</Label>
                <p className="text-sm text-gray-600">Permettre aux nouveaux utilisateurs de s'inscrire</p>
              </div>
              <Switch 
                checked={watch('registrationEnabled')}
                onCheckedChange={(checked) => setValue('registrationEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mode maintenance</Label>
                <p className="text-sm text-gray-600">Activer le mode maintenance pour tous les visiteurs</p>
              </div>
              <Switch 
                checked={watch('maintenanceMode')}
                onCheckedChange={(checked) => setValue('maintenanceMode', checked)}
              />
            </div>

            {watch('maintenanceMode') && (
              <div className="space-y-2">
                <Label htmlFor="maintenanceMessage">Message de maintenance</Label>
                <Textarea 
                  id="maintenanceMessage"
                  {...register('maintenanceMessage')} 
                  placeholder="Site en maintenance. Nous serons de retour très bientôt !"
                  className="border-gray-200 focus:border-gray-500"
                  rows={4}
                />
              </div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="text-amber-800 font-medium mb-2">⚠️ Attention</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Le blocage des inscriptions empêchera les nouveaux utilisateurs de créer un compte</li>
              <li>• Le mode maintenance redirigera tous les visiteurs vers une page de maintenance</li>
              <li>• Les administrateurs pourront toujours accéder au site même en mode maintenance</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700 text-white shadow-lg"
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder les paramètres système'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SystemSettingsForm;
