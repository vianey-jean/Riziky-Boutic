import { apiClient } from './core/apiClient';

export interface PaymentModes {
  enableCreditCard: boolean;
  enablePaypal: boolean;
  enableBankTransfer: boolean;
  enableCash: boolean;
  enableApplePay: boolean;
  stripeEnabled: boolean;
  stripePublicKey: string;
  paypalEnabled: boolean;
  paypalClientId: string;
}

export const paymentModesAPI = {
  // Récupérer les modes de paiement activés
  getPaymentModes: async (): Promise<PaymentModes> => {
    const response = await apiClient.get('/payment-modes');
    return response.data.data;
  },

  // Mettre à jour les modes de paiement
  updatePaymentModes: async (paymentModes: PaymentModes): Promise<void> => {
    await apiClient.put('/payment-modes', paymentModes);
  }
};