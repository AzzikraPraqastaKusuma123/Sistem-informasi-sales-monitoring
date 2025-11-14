import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import Card from '../components/Card';

// Import komponen-komponen grafik BARU
import PerformanceTrendChart from '../components/PerformanceTrendChart';
import ActivityChart from '../components/ActivityChart';
import SalesPerformanceChart from '../components/SalesPerformanceChart'; // Import the new chart component
import TargetProjectionCard from '../components/TargetProjectionCard'; // Import the new projection card
import { useNotification } from '../contexts/NotificationContext'; // Import useNotification
import TopSalesDataTable from '../components/TopSalesDataTable'; // Import komponen tabel baru
import MainDashboardChart from '../components/MainDashboardChart'; // Import komponen grafik utama yang baru

// Import CSS
import './DashboardPage.css';
import '../components/Chart.css';
import '../components/Card.css'; // CSS untuk wrapper grafik
import '../components/TopSalesDataTable.css'; // Import CSS untuk tabel baru
import '../components/MainDashboardChart.css'; // Import CSS untuk grafik utama baru

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
        {/* Grafik utama yang baru dan interaktif */}
        <MainDashboardChart 
          performanceData={summary?.topSalesPerformance || []}
          trendData={summary?.dailyTrend || []}
          activityData={summary?.dailyActivity || []}
        />
      </div>

      {/* Tabel Data Peringkat Sales Baru (sudah termasuk grafik peringkat) */}
      <TopSalesDataTable />
    </>
  );
};

import ProductDataTable from '../components/ProductDataTable';
import '../components/ProductDataTable.css';

// Tampilan Dashboard untuk Sales (DIPERBARUI)
const SalesDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = useNotification(); // Inisialisasi useNotification

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
        <div className="sales-performance-chart chart-wrapper">
          <SalesPerformanceChart achievement={summary?.achievement} target={summary?.target} />
        </div>

        {/* Grid untuk grafik-grafik lainnya */}
        <div className="dashboard-grid-sales">
          <div className="chart-wrapper"><PerformanceTrendChart data={summary?.dailyTrend || []} /></div>
          <div className="chart-wrapper"><TopProductsChart data={summary?.topProducts || []} /></div>
          <div className="chart-wrapper"><SalesContributionChart data={summary?.salesContribution || []} /></div>
        </div>
      </div>

      <ProductDataTable />
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
