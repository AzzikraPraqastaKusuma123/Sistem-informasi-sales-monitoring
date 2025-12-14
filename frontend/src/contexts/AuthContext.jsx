import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useNotification } from './NotificationContext'; // Import useNotification

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showInfo, fetchEvaluationNotifCount } = useNotification(); // Gunakan hook notifikasi

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const { data } = await api.get('/users/profile');
          setUser(data);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    validateToken();
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      const userProfile = await api.get('/users/profile');
      const loggedInUser = userProfile.data;
      setUser(loggedInUser);
      setIsAuthenticated(true);

      // --- Logika Notifikasi Pop-up Setelah Login ---
      if (loggedInUser.role === 'sales') {
        try {
          const res = await api.get('/evaluations/unread-count');
          const unreadCount = res.data.unreadCount;
          if (unreadCount > 0) {
            // Tampilkan notifikasi pop-up
            showInfo(`Anda memiliki ${unreadCount} evaluasi baru yang belum dibaca.`);
            // Perbarui juga badge di sidebar
            fetchEvaluationNotifCount();
          }
        } catch (notifError) {
          console.error("Gagal mengambil notifikasi saat login:", notifError);
        }
      }
      // --- Akhir Logika Notifikasi ---

      navigate('/');
    } catch (error) {
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
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};