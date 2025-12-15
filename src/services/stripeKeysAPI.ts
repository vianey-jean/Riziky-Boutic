/**
 * API pour la gestion sécurisée des clés Stripe
 */

import { apiClient } from './core/apiClient';

export interface StripeKeysStatus {
  hasPublicKey: boolean;
  hasSecretKey: boolean;
}

export const stripeKeysAPI = {
  /**
   * Sauvegarde la clé publique Stripe (sera cryptée côté serveur)
   */
  savePublicKey: async (publicKey: string): Promise<void> => {
    await apiClient.post('/stripe-keys/public', { publicKey });
  },

  /**
   * Sauvegarde la clé secrète Stripe (sera cryptée côté serveur)
   */
  saveSecretKey: async (secretKey: string): Promise<void> => {
    await apiClient.post('/stripe-keys/secret', { secretKey });
  },

  /**
   * Récupère la clé publique Stripe décryptée
   */
  getPublicKey: async (): Promise<string> => {
    const response = await apiClient.get('/stripe-keys/public');
    return response.data.publicKey || '';
  },

  /**
   * Vérifie si les clés sont configurées
   */
  getStatus: async (): Promise<StripeKeysStatus> => {
    const response = await apiClient.get('/stripe-keys/status');
    return response.data;
  }
};
