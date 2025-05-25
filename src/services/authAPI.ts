
import { API } from './apiConfig';
import { 
  AuthResponse, 
  LoginData, 
  RegisterData, 
  ResetPasswordData, 
  UpdateProfileData 
} from '@/types/auth';

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
