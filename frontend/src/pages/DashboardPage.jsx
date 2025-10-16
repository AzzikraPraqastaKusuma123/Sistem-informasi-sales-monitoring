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
    api.get('/dashboard/summary')
      .then(res => setSummary(res.data))
      .catch(err => console.error("Gagal memuat ringkasan admin", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Memuat Dashboard Admin...</div>;

  return (
    <>
      <div className="card-container admin-kpi-cards">
        <Card title="Total Pengguna" value={summary?.totalUsers} />
        <Card title="Total Produk" value={summary?.totalProducts} />
        <Card title="Total Laporan Masuk" value={summary?.totalAchievements} />
      </div>

      <div className="chart-container admin-chart">
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
    api.get('/dashboard/sales')
      .then(res => setSummary(res.data))
      .catch(err => console.error("Gagal memuat ringkasan sales", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Memuat Dashboard Kinerja Anda...</div>;

  return (
    <>
      {/* Kita akan membuat layout khusus untuk sales di sini */}
      <div className="card-container">
        <Card title="Pencapaian Saya (Bulan Ini)" value={summary?.achievement} />
        <Card title="Target Saya (Bulan Ini)" value={summary?.target} />
        <Card title="Persentase Target" value={summary?.percentage} unit="%" />
      </div>
      
      {/* Tambahan: Nanti bisa diisi grafik personal */}
      <div className="chart-container">
        <p>Grafik performa pribadi Anda akan muncul di sini.</p>
      </div>
    </>
  );
};

// Komponen Utama yang memilih tampilan
const DashboardPage = () => {
  const { user } = useAuth();
  const isAdminOrSupervisor = user && (user.role === 'admin' || user.role === 'supervisor');

  return (
    <div className="page-container dashboard-page">
      <h1>Dashboard</h1>
      <p className="dashboard-welcome">
        {isAdminOrSupervisor 
          ? "Berikut adalah ringkasan performa tim secara keseluruhan."
          : "Berikut adalah ringkasan performa penjualan Anda."
        }
      </p>
      
      {isAdminOrSupervisor ? <AdminDashboard /> : <SalesDashboard />}
    </div>
  );
};

export default DashboardPage;