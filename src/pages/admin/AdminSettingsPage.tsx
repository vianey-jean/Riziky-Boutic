
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Globe, Palette, ShoppingCart, CreditCard, Truck, Bell, Search, Shield, AlertTriangle } from 'lucide-react';
import AdminLayout from './AdminLayout';
import AdminPageTitle from '@/components/admin/AdminPageTitle';
import GeneralSettingsForm from '@/components/admin/settings/GeneralSettingsForm';
import AppearanceSettingsForm from '@/components/admin/settings/AppearanceSettingsForm';
import EcommerceSettingsForm from '@/components/admin/settings/EcommerceSettingsForm';
import PaymentSettingsForm from '@/components/admin/settings/PaymentSettingsForm';
import ShippingSettingsForm from '@/components/admin/settings/ShippingSettingsForm';
import NotificationSettingsForm from '@/components/admin/settings/NotificationSettingsForm';
import SEOSettingsForm from '@/components/admin/settings/SEOSettingsForm';
import SecuritySettingsForm from '@/components/admin/settings/SecuritySettingsForm';
import SystemSettingsForm from '@/components/admin/settings/SystemSettingsForm';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import LoadingSpinner from '@/components/ui/loading-spinner';

const AdminSettingsPage = () => {
  const { settings, loading, saving, updateSection, resetSettings } = useSiteSettings();
  const [activeTab, setActiveTab] = useState('general');

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  if (!settings) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <p className="text-gray-500">Erreur lors du chargement des paramètres</p>
        </div>
      </AdminLayout>
    );
  }

  const handleResetSettings = async () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ? Cette action est irréversible.')) {
      await resetSettings();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <AdminPageTitle
          title="Paramètres du Site"
          description="Configuration complète de votre plateforme e-commerce"
          icon={Settings}
        />

        {/* Actions rapides */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Configurez tous les aspects de votre boutique en ligne
          </div>
          <Button 
            variant="outline" 
            onClick={handleResetSettings}
            disabled={saving}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 lg:grid-cols-9 h-auto p-1 bg-gray-100 rounded-xl">
            <TabsTrigger value="general" className="flex flex-col items-center space-y-1 p-3">
              <Globe className="h-4 w-4" />
              <span className="text-xs">Général</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex flex-col items-center space-y-1 p-3">
              <Palette className="h-4 w-4" />
              <span className="text-xs">Apparence</span>
            </TabsTrigger>
            <TabsTrigger value="ecommerce" className="flex flex-col items-center space-y-1 p-3">
              <ShoppingCart className="h-4 w-4" />
              <span className="text-xs">E-commerce</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex flex-col items-center space-y-1 p-3">
              <CreditCard className="h-4 w-4" />
              <span className="text-xs">Paiement</span>
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex flex-col items-center space-y-1 p-3">
              <Truck className="h-4 w-4" />
              <span className="text-xs">Livraison</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex flex-col items-center space-y-1 p-3">
              <Bell className="h-4 w-4" />
              <span className="text-xs">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex flex-col items-center space-y-1 p-3">
              <Search className="h-4 w-4" />
              <span className="text-xs">SEO</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex flex-col items-center space-y-1 p-3">
              <Shield className="h-4 w-4" />
              <span className="text-xs">Sécurité</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex flex-col items-center space-y-1 p-3">
              <Settings className="h-4 w-4" />
              <span className="text-xs">Système</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <GeneralSettingsForm
              settings={settings.general}
              onSave={(data) => updateSection('general', data)}
              loading={saving}
            />
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <AppearanceSettingsForm
              settings={settings.appearance}
              onSave={(data) => updateSection('appearance', data)}
              loading={saving}
            />
          </TabsContent>

          <TabsContent value="ecommerce" className="space-y-6">
            <EcommerceSettingsForm
              settings={settings.ecommerce}
              onSave={(data) => updateSection('ecommerce', data)}
              loading={saving}
            />
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            <PaymentSettingsForm
              settings={settings.payment}
              onSave={(data) => updateSection('payment', data)}
              loading={saving}
            />
          </TabsContent>

          <TabsContent value="shipping" className="space-y-6">
            <ShippingSettingsForm
              settings={settings.shipping}
              onSave={(data) => updateSection('shipping', data)}
              loading={saving}
            />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettingsForm
              settings={settings.notifications}
              onSave={(data) => updateSection('notifications', data)}
              loading={saving}
            />
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <SEOSettingsForm
              settings={settings.seo}
              onSave={(data) => updateSection('seo', data)}
              loading={saving}
            />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecuritySettingsForm
              settings={settings.security}
              onSave={(data) => updateSection('security', data)}
              loading={saving}
            />
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <SystemSettingsForm
              settings={settings.system}
              onSave={(data) => updateSection('system', data)}
              loading={saving}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
