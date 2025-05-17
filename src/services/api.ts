
import axios from 'axios';
import _ from 'lodash';

// 🔁 URL de base récupérée depuis le .env
const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Créer une instance axios avec la configuration de base
const API = axios.create({
  baseURL: `${AUTH_BASE_URL}/api`, // Utilisation correcte de la template string
  timeout: 10000, // Timeout plus long pour éviter les erreurs de connexion
});

// Ajouter un intercepteur pour inclure le token d'authentification
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Ajout d'un timestamp pour éviter les problèmes de cache
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Ajouter un intercepteur pour gérer les erreurs globalement
API.interceptors.response.use(
  response => response,
  error => {
    // Log de l'erreur pour le débogage
    console.error("API Error:", error.response || error);
    
    // Si l'erreur est 401 (non autorisé) et que ce n'est pas une tentative de connexion
    if (error.response && error.response.status === 401 && 
        !error.config.url.includes('/auth/login') && 
        !error.config.url.includes('/auth/verify-token')) {
      // Essayer de rafraîchir le token ou rediriger vers la page de connexion
      console.log("Session expirée, redirection vers la page de connexion...");
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Interface Auth
export interface AuthResponse {
  user: User;
  token: string;
}

export interface User {
  id: string;
  nom: string;
  prenom?: string;
  email: string;
  role: 'admin' | 'client';
  dateCreation: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
  telephone?: string;
  genre?: 'homme' | 'femme' | 'autre';
  passwordUnique?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nom: string;
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  passwordUnique: string;
  newPassword: string;
}

export interface UpdateProfileData {
  nom?: string;
  prenom?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
  telephone?: string;
  genre?: 'homme' | 'femme' | 'autre';
}

// Services d'authentification
export const authAPI = {
  login: (data: LoginData) => API.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterData) => API.post<AuthResponse>('/auth/register', data),
  forgotPassword: (email: string) => API.post('/auth/forgot-password', { email }),
  resetPassword: (data: ResetPasswordData) => API.post('/auth/reset-password', data),
  verifyToken: () => API.get('/auth/verify-token'),
  checkEmail: (email: string) => API.post('/auth/check-email', { email }),
  updateProfile: (userId: string, data: UpdateProfileData) => API.put(`/users/${userId}`, data),
  updatePassword: (userId: string, currentPassword: string, newPassword: string) => 
    API.put(`/users/${userId}/password`, { currentPassword, newPassword }),
  resetPasswordWithTempCode: (userId: string, passwordUnique: string, newPassword: string) =>
    API.put(`/users/${userId}/password`, { passwordUnique, newPassword }),
  getUserProfile: (userId: string) => API.get(`/users/${userId}`),
  verifyPassword: (userId: string, password: string) => 
    API.post(`/users/${userId}/verify-password`, { password }),
  setTempPassword: (userId: string, passwordUnique: string) =>
    API.put(`/users/${userId}/temp-password`, { passwordUnique }),
};

// Interface Produit
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string; // Maintenu pour compatibilité
  images?: string[]; // Nouveau tableau d'images
  category: string;
  isSold: boolean;
  originalPrice?: number;
  promotion?: number | null;
  promotionEnd?: string | null;
  stock?: number;
  dateAjout?: string;
}

// Services pour les produits
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

// Interface Review (Commentaire)
export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  productRating: number;
  deliveryRating: number;
  comment: string;
  photos?: string[]; // Nouveau champ pour les photos
  createdAt: string;
  updatedAt: string;
}

// Interface pour l'ajout de commentaire avec photos
export interface ReviewFormData {
  productId: string;
  productRating: number;
  deliveryRating: number;
  comment: string;
  photos?: File[];
}

// Services pour les commentaires
export const reviewsAPI = {
  getProductReviews: (productId: string) => API.get<Review[]>(`/reviews/product/${productId}`),
  getReviewDetail: (reviewId: string) => API.get<Review>(`/reviews/${reviewId}`),
  addReview: (reviewData: ReviewFormData) => {
    const formData = new FormData();
    formData.append('productId', reviewData.productId);
    formData.append('productRating', reviewData.productRating.toString());
    formData.append('deliveryRating', reviewData.deliveryRating.toString());
    
    if (reviewData.comment) {
      formData.append('comment', reviewData.comment);
    }
    
    if (reviewData.photos && reviewData.photos.length > 0) {
      reviewData.photos.forEach(photo => {
        formData.append('photos', photo);
      });
    }
    
    return API.post<Review>('/reviews', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  deleteReview: (reviewId: string) => API.delete(`/reviews/${reviewId}`),
};

// Interface Contact
export interface Contact {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  objet: string;
  message: string;
  dateCreation: string;
  read: boolean;
}

// Services pour les contacts
export const contactsAPI = {
  getAll: () => API.get<Contact[]>('/contacts'),
  getById: (id: string) => API.get<Contact>(`/contacts/${id}`),
  create: (contact: any) => API.post<Contact>('/contacts', contact),
  update: (id: string, data: any) => API.put<Contact>(`/contacts/${id}`, data),
  delete: (id: string) => API.delete(`/contacts/${id}`),
  markAsRead: (id: string, read: boolean) => API.put<Contact>(`/contacts/${id}`, { read }),
};

// Interface Panier
export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}

// Services pour le panier
export const panierAPI = {
  get: (userId: string) => API.get<Cart>(`/panier/${userId}`),
  addItem: (userId: string, productId: string, quantity: number = 1) => 
    API.post(`/panier/${userId}/add`, { productId, quantity }),
  updateItem: (userId: string, productId: string, quantity: number) => 
    API.put(`/panier/${userId}/update`, { productId, quantity }),
  removeItem: (userId: string, productId: string) => 
    API.delete(`/panier/${userId}/remove/${productId}`),
  clear: (userId: string) => API.delete(`/panier/${userId}/clear`),
};

// Interface Favoris
export interface Favorites {
  userId: string;
  items: Product[];
}

// Services pour les favoris
export const favoritesAPI = {
  get: (userId: string) => API.get<Favorites>(`/favorites/${userId}`),
  addItem: (userId: string, productId: string) => 
    API.post(`/favorites/${userId}/add`, { productId }),
  removeItem: (userId: string, productId: string) => 
    API.delete(`/favorites/${userId}/remove/${productId}`),
};

// Interface Adresse de livraison
export interface ShippingAddress {
  nom: string;
  prenom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  telephone: string;
}

// Interface Commande
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  images?: string[]; // Support pour multiples images
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  status: 'confirmée' | 'en préparation' | 'en livraison' | 'livrée';
  createdAt: string;
  updatedAt: string;
}

// Services pour les commandes
export const ordersAPI = {
  getAll: () => API.get<Order[]>('/orders'),
  getUserOrders: () => API.get<Order[]>('/orders/user'),
  getById: (orderId: string) => API.get<Order>(`/orders/${orderId}`),
  create: (orderData: any) => API.post<Order>('/orders', orderData),
  updateStatus: (orderId: string, status: string) => 
    API.put(`/orders/${orderId}/status`, { status }),
};

// Interface pour les messages
export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
  isAutoReply?: boolean;
  isEdited?: boolean;
  isAdminReply?: boolean;
  isSystemMessage?: boolean;
}

// Interface pour les conversations admin
export interface Conversation {
  messages: Message[];
  participants: string[];
}

// Interface pour les conversations client-service
export interface ServiceConversation extends Conversation {
  type: 'service';
  clientInfo?: User;
  unreadCount?: number;
}

// Services pour le chat entre administrateurs
export const adminChatAPI = {
  getAdmins: () => API.get('/admin-chat/admins'),
  getConversations: () => API.get('/admin-chat/conversations'),
  getConversation: (adminId: string) => API.get(`/admin-chat/conversations/${adminId}`),
  sendMessage: (adminId: string, message: string) => 
    API.post(`/admin-chat/conversations/${adminId}`, { message }),
  markAsRead: (messageId: string, conversationId: string) => 
    API.put(`/admin-chat/messages/${messageId}/read`, { conversationId }),
  setOnline: () => API.post('/admin-chat/online'),
  setOffline: () => API.post('/admin-chat/offline'),
  getStatus: (adminId: string) => API.get(`/admin-chat/status/${adminId}`),
  editMessage: (messageId: string, content: string, conversationId: string) => 
    API.put(`/admin-chat/messages/${messageId}/edit`, { content, conversationId }),
  deleteMessage: (messageId: string, conversationId: string) => 
    API.delete(`/admin-chat/messages/${messageId}?conversationId=${conversationId}`),
};

// Services pour le chat entre clients et service client
export const clientChatAPI = {
  // Gestion de statut
  setOnline: () => API.post('/client-chat/online'),
  setOffline: () => API.post('/client-chat/offline'),
  getStatus: (userId: string) => API.get(`/client-chat/status/${userId}`),
  
  // Pour les clients
  getServiceAdmins: () => API.get('/client-chat/service-admins'),
  getServiceChat: () => API.get('/client-chat/service'),
  sendServiceMessage: (message: string) => API.post('/client-chat/service/message', { message }),
  
  // Pour les admins (service client)
  getServiceConversations: () => API.get('/client-chat/admin/service'),
  sendServiceReply: (conversationId: string, message: string) => 
    API.post(`/client-chat/admin/service/${conversationId}/reply`, { message }),
  
  // Opérations communes sur les messages
  editMessage: (messageId: string, content: string, conversationId: string) => 
    API.put(`/client-chat/messages/${messageId}`, { content, conversationId }),
  deleteMessage: (messageId: string, conversationId: string) => 
    API.delete(`/client-chat/messages/${messageId}?conversationId=${conversationId}`),
  markAsRead: (messageId: string, conversationId: string) => 
    API.put(`/client-chat/messages/${messageId}/read`, { conversationId })
};

export default API;
