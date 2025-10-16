import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import Card from '../components/Card';
import SalesChart from '../components/SalesChart';
import './DashboardPage.css';

// Tampilan Dashboard untuk Admin/Supervisor
const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get('/dashboard/summary');
        setSummary(data);
      } catch (error) {
        console.error('Gagal memuat ringkasan admin', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div>Memuat Dashboard Admin...</div>;

  return (
    <>
      <div className="card-container">
        <Card title="Total Pengguna" value={summary?.totalUsers} />
        <Card title="Total Produk" value={summary?.totalProducts} />
        <Card title="Total Laporan" value={summary?.totalAchievements} />
      </div>

      <div className="chart-container">
        {/* Mengirim data nyata ke komponen SalesChart */}
        <SalesChart data={summary?.topSalesPerformance} />
      </div>
    </>
  );
};

// Tampilan Dashboard untuk Sales
const SalesDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get('/dashboard/sales');
        setSummary(data);
      } catch (error) {
        console.error('Gagal memuat ringkasan sales', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div>Memuat Dashboard Anda...</div>;

  return (
    <div className="card-container">
      <Card title="Pencapaian Saya (Bulan Ini)" value={summary?.achievement} />
      <Card title="Target Saya (Bulan Ini)" value={summary?.target} />
      <Card title="Persentase Target" value={summary?.percentage} unit="%" />
    </div>
  );
};

// Komponen Utama yang tidak berubah
const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      
      {user && (user.role === 'admin' || user.role === 'supervisor') ? (
        <AdminDashboard />
      ) : (
        <SalesDashboard />
      )}
    </div>
  );
};

export default DashboardPage;