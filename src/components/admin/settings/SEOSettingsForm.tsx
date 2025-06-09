
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { SEOSettings } from '@/types/siteSettings';
import { Search } from 'lucide-react';

interface SEOSettingsFormProps {
  settings: SEOSettings;
  onSave: (data: SEOSettings) => void;
  loading?: boolean;
}

const SEOSettingsForm: React.FC<SEOSettingsFormProps> = ({ 
  settings, 
  onSave, 
  loading = false 
}) => {
  const { register, handleSubmit, setValue, watch } = useForm<SEOSettings>({
    defaultValues: settings
  });

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-teal-50 to-cyan-100">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-3 rounded-xl shadow-lg">
            <Search className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-teal-700 to-cyan-800 bg-clip-text text-transparent">
              SEO et Analytics
            </CardTitle>
            <CardDescription className="text-teal-600">
              Optimisation pour les moteurs de recherche
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Titre Meta</Label>
            <Input 
              id="metaTitle"
              {...register('metaTitle')} 
              placeholder="Mon E-commerce - Votre boutique en ligne"
              className="border-teal-200 focus:border-teal-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Description Meta</Label>
            <Textarea 
              id="metaDescription"
              {...register('metaDescription')} 
              placeholder="Découvrez notre large gamme de produits de qualité avec livraison rapide"
              className="border-teal-200 focus:border-teal-500"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaKeywords">Mots-clés Meta</Label>
            <Input 
              id="metaKeywords"
              {...register('metaKeywords')} 
              placeholder="e-commerce, boutique en ligne, produits, livraison"
              className="border-teal-200 focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
              <Input 
                id="googleAnalyticsId"
                {...register('googleAnalyticsId')} 
                placeholder="G-XXXXXXXXXX"
                className="border-teal-200 focus:border-teal-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
              <Input 
                id="facebookPixelId"
                {...register('facebookPixelId')} 
                placeholder="123456789012345"
                className="border-teal-200 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Activer le sitemap</Label>
                <p className="text-sm text-teal-600">Générer automatiquement un sitemap.xml</p>
              </div>
              <Switch 
                checked={watch('enableSitemap')}
                onCheckedChange={(checked) => setValue('enableSitemap', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Activer robots.txt</Label>
                <p className="text-sm text-teal-600">Générer automatiquement robots.txt</p>
              </div>
              <Switch 
                checked={watch('enableRobotsTxt')}
                onCheckedChange={(checked) => setValue('enableRobotsTxt', checked)}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg"
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder les paramètres SEO'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SEOSettingsForm;
