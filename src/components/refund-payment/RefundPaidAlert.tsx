/**
 * @file RefundPaidAlert.tsx
 * @description Alerte animée affichée dans une carte de remboursement
 * lorsque le paiement a été effectué mais pas encore confirmé par le client.
 * 
 * @component
 * @example
 * <RefundPaidAlert />
 */

import React from 'react';
import { Bell } from 'lucide-react';

/**
 * Affiche une alerte visuelle animée informant le client
 * qu'un remboursement a été payé et nécessite une confirmation.
 * 
 * Design:
 * - Fond gradient vert clair avec bordure
 * - Animation de pulsation (pulse)
 * - Icône de cloche animée (bounce)
 * - Message d'action en gras
 * 
 * Cette alerte est typiquement affichée en haut d'une carte de remboursement
 * lorsque le statut est "payé" mais que clientValidated est false.
 * 
 * @returns {JSX.Element} Alerte stylisée et animée
 */
const RefundPaidAlert: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-300 dark:border-green-800 rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-3">
        {/* Icône animée */}
        <div className="bg-green-500 p-2 rounded-full">
          <Bell className="h-5 w-5 text-white animate-bounce" />
        </div>

        {/* Message */}
        <div>
          <p className="font-bold text-green-700 dark:text-green-400">
            🎉 Votre remboursement a été payé !
          </p>
          <p className="text-sm text-green-600 dark:text-green-500">
            Veuillez confirmer la réception du paiement en cliquant sur le bouton ci-dessus.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPaidAlert;
