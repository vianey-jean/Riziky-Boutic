
import { API } from './apiConfig';
import { Remboursement, RemboursementFormData } from '@/types/remboursement';

export const remboursementsAPI = {
  getAll: () => API.get<Remboursement[]>('/remboursements'),
  getUserRemboursements: () => API.get<Remboursement[]>('/remboursements/user'),
  getById: (id: string) => API.get<Remboursement>(`/remboursements/${id}`),
  create: (remboursementData: RemboursementFormData) => {
    const formData = new FormData();
    formData.append('orderId', remboursementData.orderId);
    formData.append('reason', remboursementData.reason);
    
    if (remboursementData.customReason) {
      formData.append('customReason', remboursementData.customReason);
    }
    
    if (remboursementData.photo) {
      formData.append('photo', remboursementData.photo);
    }
    
    return API.post<Remboursement>('/remboursements', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  updateStatus: (id: string, status: string, comment?: string, decision?: string) => 
    API.put(`/remboursements/${id}/status`, { status, comment, decision }),
};
