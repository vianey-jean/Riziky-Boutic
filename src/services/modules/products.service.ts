
import { apiClient } from '../core/apiClient';
import { Product } from '@/types/product';

export const productsService = {
  getAll: () => apiClient.get<Product[]>('/products'),
  getById: (id: string) => apiClient.get<Product>(`/products/${id}`),
  getByCategory: (category: string) => apiClient.get<Product[]>(`/products/category/${category}`),
  getMostFavorited: () => apiClient.get<Product[]>('/products/stats/most-favorited'),
  getNewArrivals: () => apiClient.get<Product[]>('/products/stats/new-arrivals'),
  create: (product: FormData) => apiClient.post<Product>('/products', product),
  update: (id: string, product: FormData) => apiClient.put<Product>(`/products/${id}`, product),
  delete: (id: string) => apiClient.delete(`/products/${id}`),
  applyPromotion: (id: string, promotion: number, duration: number) => 
    apiClient.post(`/products/${id}/promotion`, { promotion, duration }),
  search: (query: string) => apiClient.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}`),
};
