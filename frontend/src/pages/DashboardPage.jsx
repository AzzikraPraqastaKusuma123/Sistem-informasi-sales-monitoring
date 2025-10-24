import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import Card from '../components/Card';

// Grafik lama
import SalesChart from '../components/SalesChart';

// Import komponen-komponen grafik BARU
import PerformanceTrendChart from '../components/PerformanceTrendChart';
import TopProductsChart from '../components/TopProductsChart';
import SalesContributionChart from '../components/SalesContributionChart';
import ActivityChart from '../components/ActivityChart';
import TopUsersAchievementChart from '../components/TopUsersAchievementChart';
import SalesPerformanceChart from '../components/SalesPerformanceChart'; // Import the new chart component
import TargetProjectionCard from '../components/TargetProjectionCard'; // Import the new projection card
import { useNotification } from '../contexts/NotificationContext'; // Import useNotification

// Import CSS
import './DashboardPage.css';
import '../components/Card.css'; // CSS untuk wrapper grafik

// Tampilan Dashboard untuk Admin/Supervisor (YANG DIPERBARUI)
const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useNotification(); // Inisialisasi useNotification

  useEffect(() => {
    // Menggunakan async/await untuk kejelasan
    const fetchAdminSummary = async () => {
        try {
            const res = await api.get('/dashboard/summary');
            setSummary(res.data);
        } catch (err) {
            showError("Gagal memuat ringkasan admin.");
        } finally {
            setLoading(false);
        }
    };
    
    fetchAdminSummary();
  }, [showError]);

  if (loading) return <div>Memuat Dashboard Admin...</div>;

  return (
    <>
      {/* Bagian KPI Cards - Tidak Berubah */}
      <div className="card-container">
        <Card title="Total Pengguna" value={summary?.totalUsers} />
        <Card title="Total Produk" value={summary?.totalProducts} />
        <Card title="Total Laporan Masuk" value={summary?.totalAchievements} />
      </div>

      <div className="chart-container">
        {/* Grafik 1: Peringkat Kinerja Tim (Sudah ada, dibuat full-width) */}
        <div className="top-sales-chart">
            <SalesChart data={summary?.topSalesPerformance} />
        </div>
        
        {/* Grid untuk 4 Grafik Baru */}
        <div className="dashboard-grid">
            <PerformanceTrendChart data={summary?.dailyTrend || []} />
            <TopProductsChart data={summary?.topProducts || []} />
            <SalesContributionChart data={summary?.salesContribution || []} />
            <ActivityChart data={summary?.dailyActivity || []} />
            <TopUsersAchievementChart data={summary?.topUsersAchievement || []} />
        </div>
      </div>
    </>
  );
};

// Tampilan Dashboard untuk Sales (DIPERBARUI)
const SalesDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useNotification(); // Inisialisasi useNotification

  useEffect(() => {
    api.get('/dashboard/sales')
      .then(res => setSummary(res.data))
      .catch(err => showError("Gagal memuat ringkasan sales."))
      .finally(() => setLoading(false));
  }, [showError]);

  if (loading) return <div>Memuat Dashboard Kinerja Anda...</div>;

  const handleExport = async () => {
    try {
      const response = await api.get('/dashboard/sales/export', {
        responseType: 'blob', // Penting: respons diharapkan dalam bentuk blob
      });

      // Buat URL objek dari blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      // Buat link sementara dan klik untuk mengunduh
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Sales_Dashboard_Export_${Date.now()}.xlsx`); // Nama file
      document.body.appendChild(link);
      link.click();
      link.remove(); // Hapus link setelah diunduh
      window.URL.revokeObjectURL(url); // Bersihkan URL objek
      showSuccess('Data berhasil diekspor ke Excel!');
    } catch (error) {
      showError("Gagal mengunduh data Excel. Silakan coba lagi.");
    }
  };

  return (
    <>
      {/* Kartu KPI - Tidak Berubah */}
      <div className="card-container">
        <Card title="Pencapaian Saya (Bulan Ini)" value={summary?.achievement} />
        <Card title="Target Saya (Bulan Ini)" value={summary?.target} />
        <Card title="Persentase Target" value={summary?.percentage} unit="%" />
        <Card title="Proyeksi Akhir Bulan" value={summary?.projectedAchievement} />
      </div>
      
      <div className="export-button-container">
        <button onClick={handleExport} className="btn btn-primary">Export ke Excel</button>
      </div>

      {/* Kartu Proyeksi Target Baru */}
      <TargetProjectionCard 
        achievement={summary?.achievement || 0}
        target={summary?.target || 0}
        projectedAchievement={summary?.projectedAchievement || 0}
      />

      {/* Wadah untuk semua grafik */}
      <div className="chart-container">
        {/* Grafik Performa vs Target (utama, lebar penuh) */}
        <div className="sales-performance-chart">
          <SalesPerformanceChart achievement={summary?.achievement} target={summary?.target} />
        </div>

        {/* Grid untuk grafik-grafik lainnya */}
        <div className="dashboard-grid-sales">
          <PerformanceTrendChart data={summary?.dailyTrend || []} />
          <TopProductsChart data={summary?.topProducts || []} />
          <SalesContributionChart data={summary?.salesContribution || []} />
        </div>
      </div>
    </>
  );
};

// Komponen Utama (TIDAK BERUBAH)
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
