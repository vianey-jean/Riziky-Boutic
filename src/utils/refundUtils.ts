/**
 * @file refundUtils.ts
 * @description Utilitaires partagés pour la gestion des paiements de remboursement.
 * Contient les fonctions de formatage et de calcul communes aux pages client et admin.
 * 
 * @module refund-payment
 */

/**
 * Formate un montant en devise EUR selon le format français
 * 
 * @param {number} amount - Montant à formater
 * @returns {string} Montant formaté (ex: "50,00 €")
 * 
 * @example
 * formatCurrency(99.99) // "99,99 €"
 * formatCurrency(0) // "0,00 €"
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount || 0);
};

/**
 * Formate une date ISO en format français lisible avec heure
 * 
 * @param {string} dateString - Date au format ISO
 * @returns {string} Date formatée (ex: "09 décembre 2025, 14:30")
 * 
 * @example
 * formatDate("2025-12-09T13:24:43.479Z") // "09 décembre 2025, 13:24"
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formate une date ISO en format court
 * 
 * @param {string} dateString - Date au format ISO
 * @returns {string} Date formatée courte (ex: "09/12/2025")
 * 
 * @example
 * formatDateShort("2025-12-09T13:24:43.479Z") // "09/12/2025"
 */
export const formatDateShort = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Calcule les statistiques des paiements de remboursement
 * 
 * @param {Array} paiements - Liste des paiements
 * @returns {Object} Statistiques calculées
 * 
 * @example
 * const stats = calculateRefundStats(paiements);
 * console.log(stats.totalAmount); // Montant total
 * console.log(stats.paidCount);   // Nombre de paiements effectués
 */
export interface RefundStats {
  totalAmount: number;
  paidCount: number;
  inProgressCount: number;
  pendingCount: number;
  confirmedCount: number;
}

export const calculateRefundStats = (
  paiements: Array<{ status: string; order?: { totalAmount?: number }; clientValidated?: boolean }>,
  allPaiements?: Array<{ clientValidated?: boolean }>
): RefundStats => {
  return {
    totalAmount: paiements.reduce((sum, p) => sum + (p.order?.totalAmount || 0), 0),
    paidCount: paiements.filter(p => p.status === 'payé').length,
    inProgressCount: paiements.filter(p => p.status === 'en cours').length,
    pendingCount: paiements.filter(p => p.status === 'debut').length,
    confirmedCount: allPaiements 
      ? allPaiements.filter(p => p.clientValidated).length 
      : paiements.filter(p => p.clientValidated).length
  };
};
