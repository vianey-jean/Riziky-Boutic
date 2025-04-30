
import axios from 'axios';

// Créer une instance axios avec la configuration de base
const API = axios.create({
  baseURL: 'https://riziky-boutic-server.onrender.com/api',
});

// Ajouter un intercepteur pour inclure le token d'authentification
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
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
  code: string;
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
  getUserProfile: (userId: string) => API.get(`/users/${userId}`),
};

// Interface Produit
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
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

// Interface Commande
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    nom: string;
    prenom: string;
    adresse: string;
    ville: string;
    codePostal: string;
    pays: string;
    telephone: string;
  };
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
  updateStatus: (orderId: string, status: 'confirmée' | 'en préparation' | 'en livraison' | 'livrée') => 
    API.put(`/orders/${orderId}/status`, { status }),
};

// Interface Admin Chat
export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  messages: Message[];
  participants: string[];
}

export const adminChatAPI = {
  getAdmins: () => API.get('/admin-chat/admins'),
  getConversations: () => API.get('/admin-chat/conversations'),
  getConversation: (adminId: string) => API.get(`/admin-chat/conversations/${adminId}`),
  sendMessage: (adminId: string, message: string) => 
    API.post(`/admin-chat/conversations/${adminId}`, { message }),
  markAsRead: (messageId: string, conversationId: string) => 
    API.put(`/admin-chat/messages/${messageId}/read`, { conversationId }),
};

export default API;
