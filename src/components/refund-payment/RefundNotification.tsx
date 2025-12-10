/**
 * @file RefundNotification.tsx
 * @description Composant de notification flottante pour alerter le client
 * qu'un remboursement a été payé et nécessite une confirmation.
 * 
 * @component
 * @example
 * // Afficher une notification de paiement effectué
 * <RefundNotification 
 *   paiement={paiementData}
 *   onDismiss={(id) => handleDismiss(id)}
 * />
 */

import React from 'react';
import { Bell, X } from 'lucide-react';
import { PaiementRemboursement } from '@/types/paiementRemboursement';

/**
 * Props pour le composant RefundNotification
 * @interface RefundNotificationProps
 */
interface RefundNotificationProps {
  /** Données du paiement de remboursement */
  paiement: PaiementRemboursement;
  /** Callback appelé lors de la fermeture de la notification */
  onDismiss: (id: string) => void;
}

/**
 * Affiche une notification flottante animée pour informer le client
 * qu'un remboursement a été payé et qu'il doit confirmer la réception.
 * 
 * La notification inclut:
 * - Une icône de cloche animée
 * - L'ID du remboursement
 * - L'ID de la commande associée
 * - Un message incitant à confirmer la réception
 * - Un bouton de fermeture
 * 
 * Style: Gradient vert/émeraude avec effet de rebond (bounce)
 * 
 * @param {RefundNotificationProps} props - Les props du composant
 * @returns {JSX.Element} Notification flottante stylisée
 */
const RefundNotification: React.FC<RefundNotificationProps> = ({ 
  paiement, 
  onDismiss 
}) => {
  return (
    <div
      className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white p-4 rounded-2xl shadow-2xl animate-bounce border-2 border-white/30 backdrop-blur-sm"
    >
      <div className="flex items-start gap-3">
        {/* Icône animée */}
        <div className="bg-white/20 p-2 rounded-full">
          <Bell className="w-5 h-5 animate-pulse" />
        </div>

        {/* Contenu de la notification */}
        <div className="flex-1">
          <p className="font-bold text-sm">🎉 Remboursement payé !</p>
          <p className="text-xs mt-1 text-white/90">
            Remboursement #{paiement.id}
          </p>
          <p className="text-xs text-white/90">
            Commande: {paiement.orderId}
          </p>
          <p className="text-xs mt-2 font-semibold text-yellow-200">
            ⚡ Veuillez confirmer la réception du paiement
          </p>
        </div>

        {/* Bouton de fermeture */}
        <button
          onClick={() => onDismiss(paiement.id)}
          className="text-white/70 hover:text-white transition-colors"
          aria-label="Fermer la notification"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default RefundNotification;
