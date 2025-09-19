
/**
 * @fileoverview Client API centralisé avec intercepteurs et configuration
 * 
 * Ce fichier configure le client HTTP principal pour toutes les requêtes API
 * du projet Riziky-Boutic. Il inclut la gestion automatique des tokens,
 * la déconnexion sur erreurs 401, et le logging des requêtes.
 * 
 * Fonctionnalités:
 * - Configuration Axios avec timeout et base URL
 * - Injection automatique du token Authorization
 * - Cache busting pour les requêtes GET
 * - Logging détaillé des requêtes et réponses
 * - Gestion automatique de l'expiration de session
 * - Redirection automatique vers login sur 401
 * - Intercepteurs request/response configurés
 * 
 * Configuration:
 * - Base URL: VITE_API_BASE_URL/api
 * - Timeout: 30 secondes
 * - Headers: Authorization Bearer automatique
 * 
 * @version 2.0.0
 * @author Equipe Riziky-Boutic
 */

import axios from 'axios';

/** URL de base de l'API depuis les variables d'environnement */
const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Instance Axios configurée pour les appels API
 * - Base URL automatique avec /api
 * - Timeout de 30 secondes pour éviter les blocages
 */
export const apiClient = axios.create({
  baseURL: `${AUTH_BASE_URL}/api`,
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    console.log(`${config.method?.toUpperCase()} Request to ${config.url}`, 
      config.method === 'post' || config.method === 'put' 
        ? JSON.stringify(config.data)
        : config.params || {});

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    console.log(`Response from ${response.config.url}:`, response.data);
    return response;
  },
  error => {
    console.error("API Error:", error.response || error);
    
    if (error.response && error.response.status === 401 && 
        !error.config.url.includes('/auth/login') && 
        !error.config.url.includes('/auth/verify-token')) {
      console.log("Session expirée, redirection vers la page de connexion...");
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);
