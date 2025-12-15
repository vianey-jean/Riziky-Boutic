
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PaymentSettings } from '@/types/siteSettings';
import { CreditCard, Key, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { usePaymentModes } from '@/hooks/usePaymentModes';
import { PaymentModes } from '@/services/paymentModesAPI';
import { stripeKeysAPI } from '@/services/stripeKeysAPI';
import { useToast } from '@/hooks/use-toast';
import PageDataLoader from '@/components/layout/PageDataLoader';

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
  const { paymentModes, updatePaymentModes, saving } = usePaymentModes();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch } = useForm<PaymentModes>({
    defaultValues: paymentModes || settings
  });

  // États pour les clés Stripe
  const [stripePublicKey, setStripePublicKey] = useState('');
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [showPublicKey, setShowPublicKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [hasPublicKey, setHasPublicKey] = useState(false);
  const [hasSecretKey, setHasSecretKey] = useState(false);
  const [savingKeys, setSavingKeys] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Charger le statut des clés
  const loadKeysStatus = async () => {
    const status = await stripeKeysAPI.getStatus();
    setHasPublicKey(status.hasPublicKey);
    setHasSecretKey(status.hasSecretKey);
    return status;
  };

  const handleDataLoaded = (status: any) => {
    setHasPublicKey(status.hasPublicKey);
    setHasSecretKey(status.hasSecretKey);
    setDataLoaded(true);
  };

  const handleSavePaymentModes = async (data: PaymentModes) => {
    await updatePaymentModes(data);
    
    setSavingKeys(true);
    try {
      // Sauvegarder la clé publique si renseignée
      if (stripePublicKey) {
        await stripeKeysAPI.savePublicKey(stripePublicKey);
        setHasPublicKey(true);
        setStripePublicKey('');
        toast({
          title: "Succès",
          description: "Clé publique Stripe sauvegardée et cryptée",
          className: "bg-green-600 text-white",
        });
      }
      
      // Sauvegarder la clé secrète si renseignée
      if (stripeSecretKey) {
        await stripeKeysAPI.saveSecretKey(stripeSecretKey);
        setHasSecretKey(true);
        setStripeSecretKey('');
        toast({
          title: "Succès",
          description: "Clé secrète Stripe sauvegardée et cryptée",
          className: "bg-green-600 text-white",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les clés Stripe",
        variant: "destructive",
      });
    } finally {
      setSavingKeys(false);
    }
    
    onSave(data as PaymentSettings);
  };

  if (!dataLoaded) {
    return (
      <PageDataLoader
        fetchFunction={loadKeysStatus}
        onSuccess={handleDataLoaded}
        loadingMessage="Chargement des paramètres de paiement..."
        loadingSubmessage="Vérification de la configuration Stripe..."
        errorMessage="Erreur lors du chargement"
      />
    );
  }

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
        <form onSubmit={handleSubmit(handleSavePaymentModes)} className="space-y-6">
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

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Apple Pay</Label>
                <p className="text-sm text-yellow-600">Accepter les paiements Apple Pay</p>
              </div>
              <Switch 
                checked={watch('enableApplePay')}
                onCheckedChange={(checked) => setValue('enableApplePay', checked)}
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
                <>
                  {/* Clé publique Stripe */}
                  <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-blue-600" />
                        <Label htmlFor="stripePublicKey" className="text-blue-800 font-medium">
                          Clé publique Stripe
                        </Label>
                        {hasPublicKey && (
                          <span className="flex items-center text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                            <Check className="h-3 w-3 mr-1" />
                            Configurée
                          </span>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPublicKey(!showPublicKey)}
                      >
                        {showPublicKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Input 
                      id="stripePublicKey"
                      type={showPublicKey ? "text" : "password"}
                      value={stripePublicKey}
                      onChange={(e) => setStripePublicKey(e.target.value)}
                      placeholder={hasPublicKey ? "••••••••••••••••••••" : "pk_test_..."}
                      className="border-blue-300 focus:border-blue-500 bg-white"
                    />
                    <p className="text-xs text-blue-700">
                      Cette clé sera cryptée et stockée dans la base de données.
                    </p>
                  </div>

                  {/* Clé secrète Stripe */}
                  <div className="space-y-2 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-yellow-600" />
                        <Label htmlFor="stripeSecretKey" className="text-yellow-800 font-medium">
                          Clé secrète Stripe
                        </Label>
                        {hasSecretKey && (
                          <span className="flex items-center text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                            <Check className="h-3 w-3 mr-1" />
                            Configurée
                          </span>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSecretKey(!showSecretKey)}
                      >
                        {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Input 
                      id="stripeSecretKey"
                      type={showSecretKey ? "text" : "password"}
                      value={stripeSecretKey}
                      onChange={(e) => setStripeSecretKey(e.target.value)}
                      placeholder={hasSecretKey ? "••••••••••••••••••••" : "sk_test_..."}
                      className="border-yellow-300 focus:border-yellow-500 bg-white"
                    />
                    <div className="flex items-start gap-2 mt-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-yellow-700">
                        Cette clé sera cryptée et stockée de manière sécurisée. 
                        Elle ne sera jamais exposée côté client.
                      </p>
                    </div>
                  </div>
                </>
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
            disabled={loading || saving || savingKeys}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-lg"
          >
            {(loading || saving || savingKeys) ? 'Sauvegarde...' : 'Sauvegarder les paramètres de paiement'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentSettingsForm;
