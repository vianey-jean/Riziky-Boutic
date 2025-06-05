
import { API } from './apiConfig';

export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  defaultCurrency: string;
  defaultLanguage: string;
  timezone: string;
}

export interface SMTPSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  encryption: string;
}

export interface PaymentSettings {
  stripePublishableKey: string;
  stripeSecretKey: string;
  paypalClientId: string;
  paypalClientSecret: string;
  enableStripe: boolean;
  enablePaypal: boolean;
  enableCashOnDelivery: boolean;
}

export interface ShippingSettings {
  freeShippingThreshold: number;
  defaultShippingCost: number;
  shippingZones: any[];
  enableFreeShipping: boolean;
}

export interface SecuritySettings {
  enableTwoFactor: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  requirePasswordChange: boolean;
}

export interface BackupSettings {
  enableAutoBackup: boolean;
  backupTime: string;
  adminEmail: string;
  backupFrequency: string;
}

export interface NotificationSettings {
  orderNotifications: boolean;
  lowStockAlerts: boolean;
  newUserNotifications: boolean;
  systemAlerts: boolean;
}

export const settingsAPI = {
  // Public endpoint for checking maintenance mode (no auth required)
  getGeneralSettings: () => {
    // Use the new public route
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public-settings/general`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => ({ data }));
  },
  
  // Authenticated endpoints
  updateGeneralSettings: (settings: GeneralSettings) => API.put('/settings/general', settings),

  // Paramètres SMTP
  getSMTPSettings: () => API.get<SMTPSettings>('/settings/smtp'),
  updateSMTPSettings: (settings: SMTPSettings) => API.put('/settings/smtp', settings),
  testSMTPConnection: (settings: SMTPSettings) => API.post('/settings/smtp/test', settings),

  // Paramètres de paiement
  getPaymentSettings: () => API.get<PaymentSettings>('/settings/payment'),
  updatePaymentSettings: (settings: PaymentSettings) => API.put('/settings/payment', settings),

  // Paramètres de livraison
  getShippingSettings: () => API.get<ShippingSettings>('/settings/shipping'),
  updateShippingSettings: (settings: ShippingSettings) => API.put('/settings/shipping', settings),

  // Paramètres de sécurité
  getSecuritySettings: () => API.get<SecuritySettings>('/settings/security'),
  updateSecuritySettings: (settings: SecuritySettings) => API.put('/settings/security', settings),

  // Paramètres de sauvegarde
  getBackupSettings: () => API.get<BackupSettings>('/settings/backup'),
  updateBackupSettings: (settings: BackupSettings) => API.put('/settings/backup', settings),
  configureAutoBackup: (settings: BackupSettings) => API.post('/settings/backup/configure', settings),
  triggerManualBackup: () => API.post('/settings/backup/manual'),

  // Paramètres de notification
  getNotificationSettings: () => API.get<NotificationSettings>('/settings/notifications'),
  updateNotificationSettings: (settings: NotificationSettings) => API.put('/settings/notifications', settings),
};
