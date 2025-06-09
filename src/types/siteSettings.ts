
export interface SiteSettings {
  general: GeneralSettings;
  appearance: AppearanceSettings;
  ecommerce: EcommerceSettings;
  payment: PaymentSettings;
  shipping: ShippingSettings;
  notifications: NotificationSettings;
  seo: SEOSettings;
  security: SecuritySettings;
  system: SystemSettings;
}

export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  companyName: string;
  contactEmail: string;
  supportEmail: string;
  phone: string;
  address: string;
  language: string;
  currency: string;
  timezone: string;
}

export interface AppearanceSettings {
  theme: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  faviconUrl: string;
  bannerEnabled: boolean;
  bannerText: string;
  headerStyle: string;
  footerStyle: string;
}

export interface EcommerceSettings {
  taxRate: number;
  shippingFee: number;
  freeShippingThreshold: number;
  enableReviews: boolean;
  enableWishlist: boolean;
  enableCompare: boolean;
  stockManagement: boolean;
  autoReduceStock: boolean;
  lowStockThreshold: number;
  outOfStockBehavior: string;
}

export interface PaymentSettings {
  enableCreditCard: boolean;
  enablePaypal: boolean;
  enableBankTransfer: boolean;
  enableCash: boolean;
  stripeEnabled: boolean;
  stripePublicKey: string;
  paypalEnabled: boolean;
  paypalClientId: string;
}

export interface ShippingSettings {
  enableFreeShipping: boolean;
  enableExpressDelivery: boolean;
  expressDeliveryFee: number;
  estimatedDeliveryDays: number;
  enableInternationalShipping: boolean;
  internationalShippingFee: number;
}

export interface NotificationSettings {
  enableEmailNotifications: boolean;
  enableOrderConfirmation: boolean;
  enableShippingNotifications: boolean;
  enablePromotionalEmails: boolean;
  enableSmsNotifications: boolean;
  enablePushNotifications: boolean;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  googleAnalyticsId: string;
  facebookPixelId: string;
  enableSitemap: boolean;
  enableRobotsTxt: boolean;
}

export interface SecuritySettings {
  enableSSL: boolean;
  enableCaptcha: boolean;
  captchaSiteKey: string;
  enableTwoFactorAuth: boolean;
  sessionTimeout: number;
  passwordMinLength: number;
  enableLoginAttemptLimit: boolean;
  maxLoginAttempts: number;
}

export interface SystemSettings {
  registrationEnabled: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}
