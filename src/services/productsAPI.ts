
import { API } from './apiConfig';
import { Product } from '@/types/product';

export const productsAPI = {
  getAll: () => API.get<Product[]>('/products'),
  getById: (id: string) => API.get<Product>(`/products/${id}`),
  getByCategory: (category: string) => API.get<Product[]>(`/products/category/${category}`),
  getMostFavorited: () => API.get<Product[]>('/products/stats/most-favorited'),
  getNewArrivals: () => API.get<Product[]>('/products/stats/new-arrivals'),
  create: (product: FormData) => API.post<Product>('/products', product),
  update: (id: string, product: FormData) => API.put<Product>(`/products/${id}`, product),
  delete: (id: string) => API.delete(`/products/${id}`),
  applyPromotion: (id: string, promotion: number, duration: number) => 
    API.post(`/products/${id}/promotion`, { promotion, duration }),
  search: (query: string) => API.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}`),
};
