
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(price);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date));
}

export function getStatusColor(status: string): string {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'confirmée':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'en préparation':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'en livraison':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'livrée':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getStatusIcon(status: string): string {
  switch (status) {
    case 'confirmée':
      return '✓';
    case 'en préparation':
      return '🔧';
    case 'en livraison':
      return '🚚';
    case 'livrée':
      return '📦';
    default:
      return '?';
  }
}
