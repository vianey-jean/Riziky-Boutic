
import { API } from './apiConfig';
import { PaiementRemboursement } from '@/types/paiementRemboursement';

export const paiementRemboursementAPI = {
  // Get all (admin only)
  getAll: () => API.get<PaiementRemboursement[]>('/paiement-remboursement'),
  
  // Get user's accepted refund payments
  getUserPaiements: () => API.get<PaiementRemboursement[]>('/paiement-remboursement/user'),
  
  // Get by ID
  getById: (id: string) => API.get<PaiementRemboursement>(`/paiement-remboursement/${id}`),
  
  // Update status (admin only)
  updateStatus: (id: string, status: string) => 
    API.put(`/paiement-remboursement/${id}/status`, { status }),
  
  // Client validates payment received
  validatePayment: (id: string) => 
    API.put(`/paiement-remboursement/${id}/validate`),
  
  // Check if user has accepted refunds
  hasAcceptedRefunds: () => 
    API.get<{ hasAcceptedRefunds: boolean }>('/paiement-remboursement/check'),
};
