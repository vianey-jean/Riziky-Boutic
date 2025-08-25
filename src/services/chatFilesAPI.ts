
import { API } from './apiConfig';

export const chatFilesAPI = {
  // Upload fichier dans chat admin
  uploadAdminFile: (conversationId: string, file: File, messageText?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (messageText) {
      formData.append('messageText', messageText);
    }
    
    return API.post(`/chat-files/admin/${conversationId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Upload fichier dans chat service client
  uploadServiceFile: (conversationId: string, file: File, messageText?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (messageText) {
      formData.append('messageText', messageText);
    }
    
    return API.post(`/chat-files/service/${conversationId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Supprimer un fichier et son message associé
  deleteFile: (messageId: string, conversationId: string, chatType: 'admin' | 'service') => {
    return API.delete(`/chat-files/${chatType}/${conversationId}/message/${messageId}`);
  },

  // Télécharger un fichier
  downloadFile: (type: 'chat-files' | 'chat-audio' | 'chat-video', filename: string) => {
    return API.get(`/chat-files/download/${type}/${filename}`, {
      responseType: 'blob',
    });
  },

  // Obtenir l'URL d'un fichier pour prévisualisation
  getFileUrl: (fileUrl: string) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000';
    return `${baseUrl}${fileUrl}`;
  }
};

export type FileAttachment = {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
};
