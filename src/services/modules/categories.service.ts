
import { apiClient } from '../core/apiClient';
import { Category, CategoryFormData } from '@/types/category';

export const categoriesService = {
  getAll: () => apiClient.get<Category[]>('/categories'),
  getActive: () => apiClient.get<Category[]>('/categories/active'),
  getById: (id: string) => apiClient.get<Category>(`/categories/${id}`),
  create: (data: CategoryFormData) => apiClient.post<Category>('/categories', data),
  update: (id: string, data: Partial<CategoryFormData>) => apiClient.put<Category>(`/categories/${id}`, data),
  delete: (id: string) => apiClient.delete(`/categories/${id}`),
};
