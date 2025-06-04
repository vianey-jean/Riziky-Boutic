
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsAPI } from '@/services/settingsAPI';
import { Settings, GeneralSettings, NotificationSettings } from '@/types/settings';
import { toast } from 'sonner';

export const useSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsAPI.getSettings,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const updateGeneralMutation = useMutation({
    mutationFn: settingsAPI.updateGeneralSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);
      toast.success('Paramètres généraux mis à jour avec succès');
      
      // Recharger la page si le mode maintenance a changé
      if (data.general?.maintenanceMode !== settings?.general?.maintenanceMode) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour des paramètres généraux:', error);
      toast.error('Erreur lors de la mise à jour des paramètres généraux');
    },
  });

  const updateNotificationMutation = useMutation({
    mutationFn: settingsAPI.updateNotificationSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);
      toast.success('Paramètres de notification mis à jour avec succès');
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour des paramètres de notification:', error);
      toast.error('Erreur lors de la mise à jour des paramètres de notification');
    },
  });

  const backupMutation = useMutation({
    mutationFn: settingsAPI.createManualBackup,
    onSuccess: (data) => {
      toast.success('Sauvegarde créée avec succès');
    },
    onError: (error) => {
      console.error('Erreur lors de la création de la sauvegarde:', error);
      toast.error('Erreur lors de la création de la sauvegarde');
    },
  });

  return {
    settings,
    isLoading,
    error,
    updateGeneralSettings: updateGeneralMutation.mutate,
    updateNotificationSettings: updateNotificationMutation.mutate,
    createManualBackup: backupMutation.mutate,
    isUpdatingGeneral: updateGeneralMutation.isPending,
    isUpdatingNotifications: updateNotificationMutation.isPending,
    isCreatingBackup: backupMutation.isPending,
  };
};
