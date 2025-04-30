import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      loadUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async (token) => {
    try {
      setLoading(true);
      
      const response = await authAPI.getProfile();
      
      setUser({
        ...response.data,
        token
      });
      setError(null);
    } catch (error) {
      console.error('Error loading user:', error);
      // Remove invalid token
      localStorage.removeItem('token');
      setUser(null);
      setError('Session expired. Please log in again.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      
      const response = await authAPI.register({
        name,
        email,
        password
      });
      
      const { token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set user data
      setUser(response.data);
      setError(null);
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.error || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await authAPI.login({
        email,
        password
      });
      
      const { token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set user data
      setUser(response.data);
      setError(null);
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.error || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Clear user data
    setUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      
      const response = await authAPI.updateProfile(userData);
      
      // Update user data
      setUser({
        ...response.data,
        token: user.token
      });
      
      setError(null);
      
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error.response?.data?.error || 'Profile update failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;