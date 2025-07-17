import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setAuthToken, clearAuth, getCurrentUser, setCurrentUser } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('kuralverse_token');
        const savedUser = getCurrentUser();

        if (token && savedUser) {
          setAuthToken(token);
          setUser(savedUser);
          
          // Verify token is still valid by fetching fresh profile
          try {
            const response = await authAPI.getProfile();
            const freshUser = response.data.data.user;
            setUser(freshUser);
            setCurrentUser(freshUser);
          } catch (error) {
            // Token is invalid, clear auth
            console.warn('Token validation failed:', error);
            clearAuth();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuth();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.login(credentials);
      const { user: userData, token } = response.data.data;

      setAuthToken(token);
      setCurrentUser(userData);
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.register(userData);
      const { user: newUser, token } = response.data.data;

      setAuthToken(token);
      setCurrentUser(newUser);
      setUser(newUser);

      return { success: true, user: newUser };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      clearAuth();
      setUser(null);
      setError(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.updateProfile(profileData);
      const updatedUser = response.data.data.user;

      setUser(updatedUser);
      setCurrentUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError(null);

      await authAPI.changePassword(passwordData);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Password change failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (passwordData) => {
    try {
      setLoading(true);
      setError(null);

      await authAPI.deleteAccount(passwordData);
      clearAuth();
      setUser(null);

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Account deletion failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      const freshUser = response.data.data.user;
      setUser(freshUser);
      setCurrentUser(freshUser);
      return freshUser;
    } catch (error) {
      console.error('Profile refresh failed:', error);
      return null;
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
    refreshProfile,
    isAuthenticated,
    hasRole,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
