
import { toast } from '@/hooks/use-toast';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationOptions {
  title: string;
  description?: string;
  type: NotificationType;
  duration?: number;
}

class NotificationService {
  private getNotificationStyle(type: NotificationType) {
    switch (type) {
      case 'success':
        return {
          className: "bg-green-500 text-white border-green-600 fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] shadow-lg",
          variant: 'default' as const
        };
      case 'error':
        return {
          className: "bg-red-500 text-white border-red-600 fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] shadow-lg",
          variant: 'destructive' as const
        };
      case 'warning':
        return {
          className: "bg-orange-500 text-white border-orange-600 fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] shadow-lg",
          variant: 'default' as const
        };
      case 'info':
      default:
        return {
          className: "bg-blue-500 text-white border-blue-600 fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] shadow-lg",
          variant: 'default' as const
        };
    }
  }

  show({ title, description, type, duration = 5000 }: NotificationOptions) {
    const style = this.getNotificationStyle(type);
    
    toast({
      title,
      description,
      ...style,
      duration
    });
  }

  success(title: string, description?: string) {
    this.show({ title, description, type: 'success' });
  }

  error(title: string, description?: string) {
    this.show({ title, description, type: 'error' });
  }

  warning(title: string, description?: string) {
    this.show({ title, description, type: 'warning' });
  }

  info(title: string, description?: string) {
    this.show({ title, description, type: 'info' });
  }

  // Messages spécifiques pour l'e-commerce
  welcome(userName: string) {
    this.success(`Bienvenue ${userName}`, "Ravi de vous revoir parmi nous !");
  }

  loginSuccess(userName: string) {
    this.success("Connexion réussie", `Bienvenue ${userName}`);
  }

  logoutSuccess() {
    this.info("Déconnexion réussie", "À bientôt !");
  }

  addToCart(productName: string) {
    this.success("Produit ajouté", `${productName} a été ajouté à votre panier`);
  }

  removeFromCart(productName: string) {
    this.info("Produit retiré", `${productName} a été retiré de votre panier`);
  }

  addToFavorites(productName: string) {
    this.success("Favoris", `${productName} ajouté à vos favoris`);
  }

  removeFromFavorites(productName: string) {
    this.info("Favoris", `${productName} retiré de vos favoris`);
  }

  orderPlaced(orderNumber: string) {
    this.success("Commande confirmée", `Votre commande ${orderNumber} a été validée`);
  }

  paymentSuccess() {
    this.success("Paiement réussi", "Votre paiement a été traité avec succès");
  }

  paymentError() {
    this.error("Erreur de paiement", "Le paiement n'a pas pu être traité");
  }

  profileUpdated() {
    this.success("Profil mis à jour", "Vos informations ont été sauvegardées");
  }

  passwordChanged() {
    this.success("Mot de passe modifié", "Votre mot de passe a été mis à jour");
  }

  emailSent() {
    this.success("Email envoyé", "Vérifiez votre boîte de réception");
  }

  formError(message: string = "Veuillez vérifier les informations saisies") {
    this.error("Erreur de formulaire", message);
  }

  networkError() {
    this.error("Erreur de connexion", "Vérifiez votre connexion internet");
  }

  accessDenied() {
    this.error("Accès refusé", "Vous n'avez pas les permissions nécessaires");
  }

  sessionExpired() {
    this.warning("Session expirée", "Veuillez vous reconnecter");
  }

  cookieConsent() {
    this.info("Cookies", "Nous utilisons des cookies pour améliorer votre expérience");
  }

  maintenanceMode() {
    this.warning("Maintenance", "Site en maintenance. Seuls les administrateurs peuvent se connecter");
  }

  stockInsufficient(available: number) {
    this.error("Stock insuffisant", `Seulement ${available} article(s) disponible(s)`);
  }

  promoCodeApplied(discount: number) {
    this.success("Code promo appliqué", `Réduction de ${discount}% accordée`);
  }

  promoCodeInvalid() {
    this.error("Code promo invalide", "Ce code n'existe pas ou a expiré");
  }
}

export const notificationService = new NotificationService();
