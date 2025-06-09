
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EcommerceSettings } from '@/types/siteSettings';
import { ShoppingCart } from 'lucide-react';

interface EcommerceSettingsFormProps {
  settings: EcommerceSettings;
  onSave: (data: EcommerceSettings) => void;
  loading?: boolean;
}

const EcommerceSettingsForm: React.FC<EcommerceSettingsFormProps> = ({ 
  settings, 
  onSave, 
  loading = false 
}) => {
  const { register, handleSubmit, setValue, watch } = useForm<EcommerceSettings>({
    defaultValues: settings
  });

  const outOfStockOptions = [
    { value: 'hide', label: 'Masquer le produit' },
    { value: 'show', label: 'Afficher "Rupture de stock"' },
    { value: 'preorder', label: 'Permettre la précommande' }
  ];

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-100">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-green-700 to-emerald-800 bg-clip-text text-transparent">
              Paramètres E-commerce
            </CardTitle>
            <CardDescription className="text-green-600">
              Configuration des fonctionnalités de vente
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Taux de TVA (%)</Label>
              <Input 
                id="taxRate"
                type="number"
                step="0.01"
                {...register('taxRate', { valueAsNumber: true })} 
                placeholder="20"
                className="border-green-200 focus:border-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingFee">Frais de port (€)</Label>
              <Input 
                id="shippingFee"
                type="number"
                step="0.01"
                {...register('shippingFee', { valueAsNumber: true })} 
                placeholder="5.99"
                className="border-green-200 focus:border-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="freeShippingThreshold">Seuil livraison gratuite (€)</Label>
              <Input 
                id="freeShippingThreshold"
                type="number"
                step="0.01"
                {...register('freeShippingThreshold', { valueAsNumber: true })} 
                placeholder="50"
                className="border-green-200 focus:border-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Seuil stock faible</Label>
              <Input 
                id="lowStockThreshold"
                type="number"
                {...register('lowStockThreshold', { valueAsNumber: true })} 
                placeholder="5"
                className="border-green-200 focus:border-green-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Activer les avis clients</Label>
                <p className="text-sm text-green-600">Permettre aux clients de laisser des avis</p>
              </div>
              <Switch 
                checked={watch('enableReviews')}
                onCheckedChange={(checked) => setValue('enableReviews', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Liste de souhaits</Label>
                <p className="text-sm text-green-600">Activer la fonctionnalité wishlist</p>
              </div>
              <Switch 
                checked={watch('enableWishlist')}
                onCheckedChange={(checked) => setValue('enableWishlist', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Comparaison de produits</Label>
                <p className="text-sm text-green-600">Permettre de comparer les produits</p>
              </div>
              <Switch 
                checked={watch('enableCompare')}
                onCheckedChange={(checked) => setValue('enableCompare', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Gestion des stocks</Label>
                <p className="text-sm text-green-600">Activer le suivi des stocks</p>
              </div>
              <Switch 
                checked={watch('stockManagement')}
                onCheckedChange={(checked) => setValue('stockManagement', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Réduction automatique du stock</Label>
                <p className="text-sm text-green-600">Réduire le stock automatiquement après commande</p>
              </div>
              <Switch 
                checked={watch('autoReduceStock')}
                onCheckedChange={(checked) => setValue('autoReduceStock', checked)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Comportement rupture de stock</Label>
            <Select value={watch('outOfStockBehavior')} onValueChange={(value) => setValue('outOfStockBehavior', value)}>
              <SelectTrigger className="border-green-200 focus:border-green-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {outOfStockOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder les paramètres e-commerce'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EcommerceSettingsForm;
