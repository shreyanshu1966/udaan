import axios from 'axios';

// Base API configuration with environment URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Optionally redirect to login page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Property search API calls
export const propertyAPI = {
  generateProperty: (formData) => api.post('/generate-property', formData),
  getUnifiedProperty: (propertyId) => api.get(`/unified-property/${propertyId}`),
  getAllProperties: () => api.get('/unified-properties'),
};

// Saved searches API calls
export const savedSearchAPI = {
  saveSearch: (searchData) => api.post('/saved-searches', searchData),
  getAllSearches: () => api.get('/saved-searches'),
  getSearch: (id) => api.get(`/saved-searches/${id}`),
  updateSearch: (id, searchData) => api.put(`/saved-searches/${id}`, searchData),
  deleteSearch: (id) => api.delete(`/saved-searches/${id}`),
};

export default api;