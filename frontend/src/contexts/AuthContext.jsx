import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // DIUBAH: Menghapus '/api' yang berlebih dari URL
          const { data } = await api.get('/users/profile');
          setUser(data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Session expired or token is invalid.");
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      // DIUBAH: Menghapus '/api' yang berlebih dari URL
      const userProfile = await api.get('/users/profile');
      setUser(userProfile.data);
      setIsAuthenticated(true);
      
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (loading) {
    return <div>Loading Application...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};