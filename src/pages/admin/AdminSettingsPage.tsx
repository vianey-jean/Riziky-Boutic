
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from './AdminLayout';
import GeneralSettingsForm from '@/components/admin/settings/GeneralSettingsForm';
import NotificationSettingsForm from '@/components/admin/settings/NotificationSettingsForm';
import BackupSettings from '@/components/admin/settings/BackupSettings';
import { useSettings } from '@/hooks/useSettings';
import { Skeleton } from '@/components/ui/skeleton';

const AdminSettingsPage = () => {
  const {
    settings,
    isLoading,
    updateGeneralSettings,
    updateNotificationSettings,
    createManualBackup,
    isUpdatingGeneral,
    isUpdatingNotifications,
    isCreatingBackup,
  } = useSettings();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <Settings className="h-6 w-6" />
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!settings) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <Settings className="h-6 w-6" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Erreur de chargement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Impossible de charger les paramètres. Veuillez réessayer.
              </p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <Settings className="h-6 w-6" />
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Paramètres Généraux</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="backup">Sauvegarde</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <GeneralSettingsForm
              settings={settings.general}
              onUpdate={updateGeneralSettings}
              isLoading={isUpdatingGeneral}
            />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettingsForm
              settings={settings.notifications}
              onUpdate={updateNotificationSettings}
              isLoading={isUpdatingNotifications}
            />
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <BackupSettings
              onManualBackup={createManualBackup}
              isCreatingBackup={isCreatingBackup}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
