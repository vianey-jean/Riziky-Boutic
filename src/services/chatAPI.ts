
import { API } from './apiConfig';

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

export const clientChatAPI = {
  setOnline: () => API.post('/client-chat/online'),
  setOffline: () => API.post('/client-chat/offline'),
  getStatus: (userId: string) => API.get(`/client-chat/status/${userId}`),
  getServiceAdmins: () => API.get('/client-chat/service-admins'),
  getServiceChat: () => API.get('/client-chat/service'),
  sendServiceMessage: (message: string) => API.post('/client-chat/service/message', { message }),
  getServiceConversations: () => API.get('/client-chat/admin/service'),
  sendServiceReply: (conversationId: string, message: string) => 
    API.post(`/client-chat/admin/service/${conversationId}/reply`, { message }),
  editMessage: (messageId: string, content: string, conversationId: string) => 
    API.put(`/client-chat/messages/${messageId}`, { content, conversationId }),
  deleteMessage: (messageId: string, conversationId: string) => 
    API.delete(`/client-chat/messages/${messageId}?conversationId=${conversationId}`),
  markAsRead: (messageId: string, conversationId: string) => 
    API.put(`/client-chat/messages/${messageId}/read`, { conversationId })
};
