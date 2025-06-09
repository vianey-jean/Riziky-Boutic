
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppearanceSettings } from '@/types/siteSettings';
import { Palette } from 'lucide-react';

interface AppearanceSettingsFormProps {
  settings: AppearanceSettings;
  onSave: (data: AppearanceSettings) => void;
  loading?: boolean;
}

const AppearanceSettingsForm: React.FC<AppearanceSettingsFormProps> = ({ 
  settings, 
  onSave, 
  loading = false 
}) => {
  const { register, handleSubmit, setValue, watch } = useForm<AppearanceSettings>({
    defaultValues: settings
  });

  const themes = [
    { value: 'modern', label: 'Moderne' },
    { value: 'classic', label: 'Classique' },
    { value: 'minimal', label: 'Minimaliste' },
    { value: 'elegant', label: 'Élégant' }
  ];

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-pink-100">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl shadow-lg">
            <Palette className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-purple-700 to-pink-800 bg-clip-text text-transparent">
              Apparence
            </CardTitle>
            <CardDescription className="text-purple-600">
              Personnalisez l'apparence de votre site
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
          <div className="space-y-2">
            <Label>Thème</Label>
            <Select value={watch('theme')} onValueChange={(value) => setValue('theme', value)}>
              <SelectTrigger className="border-purple-200 focus:border-purple-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Couleur principale</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  id="primaryColor"
                  type="color"
                  {...register('primaryColor')} 
                  className="w-16 h-10 border-purple-200"
                />
                <Input 
                  {...register('primaryColor')} 
                  placeholder="#3B82F6"
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Couleur secondaire</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  id="secondaryColor"
                  type="color"
                  {...register('secondaryColor')} 
                  className="w-16 h-10 border-purple-200"
                />
                <Input 
                  {...register('secondaryColor')} 
                  placeholder="#10B981"
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accentColor">Couleur d'accent</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  id="accentColor"
                  type="color"
                  {...register('accentColor')} 
                  className="w-16 h-10 border-purple-200"
                />
                <Input 
                  {...register('accentColor')} 
                  placeholder="#F59E0B"
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="logoUrl">URL du logo</Label>
              <Input 
                id="logoUrl"
                {...register('logoUrl')} 
                placeholder="/images/logo/logo.png"
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faviconUrl">URL du favicon</Label>
              <Input 
                id="faviconUrl"
                {...register('faviconUrl')} 
                placeholder="/favicon.ico"
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Bannière promotionnelle</Label>
                <p className="text-sm text-purple-600">Afficher une bannière en haut du site</p>
              </div>
              <Switch 
                checked={watch('bannerEnabled')}
                onCheckedChange={(checked) => setValue('bannerEnabled', checked)}
              />
            </div>
            
            {watch('bannerEnabled') && (
              <div className="space-y-2">
                <Label htmlFor="bannerText">Texte de la bannière</Label>
                <Input 
                  id="bannerText"
                  {...register('bannerText')} 
                  placeholder="Livraison gratuite à partir de 50€"
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg"
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder l\'apparence'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettingsForm;
