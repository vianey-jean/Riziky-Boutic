/**
 * @file RefundEmptyState.tsx
 * @description Composant d'état vide affiché lorsqu'il n'y a pas de remboursements
 * à afficher, avec un design premium et un bouton d'action.
 * 
 * @component
 * @example
 * // État vide pour la page client
 * <RefundEmptyState 
 *   title="Aucun remboursement en attente"
 *   description="Vous n'avez pas de remboursement accepté en cours."
 *   actionLabel="Voir mes commandes"
 *   onAction={() => navigate('/commandes')}
 * />
 * 
 * // État vide pour la page admin
 * <RefundEmptyState 
 *   title="Aucun remboursement actif"
 *   description="Tous les remboursements ont été traités."
 *   showSearchHint={true}
 * />
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, Package } from 'lucide-react';

/**
 * Props pour le composant RefundEmptyState
 * @interface RefundEmptyStateProps
 */
interface RefundEmptyStateProps {
  /** Titre principal de l'état vide */
  title: string;
  /** Description ou message secondaire */
  description: string;
  /** Libellé du bouton d'action (optionnel) */
  actionLabel?: string;
  /** Callback appelé lors du clic sur le bouton d'action */
  onAction?: () => void;
  /** Affiche un indice pour utiliser la barre de recherche (admin) */
  showSearchHint?: boolean;
}

/**
 * Affiche un état vide stylisé avec un design premium (gradient sombre)
 * lorsqu'il n'y a pas de remboursements à afficher.
 * 
 * Inclut:
 * - Une icône centrale dans un cercle semi-transparent
 * - Un titre et une description
 * - Un bouton d'action optionnel
 * - Un indice de recherche optionnel (pour l'admin)
 * 
 * @param {RefundEmptyStateProps} props - Les props du composant
 * @returns {JSX.Element} Carte d'état vide avec design premium
 */
const RefundEmptyState: React.FC<RefundEmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  showSearchHint = false
}) => {
  return (
    <Card className="max-w-2xl mx-auto overflow-hidden border-0 shadow-2xl">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-12 text-center">
        {/* Icône centrale */}
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-full w-fit mx-auto mb-6">
          <Receipt className="h-16 w-16 text-white" />
        </div>

        {/* Titre */}
        <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>

        {/* Description */}
        <p className="text-white/70 mb-8">{description}</p>

        {/* Indice de recherche pour l'admin */}
        {showSearchHint && (
          <p className="text-white/50 text-sm mb-6">
            Utilisez la barre de recherche pour consulter l'historique.
          </p>
        )}

        {/* Bouton d'action optionnel */}
        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            className="bg-white text-slate-900 hover:bg-white/90 shadow-xl"
          >
            <Package className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default RefundEmptyState;
