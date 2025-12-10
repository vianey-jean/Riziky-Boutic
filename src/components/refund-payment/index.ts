/**
 * @file index.ts
 * @description Point d'entrée pour les composants de paiement de remboursement.
 * Exporte tous les composants réutilisables pour la gestion des remboursements.
 * 
 * @example
 * // Import individuel
 * import { PaymentStatusBadge, RefundProgressBar } from '@/components/refund-payment';
 * 
 * // Import de tout
 * import * as RefundComponents from '@/components/refund-payment';
 */

// Badge de statut de paiement
export { default as PaymentStatusBadge } from './PaymentStatusBadge';

// Affichage du mode de paiement
export { 
  default as PaymentMethodDisplay,
  getPaymentMethodIcon,
  getPaymentMethodLabel 
} from './PaymentMethodDisplay';

// Barre de progression du remboursement
export { default as RefundProgressBar } from './RefundProgressBar';

// Notification flottante de paiement
export { default as RefundNotification } from './RefundNotification';

// Détails de la commande associée
export { default as RefundOrderDetails } from './RefundOrderDetails';

// État vide (aucun remboursement)
export { default as RefundEmptyState } from './RefundEmptyState';

// En-tête de page premium
export { default as RefundPageHeader } from './RefundPageHeader';

// Alerte de paiement effectué
export { default as RefundPaidAlert } from './RefundPaidAlert';
