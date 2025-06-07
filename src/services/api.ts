
// Main API exports with backward compatibility
export { apiClient as API } from './core/apiClient';

// Service exports
export { authService as authAPI } from './modules/auth.service';
export { productsService as productsAPI } from './modules/products.service';
export { cartService as cartAPI } from './modules/cart.service';
export { ordersService as ordersAPI } from './modules/orders.service';
export { categoriesService as categoriesAPI } from './modules/categories.service';
export { flashSaleService as flashSaleAPI } from './modules/flashSale.service';

// Import cartService for legacy compatibility
import { cartService } from './modules/cart.service';

// Legacy compatibility exports
export { favoritesAPI } from './favoritesAPI';
export { reviewsAPI } from './reviewsAPI';
export { contactsAPI } from './contactsAPI';
export { adminChatAPI, clientChatAPI } from './chatAPI';
export { codePromosAPI, codePromoAPI } from './codePromosAPI';
export { remboursementsAPI } from './remboursementsAPI';

// Legacy panier alias
export const panierAPI = {
  get: (userId: string) => cartService.get(userId),
  addItem: (userId: string, productId: string, quantity: number = 1) => 
    cartService.addItem(userId, productId, quantity),
  updateItem: (userId: string, productId: string, quantity: number) => 
    cartService.updateItem(userId, productId, quantity),
  removeItem: (userId: string, productId: string) => 
    cartService.removeItem(userId, productId),
  clear: (userId: string) => cartService.clear(userId),
};

// Default export for backward compatibility
import { apiClient } from './core/apiClient';
export default apiClient;

// Type exports
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
