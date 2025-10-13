// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    // Kita tidak set user di sini, kita akan redirect dan ambil data di protected route
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook custom untuk menggunakan AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};