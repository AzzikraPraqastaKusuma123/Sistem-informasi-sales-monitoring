import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProtectedLayout from './ProtectedLayout'; // Ini akan memanggil komponen layout utama

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Jika AuthContext masih dalam proses memeriksa token, tampilkan pesan loading
  if (loading) {
    return <div>Memeriksa sesi...</div>;
  }

  // Jika sudah selesai memeriksa dan ternyata pengguna belum login,
  // "lempar" mereka kembali ke halaman login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jika berhasil login, tampilkan layout utama (Sidebar + Konten Halaman)
  // <Outlet /> di dalam ProtectedLayout akan merender halaman yang sesuai
  return (
    <ProtectedLayout>
      <Outlet />
    </ProtectedLayout>
  );
};

export default ProtectedRoute;