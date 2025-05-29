
import { apiClient } from '../core/apiClient';
import { Cart } from '@/types/cart';

export const cartService = {
  get: (userId: string) => apiClient.get<Cart>(`/panier/${userId}`),
  addItem: (userId: string, productId: string, quantity: number = 1) => 
    apiClient.post(`/panier/${userId}/add`, { productId, quantity }),
  updateItem: (userId: string, productId: string, quantity: number) => 
    apiClient.put(`/panier/${userId}/update`, { productId, quantity }),
  removeItem: (userId: string, productId: string) => 
    apiClient.delete(`/panier/${userId}/remove/${productId}`),
  clear: (userId: string) => apiClient.delete(`/panier/${userId}/clear`),
};
