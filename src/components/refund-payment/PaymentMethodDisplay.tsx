/**
 * @file PaymentMethodDisplay.tsx
 * @description Composant pour afficher le mode de paiement d'un remboursement
 * avec une icône appropriée et un libellé traduit en français.
 * 
 * @component
 * @example
 * // Affichage simple
 * <PaymentMethodDisplay method="card" />
 * 
 * // Affichage complet avec conteneur stylisé
 * <PaymentMethodDisplay method="paypal" showContainer={true} />
 */

import React from 'react';
import { CreditCard, Banknote } from 'lucide-react';

/**
 * Props pour le composant PaymentMethodDisplay
 * @interface PaymentMethodDisplayProps
 */
interface PaymentMethodDisplayProps {
  /** Code du mode de paiement: 'cash', 'card', 'paypal', 'apple_pay' */
  method: string;
  /** Affiche un conteneur stylisé autour du composant */
  showContainer?: boolean;
}

/**
 * Retourne l'icône appropriée pour un mode de paiement
 * @param {string} method - Code du mode de paiement
 * @returns {JSX.Element} Icône Lucide correspondante
 */
export const getPaymentMethodIcon = (method: string): JSX.Element => {
  switch (method) {
    case 'cash':
      return <Banknote className="h-5 w-5 text-emerald-500" />;
    default:
      return <CreditCard className="h-5 w-5 text-indigo-500" />;
  }
};

/**
 * Retourne le libellé traduit d'un mode de paiement
 * @param {string} method - Code du mode de paiement
 * @returns {string} Libellé en français
 */
export const getPaymentMethodLabel = (method: string): string => {
  switch (method) {
    case 'cash': return 'Paiement à la livraison';
    case 'card': return 'Carte bancaire';
    case 'paypal': return 'PayPal';
    case 'apple_pay': return 'Apple Pay';
    default: return method;
  }
};

/**
 * Affiche le mode de paiement d'un remboursement avec une icône et un libellé.
 * Peut être affiché de manière simple ou dans un conteneur stylisé.
 * 
 * Modes supportés:
 * - cash: Paiement à la livraison (icône billet)
 * - card: Carte bancaire (icône carte)
 * - paypal: PayPal (icône carte)
 * - apple_pay: Apple Pay (icône carte)
 * 
 * @param {PaymentMethodDisplayProps} props - Les props du composant
 * @returns {JSX.Element} Affichage du mode de paiement
 */
const PaymentMethodDisplay: React.FC<PaymentMethodDisplayProps> = ({ 
  method, 
  showContainer = true 
}) => {
  if (!showContainer) {
    return (
      <div className="flex items-center gap-2">
        {getPaymentMethodIcon(method)}
        <span>{getPaymentMethodLabel(method)}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900">
      <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-md">
        {getPaymentMethodIcon(method)}
      </div>
      <div>
        <h3 className="font-semibold">Mode de remboursement</h3>
        <p className="text-muted-foreground text-sm">
          {getPaymentMethodLabel(method)}
        </p>
      </div>
    </div>
  );
};

export default PaymentMethodDisplay;
