
import { API } from './apiConfig';
import { FlashSale, FlashSaleFormData } from '@/types/flashSale';
import { Product } from '@/types/product';

export const flashSaleAPI = {
  getActive: () => API.get<FlashSale>('/flash-sales/active'),
  getAll: () => API.get<FlashSale[]>('/flash-sales'),
  getById: (id: string) => API.get<FlashSale>(`/flash-sales/${id}`),
  getProducts: (id: string) => API.get<Product[]>(`/flash-sales/${id}/products`),
  // S'assurer que cet endpoint utilise bien l'API configurée et non un accès direct aux fichiers
  getBanniereProducts: () => {
    console.log('🌐 Appel API getBanniereProducts vers:', API.defaults.baseURL + '/flash-sales/banniere-products');
    return API.get<Product[]>('/flash-sales/banniere-products');
  },
  create: (data: FlashSaleFormData) => API.post<FlashSale>('/flash-sales', data),
  update: (id: string, data: Partial<FlashSaleFormData>) => API.put<FlashSale>(`/flash-sales/${id}`, data),
  delete: (id: string) => API.delete(`/flash-sales/${id}`),
  activate: (id: string) => API.post(`/flash-sales/${id}/activate`),
  deactivate: (id: string) => API.post(`/flash-sales/${id}/deactivate`),
};
