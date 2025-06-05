import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Settings, Database, Mail, Shield, CreditCard, Truck, Bell } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { settingsAPI } from '@/services/settingsAPI';

const AdminSettingsPage = () => {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: '',
    siteDescription: '',
    siteUrl: '',
    maintenanceMode: false,
    allowRegistration: true,
    defaultCurrency: 'EUR',
    defaultLanguage: 'fr',
    timezone: 'Europe/Paris'
  });

  const [smtpSettings, setSmtpSettings] = useState({
    host: '',
    port: 587,
    username: '',
    password: '',
    fromEmail: '',
    fromName: '',
    encryption: 'TLS'
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripePublishableKey: '',
    stripeSecretKey: '',
    paypalClientId: '',
    paypalClientSecret: '',
    enableStripe: false,
    enablePaypal: false,
    enableCashOnDelivery: true
  });

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 0,
    defaultShippingCost: 0,
    shippingZones: [],
    enableFreeShipping: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    sessionTimeout: 3600,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requirePasswordChange: false
  });

  const [backupSettings, setBackupSettings] = useState({
    enableAutoBackup: true,
    backupTime: '23:58',
    adminEmail: 'vianey.jean@ymail.com',
    backupFrequency: 'daily'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    lowStockAlerts: true,
    newUserNotifications: true,
    systemAlerts: true
  });

  useEffect(() => {
    loadAllSettings();
  }, []);

  const loadAllSettings = async () => {
    try {
      const [general, smtp, payment, shipping, security, backup, notifications] = await Promise.all([
        settingsAPI.getGeneralSettings(),
        settingsAPI.getSMTPSettings(),
        settingsAPI.getPaymentSettings(),
        settingsAPI.getShippingSettings(),
        settingsAPI.getSecuritySettings(),
        settingsAPI.getBackupSettings(),
        settingsAPI.getNotificationSettings()
      ]);

      setGeneralSettings(general.data || generalSettings);
      setSmtpSettings(smtp.data || smtpSettings);
      setPaymentSettings(payment.data || paymentSettings);
      setShippingSettings(shipping.data || shippingSettings);
      setSecuritySettings(security.data || securitySettings);
      setBackupSettings(backup.data || backupSettings);
      setNotificationSettings(notifications.data || notificationSettings);
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  };

  const saveGeneralSettings = async () => {
    try {
      await settingsAPI.updateGeneralSettings(generalSettings);
      toast.success('Paramètres généraux sauvegardés');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const saveSMTPSettings = async () => {
    try {
      await settingsAPI.updateSMTPSettings(smtpSettings);
      toast.success('Paramètres SMTP sauvegardés');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde SMTP');
    }
  };

  const savePaymentSettings = async () => {
    try {
      await settingsAPI.updatePaymentSettings(paymentSettings);
      toast.success('Paramètres de paiement sauvegardés');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde des paiements');
    }
  };

  const saveShippingSettings = async () => {
    try {
      await settingsAPI.updateShippingSettings(shippingSettings);
      toast.success('Paramètres de livraison sauvegardés');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde de la livraison');
    }
  };

  const saveSecuritySettings = async () => {
    try {
      await settingsAPI.updateSecuritySettings(securitySettings);
      toast.success('Paramètres de sécurité sauvegardés');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde de la sécurité');
    }
  };

  const saveBackupSettings = async () => {
    try {
      await settingsAPI.updateBackupSettings(backupSettings);
      await settingsAPI.configureAutoBackup(backupSettings);
      toast.success('Paramètres de sauvegarde configurés');
    } catch (error) {
      toast.error('Erreur lors de la configuration de la sauvegarde');
    }
  };

  const saveNotificationSettings = async () => {
    try {
      await settingsAPI.updateNotificationSettings(notificationSettings);
      toast.success('Paramètres de notification sauvegardés');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde des notifications');
    }
  };

  const testSMTPConnection = async () => {
    try {
      await settingsAPI.testSMTPConnection(smtpSettings);
      toast.success('Connexion SMTP réussie');
    } catch (error) {
      toast.error('Échec de la connexion SMTP');
    }
  };

  const triggerManualBackup = async () => {
    try {
      await settingsAPI.triggerManualBackup();
      toast.success('Sauvegarde manuelle déclenchée');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <Settings className="h-6 w-6" />
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="smtp">SMTP</TabsTrigger>
            <TabsTrigger value="payment">Paiement</TabsTrigger>
            <TabsTrigger value="shipping">Livraison</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="backup">Sauvegarde</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Paramètres Généraux
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Nom du site</Label>
                    <Input
                      id="siteName"
                      value={generalSettings.siteName || ''}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="siteUrl">URL du site</Label>
                    <Input
                      id="siteUrl"
                      value={generalSettings.siteUrl || ''}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteUrl: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="siteDescription">Description du site</Label>
                    <Textarea
                      id="siteDescription"
                      value={generalSettings.siteDescription || ''}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="defaultCurrency">Devise par défaut</Label>
                    <Select value={generalSettings.defaultCurrency} onValueChange={(value) => setGeneralSettings({...generalSettings, defaultCurrency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select value={generalSettings.timezone} onValueChange={(value) => setGeneralSettings({...generalSettings, timezone: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenanceMode"
                    checked={generalSettings.maintenanceMode || false}
                    onCheckedChange={(checked) => setGeneralSettings({...generalSettings, maintenanceMode: checked})}
                  />
                  <Label htmlFor="maintenanceMode">Mode maintenance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="allowRegistration"
                    checked={generalSettings.allowRegistration || false}
                    onCheckedChange={(checked) => setGeneralSettings({...generalSettings, allowRegistration: checked})}
                  />
                  <Label htmlFor="allowRegistration">Autoriser les inscriptions</Label>
                </div>
                <Button onClick={saveGeneralSettings}>Sauvegarder</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="smtp">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Configuration SMTP
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpHost">Serveur SMTP</Label>
                    <Input
                      id="smtpHost"
                      value={smtpSettings.host}
                      onChange={(e) => setSmtpSettings({...smtpSettings, host: e.target.value})}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={smtpSettings.port}
                      onChange={(e) => setSmtpSettings({...smtpSettings, port: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpUsername">Nom d'utilisateur</Label>
                    <Input
                      id="smtpUsername"
                      value={smtpSettings.username}
                      onChange={(e) => setSmtpSettings({...smtpSettings, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPassword">Mot de passe</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={smtpSettings.password}
                      onChange={(e) => setSmtpSettings({...smtpSettings, password: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fromEmail">Email expéditeur</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={smtpSettings.fromEmail}
                      onChange={(e) => setSmtpSettings({...smtpSettings, fromEmail: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fromName">Nom expéditeur</Label>
                    <Input
                      id="fromName"
                      value={smtpSettings.fromName}
                      onChange={(e) => setSmtpSettings({...smtpSettings, fromName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveSMTPSettings}>Sauvegarder</Button>
                  <Button variant="outline" onClick={testSMTPConnection}>Tester la connexion</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Paramètres de Paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableStripe"
                      checked={paymentSettings.enableStripe}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, enableStripe: checked})}
                    />
                    <Label htmlFor="enableStripe">Activer Stripe</Label>
                  </div>
                  {paymentSettings.enableStripe && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stripePublishableKey">Clé publique Stripe</Label>
                        <Input
                          id="stripePublishableKey"
                          value={paymentSettings.stripePublishableKey}
                          onChange={(e) => setPaymentSettings({...paymentSettings, stripePublishableKey: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="stripeSecretKey">Clé secrète Stripe</Label>
                        <Input
                          id="stripeSecretKey"
                          type="password"
                          value={paymentSettings.stripeSecretKey}
                          onChange={(e) => setPaymentSettings({...paymentSettings, stripeSecretKey: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enablePaypal"
                      checked={paymentSettings.enablePaypal}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, enablePaypal: checked})}
                    />
                    <Label htmlFor="enablePaypal">Activer PayPal</Label>
                  </div>
                  {paymentSettings.enablePaypal && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="paypalClientId">Client ID PayPal</Label>
                        <Input
                          id="paypalClientId"
                          value={paymentSettings.paypalClientId}
                          onChange={(e) => setPaymentSettings({...paymentSettings, paypalClientId: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="paypalClientSecret">Client Secret PayPal</Label>
                        <Input
                          id="paypalClientSecret"
                          type="password"
                          value={paymentSettings.paypalClientSecret}
                          onChange={(e) => setPaymentSettings({...paymentSettings, paypalClientSecret: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableCashOnDelivery"
                      checked={paymentSettings.enableCashOnDelivery}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, enableCashOnDelivery: checked})}
                    />
                    <Label htmlFor="enableCashOnDelivery">Paiement à la livraison</Label>
                  </div>
                </div>
                <Button onClick={savePaymentSettings}>Sauvegarder</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Paramètres de Livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="defaultShippingCost">Coût de livraison par défaut (€)</Label>
                    <Input
                      id="defaultShippingCost"
                      type="number"
                      value={shippingSettings.defaultShippingCost}
                      onChange={(e) => setShippingSettings({...shippingSettings, defaultShippingCost: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="freeShippingThreshold">Seuil livraison gratuite (€)</Label>
                    <Input
                      id="freeShippingThreshold"
                      type="number"
                      value={shippingSettings.freeShippingThreshold}
                      onChange={(e) => setShippingSettings({...shippingSettings, freeShippingThreshold: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableFreeShipping"
                    checked={shippingSettings.enableFreeShipping}
                    onCheckedChange={(checked) => setShippingSettings({...shippingSettings, enableFreeShipping: checked})}
                  />
                  <Label htmlFor="enableFreeShipping">Activer la livraison gratuite</Label>
                </div>
                <Button onClick={saveShippingSettings}>Sauvegarder</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Paramètres de Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sessionTimeout">Délai d'expiration de session (secondes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLoginAttempts">Tentatives de connexion max</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="passwordMinLength">Longueur minimale du mot de passe</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={securitySettings.passwordMinLength}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableTwoFactor"
                      checked={securitySettings.enableTwoFactor}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableTwoFactor: checked})}
                    />
                    <Label htmlFor="enableTwoFactor">Authentification à deux facteurs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requirePasswordChange"
                      checked={securitySettings.requirePasswordChange}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, requirePasswordChange: checked})}
                    />
                    <Label htmlFor="requirePasswordChange">Forcer le changement de mot de passe</Label>
                  </div>
                </div>
                <Button onClick={saveSecuritySettings}>Sauvegarder</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Sauvegarde Automatique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="backupTime">Heure de sauvegarde</Label>
                    <Input
                      id="backupTime"
                      type="time"
                      value={backupSettings.backupTime}
                      onChange={(e) => setBackupSettings({...backupSettings, backupTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="adminEmail">Email administrateur</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={backupSettings.adminEmail}
                      onChange={(e) => setBackupSettings({...backupSettings, adminEmail: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="backupFrequency">Fréquence</Label>
                    <Select value={backupSettings.backupFrequency} onValueChange={(value) => setBackupSettings({...backupSettings, backupFrequency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Quotidienne</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuelle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableAutoBackup"
                    checked={backupSettings.enableAutoBackup}
                    onCheckedChange={(checked) => setBackupSettings({...backupSettings, enableAutoBackup: checked})}
                  />
                  <Label htmlFor="enableAutoBackup">Activer la sauvegarde automatique</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveBackupSettings}>Configurer</Button>
                  <Button variant="outline" onClick={triggerManualBackup}>Sauvegarde manuelle</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Paramètres de Notification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="orderNotifications"
                      checked={notificationSettings.orderNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, orderNotifications: checked})}
                    />
                    <Label htmlFor="orderNotifications">Notifications de commandes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="lowStockAlerts"
                      checked={notificationSettings.lowStockAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, lowStockAlerts: checked})}
                    />
                    <Label htmlFor="lowStockAlerts">Alertes de stock faible</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="newUserNotifications"
                      checked={notificationSettings.newUserNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, newUserNotifications: checked})}
                    />
                    <Label htmlFor="newUserNotifications">Notifications nouveaux utilisateurs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="systemAlerts"
                      checked={notificationSettings.systemAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, systemAlerts: checked})}
                    />
                    <Label htmlFor="systemAlerts">Alertes système</Label>
                  </div>
                </div>
                <Button onClick={saveNotificationSettings}>Sauvegarder</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
