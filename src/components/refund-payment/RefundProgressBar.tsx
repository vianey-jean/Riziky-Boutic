/**
 * @file RefundProgressBar.tsx
 * @description Barre de progression premium pour visualiser l'avancement
 * d'un remboursement à travers ses différentes étapes.
 * 
 * @component
 * @example
 * // Affichage de la progression pour un remboursement en cours
 * <RefundProgressBar status="en cours" />
 * 
 * // Affichage d'un remboursement payé
 * <RefundProgressBar status="payé" />
 */

import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Props pour le composant RefundProgressBar
 * @interface RefundProgressBarProps
 */
interface RefundProgressBarProps {
  /** Statut actuel du remboursement: 'debut', 'en cours', ou 'payé' */
  status: 'debut' | 'en cours' | 'payé' | string;
}

/**
 * Affiche une barre de progression visuelle pour le suivi d'un remboursement.
 * La barre est divisée en 3 sections colorées correspondant aux étapes:
 * - Début (orange/ambre)
 * - En cours (bleu)
 * - Payé (vert/émeraude)
 * 
 * Chaque section s'illumine progressivement selon le statut actuel.
 * Les labels sous la barre indiquent également le statut avec une couleur appropriée.
 * 
 * @param {RefundProgressBarProps} props - Les props du composant
 * @returns {JSX.Element} Barre de progression stylisée
 */
const RefundProgressBar: React.FC<RefundProgressBarProps> = ({ status }) => {
  // Détermination des étapes actives selon le statut
  const isDebut = status === 'debut' || status === 'en cours' || status === 'payé';
  const isEnCours = status === 'en cours' || status === 'payé';
  const isPaye = status === 'payé';

  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 p-6 rounded-2xl">
      {/* En-tête avec titre et icône */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Progression du remboursement
        </span>
      </div>

      {/* Barre de progression en 3 sections */}
      <div className="flex items-center gap-1">
        {/* Section 1: Début */}
        <div className={`flex-1 h-3 rounded-l-full transition-all duration-500 ${
          isDebut 
            ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg shadow-amber-500/30' 
            : 'bg-muted'
        }`} />

        {/* Section 2: En cours */}
        <div className={`flex-1 h-3 transition-all duration-500 ${
          isEnCours 
            ? 'bg-gradient-to-r from-blue-400 to-blue-500 shadow-lg shadow-blue-500/30' 
            : 'bg-muted'
        }`} />

        {/* Section 3: Payé */}
        <div className={`flex-1 h-3 rounded-r-full transition-all duration-500 ${
          isPaye 
            ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-500/30' 
            : 'bg-muted'
        }`} />
      </div>

      {/* Labels des étapes */}
      <div className="flex justify-between text-xs text-muted-foreground mt-3 font-medium">
        <span className={isDebut ? 'text-amber-600 dark:text-amber-400' : ''}>
          Début
        </span>
        <span className={isEnCours ? 'text-blue-600 dark:text-blue-400' : ''}>
          En cours
        </span>
        <span className={isPaye ? 'text-emerald-600 dark:text-emerald-400' : ''}>
          Payé
        </span>
      </div>
    </div>
  );
};

export default RefundProgressBar;
