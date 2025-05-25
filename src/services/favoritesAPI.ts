
import { API } from './apiConfig';
import { Favorites } from '@/types/favorites';

export const favoritesAPI = {
  get: (userId: string) => API.get<Favorites>(`/favorites/${userId}`),
  addItem: (userId: string, productId: string) => 
    API.post(`/favorites/${userId}/add`, { productId }),
  removeItem: (userId: string, productId: string) => 
    API.delete(`/favorites/${userId}/remove/${productId}`),
};
