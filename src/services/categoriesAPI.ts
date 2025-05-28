
import { API } from './apiConfig';
import { Category, CategoryFormData } from '@/types/category';

export const categoriesAPI = {
  getAll: () => API.get<Category[]>('/categories'),
  getActive: () => API.get<Category[]>('/categories/active'),
  getById: (id: string) => API.get<Category>(`/categories/${id}`),
  create: (data: CategoryFormData) => API.post<Category>('/categories', data),
  update: (id: string, data: Partial<CategoryFormData>) => API.put<Category>(`/categories/${id}`, data),
  delete: (id: string) => API.delete(`/categories/${id}`),
};
