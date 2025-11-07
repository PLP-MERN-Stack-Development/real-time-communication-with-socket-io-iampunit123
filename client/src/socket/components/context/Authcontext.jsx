import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../config/api';
import { connectSocket, disconnectSocket } from '../config/socket';

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
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('chitchat_token');
    const userData = localStorage.getItem('chitchat_user');

    if (token && userData) {
      setUser(JSON.parse(userData));
      // Connect socket with token
      const socketConnection = connectSocket(token);
      setSocket(socketConnection);
      
      // Verify token is still valid
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      // For now, we'll use mock verification since backend might not be ready
      setLoading(false);
    } catch (error) {
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      // Mock login for now - replace with actual API call later
      const mockUser = { 
        id: 1, 
        username: email.split('@')[0], 
        email,
        avatar: ''
      };
      const mockToken = 'mock-jwt-token';

      localStorage.setItem('chitchat_token', mockToken);
      localStorage.setItem('chitchat_user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      
      // Connect socket after login
      const socketConnection = connectSocket(mockToken);
      setSocket(socketConnection);

      return { success: true, user: mockUser };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      // Mock registration for now - replace with actual API call later
      const mockUser = { 
        id: Date.now(), 
        username, 
        email,
        avatar: ''
      };
      const mockToken = 'mock-jwt-token';

      localStorage.setItem('chitchat_token', mockToken);
      localStorage.setItem('chitchat_user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      
      // Connect socket after register
      const socketConnection = connectSocket(mockToken);
      setSocket(socketConnection);

      return { success: true, user: mockUser };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      // Mock logout - replace with actual API call later
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('chitchat_token');
      localStorage.removeItem('chitchat_user');
      setUser(null);
      disconnectSocket();
      setSocket(null);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('chitchat_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    socket
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};