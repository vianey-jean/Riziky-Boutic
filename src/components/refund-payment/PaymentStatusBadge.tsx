/**
 * @file PaymentStatusBadge.tsx
 * @description Composant Badge pour afficher le statut d'un paiement de remboursement
 * avec des styles visuels distinctifs pour chaque état.
 * 
 * @component
 * @example
 * // Utilisation basique
 * <PaymentStatusBadge status="payé" />
 * 
 * // Avec animation pour le statut "payé"
 * <PaymentStatusBadge status="payé" isPaid={true} />
 * 
 * // Pour l'admin avec validation client
 * <PaymentStatusBadge status="payé" clientValidated={true} />
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight, CheckCircle } from 'lucide-react';

/**
 * Props pour le composant PaymentStatusBadge
 * @interface PaymentStatusBadgeProps
 */
interface PaymentStatusBadgeProps {
  /** Statut du paiement: 'debut', 'en cours', ou 'payé' */
  status: 'debut' | 'en cours' | 'payé' | string;
  /** Indique si le paiement est effectué mais non confirmé (active l'animation) */
  isPaid?: boolean;
  /** Indique si le client a validé la réception du paiement */
  clientValidated?: boolean;
}

/**
 * Affiche un badge coloré représentant le statut d'un paiement de remboursement.
 * - Début: Badge orange/ambre avec icône horloge
 * - En cours: Badge bleu/indigo avec icône flèche
 * - Payé: Badge vert/émeraude avec icône check (peut être animé)
 * - Confirmé par client: Badge vert solide (admin seulement)
 * 
 * @param {PaymentStatusBadgeProps} props - Les props du composant
 * @returns {JSX.Element} Un composant Badge stylisé
 */
const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ 
  status, 
  isPaid = false,
  clientValidated = false 
}) => {
  // Si le client a validé le paiement (vue admin)
  if (clientValidated) {
    return (
      <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg shadow-emerald-500/30 px-4 py-1">
        <CheckCircle className="w-3 h-3 mr-1" />
        Confirmé par client
      </Badge>
    );
  }

  // Rendu selon le statut
  switch (status) {
    case 'debut':
      return (
        <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg shadow-amber-500/30">
          <Clock className="w-3 h-3 mr-1" />
          Début
        </Badge>
      );
    case 'en cours':
      return (
        <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg shadow-blue-500/30">
          <ArrowRight className="w-3 h-3 mr-1" />
          En cours
        </Badge>
      );
    case 'payé':
      return (
        <Badge className={`bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg shadow-emerald-500/30 ${isPaid ? 'animate-pulse' : ''}`}>
          <CheckCircle className="w-3 h-3 mr-1" />
          Payé
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default PaymentStatusBadge;
