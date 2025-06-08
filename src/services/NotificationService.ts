
import { toast } from '@/components/ui/sonner';

export const notificationService = {
  success: (title: string, message?: string) => {
    toast.success(title, {
      description: message,
      duration: 3000,
    });
  },

  error: (title: string, message?: string) => {
    toast.error(title, {
      description: message,
      duration: 4000,
    });
  },

  addToCart: (productName: string) => {
    toast.success("Produit ajouté", {
      description: `${productName} a été ajouté à votre panier`,
      duration: 2000,
    });
  },

  addToFavorites: (productName: string) => {
    toast.success("Favori ajouté", {
      description: `${productName} a été ajouté à vos favoris`,
      duration: 2000,
    });
  },

  removeFromFavorites: (productName: string) => {
    toast.success("Favori retiré", {
      description: `${productName} a été retiré de vos favoris`,
      duration: 2000,
    });
  },
};
