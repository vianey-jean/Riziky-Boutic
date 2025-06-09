
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PaymentSettings } from '@/types/siteSettings';
import { CreditCard } from 'lucide-react';

interface PaymentSettingsFormProps {
  settings: PaymentSettings;
  onSave: (data: PaymentSettings) => void;
  loading?: boolean;
}

const PaymentSettingsForm: React.FC<PaymentSettingsFormProps> = ({ 
  settings, 
  onSave, 
  loading = false 
}) => {
  const { register, handleSubmit, setValue, watch } = useForm<PaymentSettings>({
    defaultValues: settings
  });

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-yellow-50 to-orange-100">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-xl shadow-lg">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-yellow-700 to-orange-800 bg-clip-text text-transparent">
              Moyens de Paiement
            </CardTitle>
            <CardDescription className="text-yellow-600">
              Configuration des passerelles de paiement
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Carte de crédit</Label>
                <p className="text-sm text-yellow-600">Accepter les paiements par carte</p>
              </div>
              <Switch 
                checked={watch('enableCreditCard')}
                onCheckedChange={(checked) => setValue('enableCreditCard', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>PayPal</Label>
                <p className="text-sm text-yellow-600">Accepter les paiements PayPal</p>
              </div>
              <Switch 
                checked={watch('enablePaypal')}
                onCheckedChange={(checked) => setValue('enablePaypal', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Virement bancaire</Label>
                <p className="text-sm text-yellow-600">Accepter les virements bancaires</p>
              </div>
              <Switch 
                checked={watch('enableBankTransfer')}
                onCheckedChange={(checked) => setValue('enableBankTransfer', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Paiement en espèces</Label>
                <p className="text-sm text-yellow-600">Paiement à la livraison</p>
              </div>
              <Switch 
                checked={watch('enableCash')}
                onCheckedChange={(checked) => setValue('enableCash', checked)}
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="text-lg font-medium text-yellow-800 mb-4">Configuration Stripe</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Activer Stripe</Label>
                  <p className="text-sm text-yellow-600">Utiliser Stripe pour les paiements</p>
                </div>
                <Switch 
                  checked={watch('stripeEnabled')}
                  onCheckedChange={(checked) => setValue('stripeEnabled', checked)}
                />
              </div>

              {watch('stripeEnabled') && (
                <div className="space-y-2">
                  <Label htmlFor="stripePublicKey">Clé publique Stripe</Label>
                  <Input 
                    id="stripePublicKey"
                    {...register('stripePublicKey')} 
                    placeholder="pk_test_..."
                    className="border-yellow-200 focus:border-yellow-500"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="text-lg font-medium text-yellow-800 mb-4">Configuration PayPal</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Activer PayPal</Label>
                  <p className="text-sm text-yellow-600">Utiliser PayPal pour les paiements</p>
                </div>
                <Switch 
                  checked={watch('paypalEnabled')}
                  onCheckedChange={(checked) => setValue('paypalEnabled', checked)}
                />
              </div>

              {watch('paypalEnabled') && (
                <div className="space-y-2">
                  <Label htmlFor="paypalClientId">Client ID PayPal</Label>
                  <Input 
                    id="paypalClientId"
                    {...register('paypalClientId')} 
                    placeholder="AQ6Xr6..."
                    className="border-yellow-200 focus:border-yellow-500"
                  />
                </div>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-lg"
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder les paramètres de paiement'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentSettingsForm;
