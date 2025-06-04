import { toast } from 'sonner';

interface NotificationData {
  type: 'refundRequest' | 'newOrder' | 'newUser' | 'contactForm' | 'newReview' | 'systemAlert';
  title: string;
  message: string;
  data?: any;
  timestamp?: string;
}

class NotificationsService {
  private static instance: NotificationsService;
  private notificationQueue: NotificationData[] = [];

  static getInstance(): NotificationsService {
    if (!NotificationsService.instance) {
      NotificationsService.instance = new NotificationsService();
    }
    return NotificationsService.instance;
  }

  // Envoyer une notification admin
  async sendAdminNotification(notification: NotificationData) {
    try {
      // Vérifier si la notification est activée dans les paramètres
      const settings = await this.getNotificationSettings();
      
      if (this.isNotificationEnabled(notification.type, settings)) {
        // Afficher la notification dans l'interface admin
        this.showUINotification(notification);
        
        // Ajouter à la queue pour persistance
        this.notificationQueue.push({
          ...notification,
          timestamp: new Date().toISOString()
        });
        
        console.log('Notification admin envoyée:', notification);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
    }
  }

  // Vérifier si une notification est activée
  private isNotificationEnabled(type: string, settings: any): boolean {
    if (!settings?.notifications) return false;
    
    switch (type) {
      case 'refundRequest':
        return settings.notifications.emailNotifications?.refundRequest || false;
      case 'newOrder':
        return settings.notifications.emailNotifications?.newOrder || false;
      case 'newUser':
        return settings.notifications.emailNotifications?.newUser || false;
      case 'contactForm':
        return settings.notifications.emailNotifications?.contactForm || false;
      case 'newReview':
        return settings.notifications.emailNotifications?.newReview || false;
      case 'systemAlert':
        return settings.notifications.emailNotifications?.systemAlerts || false;
      default:
        return false;
    }
  }

  // Afficher la notification dans l'UI
  private showUINotification(notification: NotificationData) {
    const iconMap = {
      refundRequest: '💰',
      newOrder: '🛒',
      newUser: '👤',
      contactForm: '📧',
      newReview: '⭐',
      systemAlert: '⚠️'
    };

    toast.success(`${iconMap[notification.type]} ${notification.title}`, {
      description: notification.message,
      duration: 5000,
    });
  }

  // Récupérer les paramètres de notification
  private async getNotificationSettings() {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres:', error);
    }
    return null;
  }

  // Méthodes utilitaires pour différents types de notifications
  notifyRefundRequest(orderId: string, amount: number) {
    this.sendAdminNotification({
      type: 'refundRequest',
      title: 'Nouvelle demande de remboursement',
      message: `Demande de remboursement de ${amount}€ pour la commande #${orderId}`,
      data: { orderId, amount }
    });
  }

  notifyNewOrder(orderId: string, customerName: string, amount: number) {
    this.sendAdminNotification({
      type: 'newOrder',
      title: 'Nouvelle commande',
      message: `Commande #${orderId} de ${customerName} - ${amount}€`,
      data: { orderId, customerName, amount }
    });
  }

  notifyNewUser(userName: string, email: string) {
    this.sendAdminNotification({
      type: 'newUser',
      title: 'Nouvel utilisateur',
      message: `${userName} (${email}) s'est inscrit`,
      data: { userName, email }
    });
  }

  notifyContactForm(name: string, subject: string) {
    this.sendAdminNotification({
      type: 'contactForm',
      title: 'Nouveau message de contact',
      message: `Message de ${name}: ${subject}`,
      data: { name, subject }
    });
  }

  notifyNewReview(productName: string, rating: number, customerName: string) {
    this.sendAdminNotification({
      type: 'newReview',
      title: 'Nouvel avis client',
      message: `${customerName} a laissé un avis ${rating}⭐ sur ${productName}`,
      data: { productName, rating, customerName }
    });
  }

  notifySystemAlert(message: string) {
    this.sendAdminNotification({
      type: 'systemAlert',
      title: 'Alerte système',
      message,
      data: { timestamp: new Date().toISOString() }
    });
  }

  // Obtenir les notifications en attente
  getPendingNotifications(): NotificationData[] {
    return this.notificationQueue;
  }

  // Marquer les notifications comme lues
  markAsRead(count: number = this.notificationQueue.length) {
    this.notificationQueue.splice(0, count);
  }
}

export const notificationsService = NotificationsService.getInstance();
export default notificationsService;
