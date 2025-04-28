
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {  Settings } from 'lucide-react';

import AdminLayout from './AdminLayout';

const AdminSettingsPage = () => {
  return (
    <AdminLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <Settings className="h-6 w-6" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres Généraux</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              La page des paramètres est en cours de construction. De nouvelles fonctionnalités seront ajoutées prochainement.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Les paramètres de notification seront disponibles bientôt.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
