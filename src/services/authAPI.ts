
/**
 * @fileoverview Service API d'authentification - Version Legacy
 * 
 * Ce fichier contient toutes les fonctions liées à l'authentification des utilisateurs
 * pour le projet Riziky-Boutic. Il gère la connexion, inscription, réinitialisation
 * de mot de passe et la gestion des profils utilisateurs.
 * 
 * @deprecated Ce fichier est maintenu pour compatibilité legacy.
 * Utiliser plutôt le nouveau service: modules/auth.service.ts
 * 
 * Fonctionnalités couvertes:
 * - Connexion/déconnexion utilisateur
 * - Inscription nouveaux utilisateurs
 * - Réinitialisation mot de passe
 * - Gestion profils utilisateurs
 * - Vérification tokens JWT
 * 
 * @version 1.0.0 (Legacy)
 * @author Equipe Riziky-Boutic
 */

import { API } from './apiConfig';
import { 
  AuthResponse, 
  LoginData, 
  RegisterData, 
  ResetPasswordData, 
  UpdateProfileData 
} from '@/types/auth';

/**
 * API d'authentification legacy
 * @deprecated Migrer vers authService dans modules/auth.service.ts
 */
export const authAPI = {
  /**
   * Connecte un utilisateur avec email/mot de passe
   * @param data - Données de connexion (email, password)
   * @returns Promise<AuthResponse> - Token JWT et infos utilisateur
   */
  login: (data: LoginData) => API.post<AuthResponse>('/auth/login', data),
  
  /**
   * Inscrit un nouvel utilisateur
   * @param data - Données d'inscription (nom, email, password, etc.)
   * @returns Promise<AuthResponse> - Token JWT et infos utilisateur
   */
  register: (data: RegisterData) => API.post<AuthResponse>('/auth/register', data),
  
  /**
   * Demande de réinitialisation mot de passe par email
   * @param email - Adresse email de l'utilisateur
   * @returns Promise - Confirmation d'envoi email
   */
  forgotPassword: (email: string) => API.post('/auth/forgot-password', { email }),
  
  /**
   * Réinitialise le mot de passe avec un code de réinitialisation
   * @param data - Code de réinitialisation et nouveau mot de passe
   * @returns Promise - Confirmation de réinitialisation
   */
  resetPassword: (data: ResetPasswordData) => API.post('/auth/reset-password', data),
  
  /**
   * Vérifie la validité du token JWT actuel
   * @returns Promise - Validation du token
   */
  verifyToken: () => API.get('/auth/verify-token'),
  
  /**
   * Vérifie si un email existe déjà en base
   * @param email - Adresse email à vérifier
   * @returns Promise - Existence de l'email
   */
  checkEmail: (email: string) => API.post('/auth/check-email', { email }),
  
  /**
   * Met à jour les informations du profil utilisateur
   * @param userId - ID de l'utilisateur
   * @param data - Nouvelles données du profil
   * @returns Promise - Profil mis à jour
   */
  updateProfile: (userId: string, data: UpdateProfileData) => API.put(`/users/${userId}`, data),
  
  /**
   * Change le mot de passe de l'utilisateur
   * @param userId - ID de l'utilisateur
   * @param currentPassword - Mot de passe actuel
   * @param newPassword - Nouveau mot de passe
   * @returns Promise - Confirmation du changement
   */
  updatePassword: (userId: string, currentPassword: string, newPassword: string) => 
    API.put(`/users/${userId}/password`, { currentPassword, newPassword }),
  
  /**
   * Réinitialise le mot de passe avec un code temporaire
   * @param userId - ID de l'utilisateur
   * @param passwordUnique - Code temporaire unique
   * @param newPassword - Nouveau mot de passe
   * @returns Promise - Confirmation de réinitialisation
   */
  resetPasswordWithTempCode: (userId: string, passwordUnique: string, newPassword: string) =>
    API.put(`/users/${userId}/password`, { passwordUnique, newPassword }),
  
  /**
   * Récupère le profil complet d'un utilisateur
   * @param userId - ID de l'utilisateur
   * @returns Promise - Données du profil
   */
  getUserProfile: (userId: string) => API.get(`/users/${userId}`),
  
  /**
   * Vérifie si un mot de passe est correct pour un utilisateur
   * @param userId - ID de l'utilisateur
   * @param password - Mot de passe à vérifier
   * @returns Promise - Validation du mot de passe
   */
  verifyPassword: (userId: string, password: string) => 
    API.post(`/users/${userId}/verify-password`, { password }),
  
  /**
   * Définit un mot de passe temporaire pour un utilisateur
   * @param userId - ID de l'utilisateur
   * @param passwordUnique - Code temporaire unique
   * @returns Promise - Confirmation de définition
   */
  setTempPassword: (userId: string, passwordUnique: string) =>
    API.put(`/users/${userId}/temp-password`, { passwordUnique }),
};
