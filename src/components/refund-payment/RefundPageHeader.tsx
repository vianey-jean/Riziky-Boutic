/**
 * @file RefundPageHeader.tsx
 * @description En-tête premium pour les pages de paiement de remboursement
 * avec un design gradient et affichage du nombre de remboursements.
 * 
 * @component
 * @example
 * // En-tête pour la page client
 * <RefundPageHeader 
 *   title="Paiement Remboursement"
 *   subtitle="Suivez l'état de vos remboursements en temps réel"
 *   count={3}
 *   countLabel="remboursement"
 * />
 */

import React from 'react';
import { Banknote, Shield } from 'lucide-react';

/**
 * Props pour le composant RefundPageHeader
 * @interface RefundPageHeaderProps
 */
interface RefundPageHeaderProps {
  /** Titre principal de la page */
  title: string;
  /** Sous-titre ou description */
  subtitle: string;
  /** Nombre d'éléments à afficher */
  count: number;
  /** Label pour le compteur (singulier, sera pluralisé automatiquement) */
  countLabel: string;
}

/**
 * Affiche un en-tête premium avec un gradient coloré pour les pages
 * de gestion des remboursements.
 * 
 * Inclut:
 * - Une icône dans un cercle semi-transparent
 * - Le titre et sous-titre de la page
 * - Un compteur affichant le nombre total d'éléments
 * 
 * Design: Gradient émeraude/teal/cyan avec effets de transparence
 * 
 * @param {RefundPageHeaderProps} props - Les props du composant
 * @returns {JSX.Element} En-tête stylisé avec gradient
 */
const RefundPageHeader: React.FC<RefundPageHeaderProps> = ({
  title,
  subtitle,
  count,
  countLabel
}) => {
  // Pluralisation automatique du label
  const pluralizedLabel = count > 1 ? `${countLabel}s` : countLabel;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 mb-10 shadow-2xl">
      {/* Overlay décoratif */}
      <div className="absolute inset-0 opacity-50 bg-gradient-to-br from-white/5 to-transparent"></div>

      {/* Contenu de l'en-tête */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Section gauche: Icône et texte */}
        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
            <Banknote className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {title}
            </h1>
            <p className="text-white/80 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              {subtitle}
            </p>
          </div>
        </div>

        {/* Section droite: Compteur */}
        <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl">
          <div className="text-white/80 text-sm">Total en cours</div>
          <div className="text-3xl font-bold text-white">
            {count} {pluralizedLabel}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPageHeader;
