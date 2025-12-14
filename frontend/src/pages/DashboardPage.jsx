import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import Card from '../components/Card';

// Import komponen-komponen grafik BARU
import PerformanceTrendChart from '../components/PerformanceTrendChart';
import ActivityChart from '../components/ActivityChart';
import TargetProjectionCard from '../components/TargetProjectionCard'; // Import the new projection card
import { useNotification } from '../contexts/NotificationContext'; // Import useNotification
import TopSalesDataTable from '../components/TopSalesDataTable'; // Import komponen tabel baru
import MainDashboardChart from '../components/MainDashboardChart'; // Import komponen grafik utama yang baru
import TopProductsChart from '../components/TopProductsChart'; // Import TopProductsChart
import SalesContributionChart from '../components/SalesContributionChart'; // Import SalesContributionChart
import ProductDataTable from '../components/ProductDataTable'; // Re-add the missing import

// Import CSS
import './DashboardPage.css';
// import '../components/Chart.css'; // Removed, styles handled globally or in component
// import '../components/Card.css'; // Removed, styles handled globally or in component
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

// Tampilan Dashboard untuk Sales (DIPERBARUI)
const SalesDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State untuk tabel produk terlaris
  const [topProductsData, setTopProductsData] = useState([]);
  const [topProductsPeriod, setTopProductsPeriod] = useState('monthly');
  const [tableLoading, setTableLoading] = useState(true);

  // State untuk pie chart kontribusi
  const [contributionData, setContributionData] = useState([]);
  const [contributionPeriod, setContributionPeriod] = useState('monthly');
  const [contributionLoading, setContributionLoading] = useState(true);

  const { showError, showSuccess } = useNotification();

  // Effect untuk data summary utama
  useEffect(() => {
    api.get('/dashboard/sales')
      .then(res => setSummary(res.data))
      .catch(err => showError("Gagal memuat ringkasan sales."))
      .finally(() => setLoading(false));
  }, [showError]);

  // Effect untuk data tabel produk terlaris
  useEffect(() => {
    const fetchTopProducts = async () => {
      setTableLoading(true);
      try {
        const res = await api.get(`/dashboard/sales/top-products?period=${topProductsPeriod}`);
        setTopProductsData(res.data);
      } catch (err) {
        showError('Gagal memuat data produk terlaris.');
        setTopProductsData([]);
      } finally {
        setTableLoading(false);
      }
    };
    fetchTopProducts();
  }, [topProductsPeriod, showError]);

  // Effect untuk pie chart kontribusi
  useEffect(() => {
    const fetchContributionData = async () => {
      setContributionLoading(true);
      try {
        const res = await api.get(`/dashboard/sales/contribution?period=${contributionPeriod}`);
        console.log('--- Contribution API Response ---', res.data); // Debugging line
        setContributionData(res.data);
      } catch (err) {
        showError('Gagal memuat data kontribusi produk.');
        setContributionData([]);
      } finally {
        setContributionLoading(false);
      }
    };
    fetchContributionData();
  }, [contributionPeriod, showError]);


  if (loading) return <div>Memuat Dashboard Kinerja Anda...</div>;

  const handleExport = async () => {
    try {
      const response = await api.get('/dashboard/sales/export', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Sales_Dashboard_Export_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSuccess('Data berhasil diekspor ke Excel!');
    } catch (error) {
      showError("Gagal mengunduh data Excel. Silakan coba lagi.");
    }
  };

  return (
    <>
      {/* Kartu KPI - Tidak Berubah */}
      <div className="card-container">
        <Card title="Pencapaian Saya (Bulan Ini)" value={summary?.achievement} isCurrency={true} />
        <Card title="Target Saya (Bulan Ini)" value={summary?.target} isCurrency={true} />
        <Card title="Persentase Target" value={summary?.percentage} unit="%" />
        <Card title="Proyeksi Akhir Bulan" value={summary?.projectedAchievement} isCurrency={true} />
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
        {/* Grid untuk grafik-grafik lainnya */}
        <div className="dashboard-grid-sales">
          <div className="chart-wrapper"><PerformanceTrendChart data={summary?.dailyTrend || []} /></div>
          <div className="chart-wrapper"><TopProductsChart data={summary?.topProducts || []} /></div>
          
          {/* Sales Contribution Chart Section with Filters */}
          <div className="chart-wrapper">
            <div className="filter-buttons chart-filters">
              <button 
                onClick={() => setContributionPeriod('daily')} 
                className={contributionPeriod === 'daily' ? 'active' : ''}
              >
                Harian
              </button>
              <button 
                onClick={() => setContributionPeriod('weekly')}
                className={contributionPeriod === 'weekly' ? 'active' : ''}
              >
                Mingguan
              </button>
              <button 
                onClick={() => setContributionPeriod('monthly')}
                className={contributionPeriod === 'monthly' ? 'active' : ''}
              >
                Bulanan
              </button>
            </div>
            <SalesContributionChart 
              data={contributionData} 
              loading={contributionLoading} 
              period={contributionPeriod} 
            />
          </div>
        </div>
      </div>

      {/* Bagian Tabel Produk Terlaris BARU */}
      <div className="top-products-table-section">
        <div className="filter-buttons">
          <button 
            onClick={() => setTopProductsPeriod('daily')} 
            className={topProductsPeriod === 'daily' ? 'active' : ''}
          >
            Harian
          </button>
          <button 
            onClick={() => setTopProductsPeriod('weekly')}
            className={topProductsPeriod === 'weekly' ? 'active' : ''}
          >
            Mingguan
          </button>
          <button 
            onClick={() => setTopProductsPeriod('monthly')}
            className={topProductsPeriod === 'monthly' ? 'active' : ''}
          >
            Bulanan
          </button>
        </div>
        <ProductDataTable 
          data={topProductsData}
          loading={tableLoading}
          period={topProductsPeriod}
        />
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
