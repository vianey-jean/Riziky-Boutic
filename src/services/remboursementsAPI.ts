
import { API } from './apiConfig';
import { Remboursement, RemboursementFormData } from '@/types/remboursement';
import notificationsService from './notificationsService';

export const remboursementsAPI = {
  getAll: async (): Promise<Remboursement[]> => {
    const response = await API.get('/remboursements');
    return response.data;
  },

  getById: async (id: string): Promise<Remboursement> => {
    const response = await API.get(`/remboursements/${id}`);
    return response.data;
  },

  getUserRemboursements: async (userId: string): Promise<Remboursement[]> => {
    const response = await API.get('/remboursements');
    const allRemboursements = response.data;
    return allRemboursements.filter((r: Remboursement) => r.userId === userId);
  },

  create: async (formData: RemboursementFormData): Promise<Remboursement> => {
    // Convertir RemboursementFormData en FormData
    const multipartFormData = new FormData();
    multipartFormData.append('orderId', formData.orderId);
    multipartFormData.append('reason', formData.reason);
    
    if (formData.customReason) {
      multipartFormData.append('customReason', formData.customReason);
    }
    
    if (formData.reasonDetails) {
      multipartFormData.append('reasonDetails', formData.reasonDetails);
    }
    
    if (formData.photo) {
      multipartFormData.append('photo', formData.photo);
    }

    if (formData.photos) {
      formData.photos.forEach((photo, index) => {
        multipartFormData.append('photos', photo);
      });
    }

    const response = await API.post('/remboursements', multipartFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Envoyer notification admin pour nouvelle demande de remboursement
    const refund = response.data;
    if (refund) {
      notificationsService.notifyRefundRequest(
        refund.orderId || 'N/A',
        refund.amount || 0
      );
    }

    return response.data;
  },

  updateStatus: async (id: string, status: string, adminComment?: string): Promise<Remboursement> => {
    const response = await API.put(`/remboursements/${id}/status`, {
      status,
      adminComment,
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await API.delete(`/remboursements/${id}`);
  },
};
