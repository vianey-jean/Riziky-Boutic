
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatage des prix conforme aux normes européennes (RGPD/DSA)
export function formatEuropeanPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(price);
}

// Formatage des dates conforme aux normes françaises/européennes
export function formatEuropeanDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date));
}

// Gestion des statuts de commande conforme aux obligations d'information UE
export function getOrderStatusDisplayColor(orderStatus: string): string {
  const normalizedOrderStatus = orderStatus.toLowerCase();
  switch (normalizedOrderStatus) {
    case 'confirmée':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'en préparation':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'en livraison':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'livrée':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'annulée':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'retournée':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

// Icônes de statut conformes aux standards UX européens
export function getOrderStatusIcon(orderStatus: string): string {
  switch (orderStatus.toLowerCase()) {
    case 'confirmée':
      return '✓';
    case 'en préparation':
      return '🔧';
    case 'en livraison':
      return '🚚';
    case 'livrée':
      return '📦';
    case 'annulée':
      return '❌';
    case 'retournée':
      return '↩️';
    default:
      return '?';
  }
}

// Validation des données personnelles conforme RGPD
export function validateEuropeanPersonalData(data: {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (data.nom && data.nom.length < 2) {
    errors.push('Le nom doit contenir au moins 2 caractères');
  }
  
  if (data.prenom && data.prenom.length < 2) {
    errors.push('Le prénom doit contenir au moins 2 caractères');
  }
  
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Format d\'email invalide');
  }
  
  if (data.telephone && !/^(\+33|0)[1-9](\d{8})$/.test(data.telephone.replace(/\s/g, ''))) {
    errors.push('Format de téléphone français invalide');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Calcul des délais de rétractation conforme au droit européen (14 jours)
export function calculateEuropeanWithdrawalPeriod(orderDate: string): {
  withdrawalDeadline: Date;
  daysRemaining: number;
  isWithdrawalPeriodActive: boolean;
} {
  const order = new Date(orderDate);
  const withdrawalDeadline = new Date(order);
  withdrawalDeadline.setDate(withdrawalDeadline.getDate() + 14);
  
  const today = new Date();
  const daysRemaining = Math.ceil((withdrawalDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    withdrawalDeadline,
    daysRemaining: Math.max(0, daysRemaining),
    isWithdrawalPeriodActive: daysRemaining > 0
  };
}
