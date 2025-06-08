import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Palette, Shield, Bell, Database, Globe } from 'lucide-react';
import AdminLayout from './AdminLayout';
import PageDataLoader from '@/components/layout/PageDataLoader';

const AdminSettingsPage = () => {
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadSettingsData = async () => {
    // Simulate loading settings data
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { settings: 'loaded' };
  };

  const handleDataSuccess = () => {
    setDataLoaded(true);
  };

  const handleMaxRetriesReached = () => {
    console.error('Impossible de charger les paramètres');
  };

  if (!dataLoaded) {
    return (
      <AdminLayout>
        <PageDataLoader
          fetchFunction={loadSettingsData}
          onSuccess={handleDataSuccess}
          onMaxRetriesReached={handleMaxRetriesReached}
          loadingMessage="Chargement des paramètres..."
          loadingSubmessage="Configuration de votre espace admin..."
          errorMessage="Erreur de chargement des paramètres"
        >
        </PageDataLoader>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-3 rounded-2xl shadow-lg">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
                    Paramètres
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Configuration et préférences du système
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 p-4 rounded-xl">
                <Settings className="h-12 w-12 text-gray-600 dark:text-gray-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* General Settings */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Palette className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl bg-gradient-to-r from-blue-700 to-blue-800 dark:from-blue-300 dark:to-blue-200 bg-clip-text text-transparent">
                  Paramètres Généraux
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                Configuration de base de l'application et personnalisation de l'interface.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-600 dark:text-blue-400">Thème</span>
                  <span className="font-medium text-blue-800 dark:text-blue-200">Automatique</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-600 dark:text-blue-400">Langue</span>
                  <span className="font-medium text-blue-800 dark:text-blue-200">Français</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl bg-gradient-to-r from-green-700 to-green-800 dark:from-green-300 dark:to-green-200 bg-clip-text text-transparent">
                  Sécurité
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 dark:text-green-300 mb-4">
                Gestion des accès, authentification et protection des données.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600 dark:text-green-400">2FA</span>
                  <span className="font-medium text-green-800 dark:text-green-200">Activé</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600 dark:text-green-400">Sessions</span>
                  <span className="font-medium text-green-800 dark:text-green-200">24h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl bg-gradient-to-r from-orange-700 to-orange-800 dark:from-orange-300 dark:to-orange-200 bg-clip-text text-transparent">
                  Notifications
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 dark:text-orange-300 mb-4">
                Configuration des alertes et notifications système.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-orange-600 dark:text-orange-400">Email</span>
                  <span className="font-medium text-orange-800 dark:text-orange-200">Activé</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-orange-600 dark:text-orange-400">Push</span>
                  <span className="font-medium text-orange-800 dark:text-orange-200">Désactivé</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Database */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl bg-gradient-to-r from-purple-700 to-purple-800 dark:from-purple-300 dark:to-purple-200 bg-clip-text text-transparent">
                  Base de Données
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700 dark:text-purple-300 mb-4">
                Maintenance et sauvegarde des données système.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-600 dark:text-purple-400">Backup</span>
                  <span className="font-medium text-purple-800 dark:text-purple-200">Quotidien</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-600 dark:text-purple-400">Taille</span>
                  <span className="font-medium text-purple-800 dark:text-purple-200">2.4 GB</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Système */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl bg-gradient-to-r from-red-700 to-red-800 dark:from-red-300 dark:to-red-200 bg-clip-text text-transparent">
                  Système
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 dark:text-red-300 mb-4">
                Informations système et performance de l'application.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-600 dark:text-red-400">Version</span>
                  <span className="font-medium text-red-800 dark:text-red-200">2.1.0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-600 dark:text-red-400">Uptime</span>
                  <span className="font-medium text-red-800 dark:text-red-200">7j 12h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-300 dark:to-gray-200 bg-clip-text text-transparent">
                  Maintenance
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Outils de maintenance et optimisation système.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Dernière MàJ</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">Hier</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Cache</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">Optimisé</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl w-fit mx-auto mb-4">
              <Settings className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Nouvelles fonctionnalités en développement
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              De nouvelles options de configuration et de personnalisation seront ajoutées prochainement pour vous offrir 
              un contrôle encore plus avancé sur votre plateforme e-commerce.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
