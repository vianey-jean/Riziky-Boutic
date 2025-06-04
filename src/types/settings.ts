
export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  maxProductsPerPage: number;
  defaultCurrency: string;
  taxRate: number;
  shippingCost: number;
  freeShippingThreshold: number;
  contactEmail: string;
  supportPhone: string;
  socialMediaLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  seoSettings: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
  };
  analyticsSettings: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
  paymentSettings: {
    enableStripe: boolean;
    enablePayPal: boolean;
    enableCreditCard: boolean;
  };
  emailSettings: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
}

export interface NotificationSettings {
  emailNotifications: {
    newOrder: boolean;
    orderStatusChange: boolean;
    newUser: boolean;
    contactForm: boolean;
    lowStock: boolean;
    newReview: boolean;
    refundRequest: boolean;
    systemAlerts: boolean;
  };
  smsNotifications: {
    newOrder: boolean;
    orderStatusChange: boolean;
    systemAlerts: boolean;
  };
  pushNotifications: {
    newOrder: boolean;
    orderStatusChange: boolean;
    newUser: boolean;
    newReview: boolean;
    systemAlerts: boolean;
  };
  slackNotifications: {
    webhookUrl?: string;
    newOrder: boolean;
    systemAlerts: boolean;
    errorReports: boolean;
  };
  discordNotifications: {
    webhookUrl?: string;
    newOrder: boolean;
    systemAlerts: boolean;
    errorReports: boolean;
  };
}

export interface BackupSettings {
  autoBackup: boolean;
  backupInterval: 'daily' | 'weekly' | 'monthly';
  backupTime: string; // Format: "HH:MM"
  emailBackup: boolean;
  backupEmail: string;
  retentionDays: number;
}

export interface Settings {
  id: string;
  general: GeneralSettings;
  notifications: NotificationSettings;
  backup: BackupSettings;
  createdAt: string;
  updatedAt: string;
}
