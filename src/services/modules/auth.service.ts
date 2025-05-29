
import { apiClient } from '../core/apiClient';
import { 
  AuthResponse, 
  LoginData, 
  RegisterData, 
  ResetPasswordData, 
  UpdateProfileData 
} from '@/types/auth';

export const authService = {
  login: (data: LoginData) => apiClient.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterData) => apiClient.post<AuthResponse>('/auth/register', data),
  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (data: ResetPasswordData) => apiClient.post('/auth/reset-password', data),
  verifyToken: () => apiClient.get('/auth/verify-token'),
  checkEmail: (email: string) => apiClient.post('/auth/check-email', { email }),
  updateProfile: (userId: string, data: UpdateProfileData) => apiClient.put(`/users/${userId}`, data),
  updatePassword: (userId: string, currentPassword: string, newPassword: string) => 
    apiClient.put(`/users/${userId}/password`, { currentPassword, newPassword }),
  resetPasswordWithTempCode: (userId: string, passwordUnique: string, newPassword: string) =>
    apiClient.put(`/users/${userId}/password`, { passwordUnique, newPassword }),
  getUserProfile: (userId: string) => apiClient.get(`/users/${userId}`),
  verifyPassword: (userId: string, password: string) => 
    apiClient.post(`/users/${userId}/verify-password`, { password }),
  setTempPassword: (userId: string, passwordUnique: string) =>
    apiClient.put(`/users/${userId}/temp-password`, { passwordUnique }),
};
