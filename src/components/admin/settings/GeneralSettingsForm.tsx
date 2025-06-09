
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GeneralSettings } from '@/types/siteSettings';
import { Globe, Building } from 'lucide-react';

interface GeneralSettingsFormProps {
  settings: GeneralSettings;
  onSave: (data: GeneralSettings) => void;
  loading?: boolean;
}

const GeneralSettingsForm: React.FC<GeneralSettingsFormProps> = ({ 
  settings, 
  onSave, 
  loading = false 
}) => {
  const { register, handleSubmit, setValue, watch } = useForm<GeneralSettings>({
    defaultValues: settings
  });

  const currencies = [
    { value: 'EUR', label: '€ Euro' },
    { value: 'USD', label: '$ Dollar US' },
    { value: 'GBP', label: '£ Livre Sterling' },
    { value: 'CAD', label: '$ Dollar Canadien' }
  ];

  const languages = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'de', label: 'Deutsch' }
  ];

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-100">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
              Paramètres Généraux
            </CardTitle>
            <CardDescription className="text-blue-600">
              Configuration de base de votre site e-commerce
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Nom du site</Label>
              <Input 
                id="siteName"
                {...register('siteName')} 
                placeholder="Mon E-commerce"
                className="border-blue-200 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Nom de l'entreprise</Label>
              <Input 
                id="companyName"
                {...register('companyName')} 
                placeholder="Ma Société"
                className="border-blue-200 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription">Description du site</Label>
            <Textarea 
              id="siteDescription"
              {...register('siteDescription')} 
              placeholder="Description de votre boutique en ligne"
              className="border-blue-200 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email de contact</Label>
              <Input 
                id="contactEmail"
                type="email"
                {...register('contactEmail')} 
                placeholder="contact@monsite.com"
                className="border-blue-200 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Email de support</Label>
              <Input 
                id="supportEmail"
                type="email"
                {...register('supportEmail')} 
                placeholder="support@monsite.com"
                className="border-blue-200 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input 
                id="phone"
                {...register('phone')} 
                placeholder="+33 1 23 45 67 89"
                className="border-blue-200 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <Input 
                id="timezone"
                {...register('timezone')} 
                placeholder="Europe/Paris"
                className="border-blue-200 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Textarea 
              id="address"
              {...register('address')} 
              placeholder="123 Rue du Commerce, 75001 Paris"
              className="border-blue-200 focus:border-blue-500"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Devise</Label>
              <Select value={watch('currency')} onValueChange={(value) => setValue('currency', value)}>
                <SelectTrigger className="border-blue-200 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Langue</Label>
              <Select value={watch('language')} onValueChange={(value) => setValue('language', value)}>
                <SelectTrigger className="border-blue-200 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder les paramètres généraux'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GeneralSettingsForm;
