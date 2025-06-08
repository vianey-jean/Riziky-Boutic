
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

API.interceptors.response.use(
  response => {
    console.log(`Response from ${response.config.url}:`, response.data);
    return response;
  },
  error => {
    // Ne pas traiter les 404 sur les flash-sales comme des erreurs
    if (error.response?.status === 404 && error.config.url.includes('/flash-sales/active')) {
      console.log("ℹ️ Aucune vente flash active (comportement normal)");
    } else {
      console.error("API Error:", error.response || error);
    }
    
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
