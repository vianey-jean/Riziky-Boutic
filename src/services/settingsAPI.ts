
import { API } from './apiConfig';
import { Settings, GeneralSettings, NotificationSettings } from '@/types/settings';

export const settingsAPI = {
  // Récupérer tous les paramètres
  getSettings: async (): Promise<Settings> => {
    const response = await API.get('/settings');
    return response.data;
  },

  // Mettre à jour tous les paramètres
  updateSettings: async (settings: Partial<Settings>): Promise<Settings> => {
    const response = await API.put('/settings', settings);
    return response.data;
  },

  // Mettre à jour les paramètres généraux
  updateGeneralSettings: async (settings: Partial<GeneralSettings>): Promise<Settings> => {
    const response = await API.put('/settings/general', settings);
    return response.data;
  },

  // Mettre à jour les paramètres de notification
  updateNotificationSettings: async (settings: Partial<NotificationSettings>): Promise<Settings> => {
    const response = await API.put('/settings/notifications', settings);
    return response.data;
  },

  // Créer une sauvegarde manuelle
  createManualBackup: async (): Promise<{ message: string; backup: any }> => {
    const response = await API.post('/settings/backup/manual');
    return response.data;
  }
};
