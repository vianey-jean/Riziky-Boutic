
import { apiClient } from './core/apiClient';
import { SiteSettings } from '@/types/siteSettings';

export const siteSettingsAPI = {
  // Récupérer tous les paramètres
  getSettings: async (): Promise<SiteSettings> => {
    const response = await apiClient.get('/site-settings');
    return response.data;
  },

  // Mettre à jour une section spécifique
  updateSection: async (section: string, data: any): Promise<void> => {
    await apiClient.put(`/site-settings/${section}`, data);
  },

  // Réinitialiser les paramètres
  resetSettings: async (): Promise<SiteSettings> => {
    const response = await apiClient.post('/site-settings/reset');
    return response.data.data;
  }
};
