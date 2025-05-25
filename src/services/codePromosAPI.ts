
import { API } from './apiConfig';
import { CodePromo } from '@/types/codePromo';

export const codePromosAPI = {
  getAll: () => API.get<CodePromo[]>('/code-promos'),
  getById: (id: string) => API.get<CodePromo>(`/code-promos/${id}`),
  create: (data: { pourcentage: number, quantite: number, productId: string }) => 
    API.post<CodePromo>('/code-promos', data),
  update: (id: string, quantite: number) => API.put<CodePromo>(`/code-promos/${id}`, { quantite }),
  delete: (id: string) => API.delete(`/code-promos/${id}`),
  verify: (code: string, productId: string) => 
    API.post<{ valid: boolean, pourcentage?: number, message?: string }>('/code-promos/verify', { code, productId }),
  use: (code: string, productId: string) => 
    API.post<{ success: boolean, message: string }>('/code-promos/use', { code, productId }),
  searchProducts: (query: string) => 
    API.get<{ id: string, name: string, price: number, image: string }[]>(`/code-promos/products/search?query=${query}`)
};

export const codePromoAPI = codePromosAPI;
