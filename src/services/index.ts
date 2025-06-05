// Export all API services
export { authAPI } from './authAPI';
export { productsAPI } from './productsAPI';
export { cartAPI } from './cartAPI';
export { favoritesAPI } from './favoritesAPI';
export { ordersAPI } from './ordersAPI';
export { reviewsAPI } from './reviewsAPI';
export { contactsAPI } from './contactsAPI';
export { adminChatAPI, clientChatAPI } from './chatAPI';
export { codePromosAPI, codePromoAPI } from './codePromosAPI';
export { remboursementsAPI } from './remboursementsAPI';
export { flashSaleAPI } from './flashSaleAPI';
export { categoriesAPI } from './categoriesAPI';

// Export API configuration
export { API } from './apiConfig';

// Re-export types for convenience
export type { Product } from '@/types/product';
export type { User, AuthResponse, LoginData, RegisterData, UpdateProfileData } from '@/types/auth';
export type { Cart, CartItem, StoreCartItem } from '@/types/cart';
export type { Order, OrderItem, ShippingAddress } from '@/types/order';
export type { Review, ReviewFormData } from '@/types/review';
export type { Contact } from '@/types/contact';
export type { Favorites } from '@/types/favorites';
export type { CodePromo } from '@/types/codePromo';
export type { Remboursement, RemboursementFormData } from '@/types/remboursement';
export type { Message, Conversation, ServiceConversation } from '@/types/chat';
export type { FlashSale, FlashSaleFormData } from '@/types/flashSale';
export type { Category, CategoryFormData } from '@/types/category';

// Legacy compatibility - keep the old api.ts exports working
import { cartAPI } from './cartAPI';

export const panierAPI = {
  get: (userId: string) => cartAPI.get(userId),
  addItem: (userId: string, productId: string, quantity: number = 1) => 
    cartAPI.addItem(userId, productId, quantity),
  updateItem: (userId: string, productId: string, quantity: number) => 
    cartAPI.updateItem(userId, productId, quantity),
  removeItem: (userId: string, productId: string) => 
    cartAPI.removeItem(userId, productId),
  clear: (userId: string) => cartAPI.clear(userId),
};
