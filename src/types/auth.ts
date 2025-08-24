
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
  profileImage?: string;
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
  profileImage?: string;
}
