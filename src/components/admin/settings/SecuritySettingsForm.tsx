
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SecuritySettings } from '@/types/siteSettings';
import { Shield } from 'lucide-react';

interface SecuritySettingsFormProps {
  settings: SecuritySettings;
  onSave: (data: SecuritySettings) => void;
  loading?: boolean;
}

const SecuritySettingsForm: React.FC<SecuritySettingsFormProps> = ({ 
  settings, 
  onSave, 
  loading = false 
}) => {
  const { register, handleSubmit, setValue, watch } = useForm<SecuritySettings>({
    defaultValues: settings
  });

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-red-50 to-pink-100">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-xl shadow-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-red-700 to-pink-800 bg-clip-text text-transparent">
              Sécurité
            </CardTitle>
            <CardDescription className="text-red-600">
              Protection et authentification
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Forcer HTTPS/SSL</Label>
                <p className="text-sm text-red-600">Rediriger automatiquement vers HTTPS</p>
              </div>
              <Switch 
                checked={watch('enableSSL')}
                onCheckedChange={(checked) => setValue('enableSSL', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Activer CAPTCHA</Label>
                <p className="text-sm text-red-600">Protéger contre les bots avec reCAPTCHA</p>
              </div>
              <Switch 
                checked={watch('enableCaptcha')}
                onCheckedChange={(checked) => setValue('enableCaptcha', checked)}
              />
            </div>

            {watch('enableCaptcha') && (
              <div className="space-y-2">
                <Label htmlFor="captchaSiteKey">Clé publique reCAPTCHA</Label>
                <Input 
                  id="captchaSiteKey"
                  {...register('captchaSiteKey')} 
                  placeholder="6Lc6BAAAAAAAAChqRbQZcn_yyyyyyyyyyyyyyyyy"
                  className="border-red-200 focus:border-red-500"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Authentification à deux facteurs</Label>
                <p className="text-sm text-red-600">Activer 2FA pour les comptes admin</p>
              </div>
              <Switch 
                checked={watch('enableTwoFactorAuth')}
                onCheckedChange={(checked) => setValue('enableTwoFactorAuth', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Limiter les tentatives de connexion</Label>
                <p className="text-sm text-red-600">Bloquer après plusieurs échecs</p>
              </div>
              <Switch 
                checked={watch('enableLoginAttemptLimit')}
                onCheckedChange={(checked) => setValue('enableLoginAttemptLimit', checked)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Timeout de session (heures)</Label>
              <Input 
                id="sessionTimeout"
                type="number"
                {...register('sessionTimeout', { valueAsNumber: true })} 
                placeholder="24"
                className="border-red-200 focus:border-red-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordMinLength">Longueur minimale mot de passe</Label>
              <Input 
                id="passwordMinLength"
                type="number"
                {...register('passwordMinLength', { valueAsNumber: true })} 
                placeholder="8"
                className="border-red-200 focus:border-red-500"
              />
            </div>
          </div>

          {watch('enableLoginAttemptLimit') && (
            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Nombre max de tentatives</Label>
              <Input 
                id="maxLoginAttempts"
                type="number"
                {...register('maxLoginAttempts', { valueAsNumber: true })} 
                placeholder="5"
                className="border-red-200 focus:border-red-500"
              />
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg"
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder les paramètres de sécurité'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SecuritySettingsForm;
