import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import api from '../api'; // Import api
import ToastContainer from '../components/ToastContainer';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  // State baru untuk notifikasi evaluasi
  const [evaluationNotifCount, setEvaluationNotifCount] = useState(0);

  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = uuidv4();
    const newToast = { id, message, type };
    setToasts((prevToasts) => [...prevToasts, newToast]);
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const showSuccess = useCallback((message, duration) => {
    showNotification(message, 'success', duration);
  }, [showNotification]);

  const showError = useCallback((message, duration) => {
    showNotification(message, 'error', duration);
  }, [showNotification]);

  const showInfo = useCallback((message, duration) => {
    showNotification(message, 'info', duration);
  }, [showNotification]);

  // Fungsi baru untuk mengambil jumlah notifikasi evaluasi
  const fetchEvaluationNotifCount = useCallback(async () => {
    try {
      const res = await api.get('/evaluations/unread-count');
      setEvaluationNotifCount(res.data.unreadCount);
    } catch (error) {
      // Jangan tampilkan error jika gagal fetch notif, agar tidak mengganggu user
      console.error('Failed to fetch evaluation notification count.');
    }
  }, []);

  // Fungsi baru untuk membersihkan notifikasi evaluasi
  const clearEvaluationNotifCount = useCallback(() => {
    setEvaluationNotifCount(0);
  }, []);

  const value = {
    showNotification,
    showSuccess,
    showError,
    showInfo,
    evaluationNotifCount,
    fetchEvaluationNotifCount,
    clearEvaluationNotifCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} />
    </NotificationContext.Provider>
  );
};
