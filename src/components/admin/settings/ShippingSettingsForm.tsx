
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ShippingSettings } from '@/types/siteSettings';
import { Truck } from 'lucide-react';

interface ShippingSettingsFormProps {
  settings: ShippingSettings;
  onSave: (data: ShippingSettings) => void;
  loading?: boolean;
}

const ShippingSettingsForm: React.FC<ShippingSettingsFormProps> = ({ 
  settings, 
  onSave, 
  loading = false 
}) => {
  const { register, handleSubmit, setValue, watch } = useForm<ShippingSettings>({
    defaultValues: settings
  });

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-indigo-50 to-blue-100">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-3 rounded-xl shadow-lg">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-indigo-700 to-blue-800 bg-clip-text text-transparent">
              Options de Livraison
            </CardTitle>
            <CardDescription className="text-indigo-600">
              Configuration des méthodes de livraison
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Livraison gratuite</Label>
                <p className="text-sm text-indigo-600">Activer la livraison gratuite</p>
              </div>
              <Switch 
                checked={watch('enableFreeShipping')}
                onCheckedChange={(checked) => setValue('enableFreeShipping', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Livraison express</Label>
                <p className="text-sm text-indigo-600">Proposer une option livraison express</p>
              </div>
              <Switch 
                checked={watch('enableExpressDelivery')}
                onCheckedChange={(checked) => setValue('enableExpressDelivery', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Livraison internationale</Label>
                <p className="text-sm text-indigo-600">Livrer à l'international</p>
              </div>
              <Switch 
                checked={watch('enableInternationalShipping')}
                onCheckedChange={(checked) => setValue('enableInternationalShipping', checked)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {watch('enableExpressDelivery') && (
              <div className="space-y-2">
                <Label htmlFor="expressDeliveryFee">Frais livraison express (€)</Label>
                <Input 
                  id="expressDeliveryFee"
                  type="number"
                  step="0.01"
                  {...register('expressDeliveryFee', { valueAsNumber: true })} 
                  placeholder="9.99"
                  className="border-indigo-200 focus:border-indigo-500"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="estimatedDeliveryDays">Délai de livraison (jours)</Label>
              <Input 
                id="estimatedDeliveryDays"
                type="number"
                {...register('estimatedDeliveryDays', { valueAsNumber: true })} 
                placeholder="3"
                className="border-indigo-200 focus:border-indigo-500"
              />
            </div>
          </div>

          {watch('enableInternationalShipping') && (
            <div className="space-y-2">
              <Label htmlFor="internationalShippingFee">Frais livraison internationale (€)</Label>
              <Input 
                id="internationalShippingFee"
                type="number"
                step="0.01"
                {...register('internationalShippingFee', { valueAsNumber: true })} 
                placeholder="15.99"
                className="border-indigo-200 focus:border-indigo-500"
              />
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg"
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder les paramètres de livraison'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ShippingSettingsForm;
