
/**
 * @fileoverview Service d'authentification moderne - Architecture modulaire
 * 
 * Ce service gère toutes les opérations d'authentification et de gestion
 * des profils utilisateurs dans la nouvelle architecture modulaire.
 * 
 * Fonctionnalités couvertes:
 * - Authentification complète (login/register/logout)
 * - Gestion des mots de passe (changement, réinitialisation)
 * - Profils utilisateurs (lecture, modification, suppression)
 * - Vérification de tokens et validation
 * - Codes temporaires et récupération de compte
 * - Vérification d'emails et sécurité
 * 
 * Architecture:
 * - Utilise apiClient centralisé pour consistance
 * - Types TypeScript stricts pour toutes les opérations
 * - Gestion d'erreurs automatique via intercepteurs
 * - Logging automatique des requêtes
 * 
 * @version 2.0.0
 * @author Equipe Riziky-Boutic
 */

import { apiClient } from '../core/apiClient';
import { 
  AuthResponse, 
  LoginData, 
  RegisterData, 
  ResetPasswordData, 
  UpdateProfileData 
} from '@/types/auth';

/**
 * Service d'authentification moderne avec méthodes complètes
 * Toutes les méthodes retournent des Promises avec types stricts
 */
export const authService = {
  /**
   * Connecte un utilisateur avec email et mot de passe
   * @param data - Informations de connexion
   * @returns Promise avec token et données utilisateur
   */
  login: (data: LoginData) => apiClient.post<AuthResponse>('/auth/login', data),
  
  /**
   * Inscrit un nouvel utilisateur
   * @param data - Informations d'inscription
   * @returns Promise avec token et données utilisateur
   */
  register: (data: RegisterData) => apiClient.post<AuthResponse>('/auth/register', data),
  
  /**
   * Demande de réinitialisation de mot de passe par email
   * @param email - Adresse email du compte
   * @returns Promise de confirmation d'envoi
   */
  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
  
  /**
   * Réinitialise le mot de passe avec un code de vérification
   * @param data - Code et nouveau mot de passe
   * @returns Promise de confirmation
   */
  resetPassword: (data: ResetPasswordData) => apiClient.post('/auth/reset-password', data),
  
  /**
   * Vérifie la validité du token JWT actuel
   * @returns Promise de validation
   */
  verifyToken: () => apiClient.get('/auth/verify-token'),
  
  /**
   * Vérifie si un email existe déjà en base de données
   * @param email - Email à vérifier
   * @returns Promise avec résultat de vérification
   */
  checkEmail: (email: string) => apiClient.post('/auth/check-email', { email }),
  
  /**
   * Met à jour le profil utilisateur
   * @param userId - ID de l'utilisateur
   * @param data - Nouvelles données du profil
   * @returns Promise avec profil mis à jour
   */
  updateProfile: (userId: string, data: UpdateProfileData) => apiClient.put(`/users/${userId}`, data),
  
  /**
   * Change le mot de passe d'un utilisateur
   * @param userId - ID de l'utilisateur
   * @param currentPassword - Mot de passe actuel
   * @param newPassword - Nouveau mot de passe
   * @returns Promise de confirmation
   */
  updatePassword: (userId: string, currentPassword: string, newPassword: string) => 
    apiClient.put(`/users/${userId}/password`, { currentPassword, newPassword }),
  
  /**
   * Réinitialise mot de passe avec code temporaire
   * @param userId - ID utilisateur
   * @param passwordUnique - Code temporaire
   * @param newPassword - Nouveau mot de passe
   * @returns Promise de confirmation
   */
  resetPasswordWithTempCode: (userId: string, passwordUnique: string, newPassword: string) =>
    apiClient.put(`/users/${userId}/password`, { passwordUnique, newPassword }),
  
  /**
   * Récupère le profil complet d'un utilisateur
   * @param userId - ID de l'utilisateur
   * @returns Promise avec données du profil
   */
  getUserProfile: (userId: string) => apiClient.get(`/users/${userId}`),
  
  /**
   * Vérifie si un mot de passe est correct
   * @param userId - ID utilisateur
   * @param password - Mot de passe à vérifier
   * @returns Promise de validation
   */
  verifyPassword: (userId: string, password: string) => 
    apiClient.post(`/users/${userId}/verify-password`, { password }),
  
  /**
   * Définit un mot de passe temporaire
   * @param userId - ID utilisateur
   * @param passwordUnique - Code temporaire unique
   * @returns Promise de confirmation
   */
  setTempPassword: (userId: string, passwordUnique: string) =>
    apiClient.put(`/users/${userId}/temp-password`, { passwordUnique }),
  
  /**
   * Supprime définitivement un profil utilisateur
   * @param userId - ID de l'utilisateur
   * @param password - Mot de passe de confirmation
   * @returns Promise de confirmation de suppression
   */
  deleteProfile: (userId: string, password: string) =>
    apiClient.delete(`/users/${userId}/profile`, { data: { password } }),
};
