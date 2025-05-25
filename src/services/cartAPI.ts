
import { API } from './apiConfig';
import { Cart } from '@/types/cart';

export const cartAPI = {
  get: (userId: string) => API.get<Cart>(`/panier/${userId}`),
  addItem: (userId: string, productId: string, quantity: number = 1) => 
    API.post(`/panier/${userId}/add`, { productId, quantity }),
  updateItem: (userId: string, productId: string, quantity: number) => 
    API.put(`/panier/${userId}/update`, { productId, quantity }),
  removeItem: (userId: string, productId: string) => 
    API.delete(`/panier/${userId}/remove/${productId}`),
  clear: (userId: string) => API.delete(`/panier/${userId}/clear`),
};
