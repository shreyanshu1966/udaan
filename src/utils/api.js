import axios from 'axios';

// Determine API base URL based on environment
const getBaseUrl = () => {
  // Use environment variables if available
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Default fallbacks based on hostname
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8888';
  } else if (hostname.includes('vercel.app')) {
    return 'https://udaan-backend.netlify.app';
  } else if (hostname.includes('render.com')) {
    return 'https://udaan-backend.onrender.com'; // Render-specific URL
  }
  
  // Final fallback
  return 'https://udaan-backend.onrender.com'; // Updated fallback to Render
};

// Create base API configuration
const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token to requests
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

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (userData) => api.put('/api/auth/profile', userData),
};

// Property search endpoints
export const propertyAPI = {
  generateProperty: (formData) => api.post('/api/generate-property', formData),
  getProperty: (propertyId) => api.get(`/api/property/${propertyId}`),
  getUnifiedProperty: (propertyId) => api.get(`/api/unified-property/${propertyId}`),
};

// Saved searches endpoints
export const savedSearchAPI = {
  getSavedSearches: () => api.get('/api/saved-searches'),
  getSavedSearch: (id) => api.get(`/api/saved-searches/${id}`),
  saveSearch: (searchData) => api.post('/api/saved-searches', searchData),
  updateSavedSearch: (id, data) => api.put(`/api/saved-searches/${id}`, data),
  deleteSavedSearch: (id) => api.delete(`/api/saved-searches/${id}`),
};

export default api;