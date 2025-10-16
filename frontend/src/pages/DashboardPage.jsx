import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

// Tampilan untuk Admin
const AdminDashboard = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    api.get('/dashboard/summary').then(res => setData(res.data));
  }, []);
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Total Pengguna: {data?.totalUsers}</p>
      <p>Total Produk: {data?.totalProducts}</p>
      <p>Total Laporan: {data?.totalAchievements}</p>
    </div>
  );
};

// Tampilan untuk Sales
const SalesDashboard = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    api.get('/dashboard/sales').then(res => setData(res.data));
  }, []);
  return (
    <div>
      <h2>Dashboard Kinerja Saya</h2>
      <p>Total Penjualan Bulan Ini: {data?.monthlyValue}</p>
      <p>Jumlah Laporan Bulan Ini: {data?.monthlyReports}</p>
      <p>Total Penjualan (Semua): {data?.lifetimeValue}</p>
    </div>
  );
};

// Komponen Utama
const DashboardPage = () => {
  const { user } = useAuth();
  if (!user) return <div>Memuat...</div>;

  return (user.role === 'sales') ? <SalesDashboard /> : <AdminDashboard />;
};

export default DashboardPage;