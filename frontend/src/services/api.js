/**
 * API Service Configuration
 * 
 * This file configures Axios for making HTTP requests to the Django backend.
 * It includes authentication token handling and request/response interceptors.
 */

import axios from 'axios';

// Get the API URL from environment variables
// This allows us to easily change the backend URL for different environments
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * 
 * This runs before every request is sent.
 * It adds the JWT authentication token to the request headers if available.
 */
api.interceptors.request.use(
  (config) => {
    // Get the access token from localStorage
    const token = localStorage.getItem('access_token');
    
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 
 * This runs after every response is received.
 * It handles token expiration and refreshes tokens automatically.
 */
api.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 (Unauthorized) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the access token
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          
          // Save the new access token
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// ==================== AUTHENTICATION FUNCTIONS ====================

/**
 * Login function
 * Authenticates user and stores tokens
 */
export const login = async (username, password) => {
  const response = await api.post('/auth/login/', { username, password });
  const { access, refresh } = response.data;
  
  // Store tokens in localStorage
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
  
  // Get user information
  const userResponse = await api.get('/auth/user/');
  localStorage.setItem('user', JSON.stringify(userResponse.data));
  
  return userResponse.data;
};

/**
 * Register function
 * Creates a new user account
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register/', userData);
  return response.data;
};

/**
 * Logout function
 * Removes tokens and user data
 */
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

/**
 * Get current user function
 * Fetches current user information
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/user/');
  return response.data;
};

// ==================== CRUD FUNCTIONS FOR EACH RESOURCE ====================

/**
 * Generic CRUD functions that work for any resource
 * These can be used for properties, units, tenants, leases, etc.
 */

// Get all items for a resource (e.g., all properties)
export const getAll = async (resource, params = {}) => {
  const response = await api.get(`/${resource}/`, { params });
  return response.data;
};

// Get a single item by ID
export const getById = async (resource, id) => {
  const response = await api.get(`/${resource}/${id}/`);
  return response.data;
};

// Create a new item
export const create = async (resource, data) => {
  const response = await api.post(`/${resource}/`, data);
  return response.data;
};

// Update an existing item
export const update = async (resource, id, data) => {
  const response = await api.put(`/${resource}/${id}/`, data);
  return response.data;
};

// Partially update an existing item
export const partialUpdate = async (resource, id, data) => {
  const response = await api.patch(`/${resource}/${id}/`, data);
  return response.data;
};

// Delete an item
export const remove = async (resource, id) => {
  const response = await api.delete(`/${resource}/${id}/`);
  return response.data;
};

// ==================== SPECIFIC API FUNCTIONS ====================

/**
 * Dashboard Statistics
 * Gets statistics for the dashboard based on user role
 */
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats/');
  return response.data;
};

/**
 * Upload file (for images, documents, etc.)
 */
export const uploadFile = async (resource, id, fileData) => {
  const formData = new FormData();
  
  // Add all fields to FormData
  Object.keys(fileData).forEach(key => {
    formData.append(key, fileData[key]);
  });
  
  const response = await api.post(`/${resource}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

/**
 * Respond to notification (custom action)
 */
export const respondToNotification = async (id, response) => {
  const result = await api.post(`/notifications/${id}/respond/`, { response });
  return result.data;
};

// Export the configured Axios instance for custom requests
export default api;
