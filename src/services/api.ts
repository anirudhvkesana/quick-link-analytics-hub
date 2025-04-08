
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authApi = {
  register: (userData: { email: string; password: string; name?: string }) => 
    api.post('/auth/register', userData),
  
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  
  getCurrentUser: () => api.get('/auth/me'),
};

// Link API
export const linkApi = {
  createLink: (linkData: { originalUrl: string; customAlias?: string; expirationDate?: string }) => 
    api.post('/links', linkData),
  
  getUserLinks: (page = 1, limit = 10, search = '') => 
    api.get('/links', { params: { page, limit, search } }),
  
  getLinkAnalytics: (linkId: string) => 
    api.get(`/links/${linkId}/analytics`),
  
  generateQRCode: (shortUrl: string) => 
    api.get(`/links/${shortUrl}/qr`),
};

export default api;
