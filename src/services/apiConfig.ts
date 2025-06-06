
import axios from 'axios';

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API = axios.create({
  baseURL: `${AUTH_BASE_URL}/api`,
  timeout: 30000,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Réduire les appels cachés pour éviter le rate limiting
    if (config.method === 'get' && !config.url?.includes('/flash-sales/active')) {
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

API.interceptors.response.use(
  response => {
    console.log(`Response from ${response.config.url}:`, response.data);
    return response;
  },
  error => {
    console.error("API Error:", error.response || error);
    
    // Gérer spécifiquement l'erreur 429
    if (error.response && error.response.status === 429) {
      console.warn("Rate limit atteint, attente avant nouvelle tentative...");
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(API.request(error.config));
        }, 2000);
      });
    }
    
    if (error.response && error.response.status === 401 && 
        !error.config.url.includes('/auth/login') && 
        !error.config.url.includes('/auth/verify-token') &&
        !error.config.url.includes('/settings/general') &&
        !window.location.pathname.includes('/login')) {
      console.log("Session expirée, redirection vers la page de connexion...");
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);
