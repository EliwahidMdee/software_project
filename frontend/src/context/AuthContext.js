/**
 * Authentication Context
 * 
 * This context manages the authentication state throughout the application.
 * It provides:
 * - User information
 * - Login/logout functions
 * - Authentication status
 * 
 * Any component can access this context to get or modify auth state.
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '../services/api';

// Create the context
const AuthContext = createContext();

/**
 * Custom hook to use the auth context
 * 
 * Usage: const { user, login, logout, isAuthenticated } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider Component
 * 
 * This wraps the entire app to provide authentication state to all components.
 */
export const AuthProvider = ({ children }) => {
  // State to store current user and loading status
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  /**
   * Check if user is authenticated on component mount
   * 
   * This runs once when the app loads to restore the user session
   * if they were previously logged in.
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have tokens in localStorage
        const token = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          // Parse and set the user from localStorage
          setUser(JSON.parse(storedUser));
          
          // Optionally, verify token is still valid by fetching current user
          try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
            localStorage.setItem('user', JSON.stringify(currentUser));
          } catch (error) {
            // Token is invalid, clear everything
            console.error('Token validation failed:', error);
            logout();
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  /**
   * Login function
   * 
   * Authenticates the user with username and password
   */
  const login = async (username, password) => {
    try {
      const userData = await apiLogin(username, password);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };
  
  /**
   * Logout function
   * 
   * Clears user data and tokens
   */
  const logout = () => {
    apiLogout();
    setUser(null);
  };
  
  /**
   * Update user function
   * 
   * Updates the user data in state and localStorage
   */
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  
  // Check if user is authenticated
  const isAuthenticated = !!user;
  
  // Context value that will be provided to all child components
  const value = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated,
    loading,
  };
  
  // Don't render children until we've checked authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
