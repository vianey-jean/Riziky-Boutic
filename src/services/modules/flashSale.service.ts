
import { apiClient } from '../core/apiClient';
import { FlashSale, FlashSaleFormData } from '@/types/flashSale';
import { Product } from '@/types/product';

export const flashSaleService = {
  getActive: () => apiClient.get<FlashSale>('/flash-sales/active'),
  getAll: () => apiClient.get<FlashSale[]>('/flash-sales'),
  getById: (id: string) => apiClient.get<FlashSale>(`/flash-sales/${id}`),
  getProducts: (id: string) => apiClient.get<Product[]>(`/flash-sales/${id}/products`),
  getBanniereProducts: () => {
    console.log('🌐 Appel API getBanniereProducts vers:', apiClient.defaults.baseURL + '/flash-sales/banniere-products');
    return apiClient.get<Product[]>('/flash-sales/banniere-products');
  },
  create: (data: FlashSaleFormData) => apiClient.post<FlashSale>('/flash-sales', data),
  update: (id: string, data: Partial<FlashSaleFormData>) => apiClient.put<FlashSale>(`/flash-sales/${id}`, data),
  delete: (id: string) => apiClient.delete(`/flash-sales/${id}`),
  activate: (id: string) => apiClient.post(`/flash-sales/${id}/activate`),
  deactivate: (id: string) => apiClient.post(`/flash-sales/${id}/deactivate`),
};
