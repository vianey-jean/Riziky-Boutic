
import { API } from './apiConfig';
import { Contact } from '@/types/contact';

export const contactsAPI = {
  getAll: () => API.get<Contact[]>('/contacts'),
  getById: (id: string) => API.get<Contact>(`/contacts/${id}`),
  create: (contact: any) => API.post<Contact>('/contacts', contact),
  update: (id: string, data: any) => API.put<Contact>(`/contacts/${id}`, data),
  delete: (id: string) => API.delete(`/contacts/${id}`),
  markAsRead: (id: string, read: boolean) => API.put<Contact>(`/contacts/${id}`, { read }),
};
