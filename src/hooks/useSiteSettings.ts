
import { useState, useEffect } from 'react';
import { siteSettingsAPI } from '@/services/siteSettingsAPI';
import { SiteSettings } from '@/types/siteSettings';
import { useToast } from '@/hooks/use-toast';

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await siteSettingsAPI.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (section: keyof SiteSettings, data: any) => {
    try {
      setSaving(true);
      await siteSettingsAPI.updateSection(section, data);
      
      // Mettre à jour les paramètres localement
      if (settings) {
        setSettings({
          ...settings,
          [section]: { ...settings[section], ...data }
        });
      }
      
      toast({
        title: "Succès",
        description: "Paramètres sauvegardés avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = async () => {
    try {
      setSaving(true);
      const data = await siteSettingsAPI.resetSettings();
      setSettings(data);
      toast({
        title: "Succès",
        description: "Paramètres réinitialisés avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de réinitialiser les paramètres",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    loading,
    saving,
    updateSection,
    resetSettings,
    reload: loadSettings
  };
};
