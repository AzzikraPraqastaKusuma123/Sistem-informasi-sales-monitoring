import React, { useState, useEffect, useMemo } from 'react';
import api from '../api';
import { useNotification } from '../contexts/NotificationContext';
import TopUsersAchievementChart from './TopUsersAchievementChart'; // Impor grafik user
import TopProductsChart from './TopProductsChart'; // Impor grafik produk
import ProductPieChart from './ProductPieChart'; // Impor grafik pie produk baru
import './TopSalesDataTable.css';

const TopSalesDataTable = () => {
  const [data, setData] = useState([]);
  const [recap, setRecap] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChart, setActiveChart] = useState('users'); // 'users' atau 'products'
  const { showError } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/dashboard/top-sales-table?period=${period}`);
        setData(res.data.data);
        setRecap(res.data.recap);
        setTopProducts(res.data.topProducts); // Simpan data produk terlaris
      } catch (err) {
        showError('Gagal memuat data tabel peringkat sales.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period, showError]);

  const filteredData = useMemo(() => {
    return data.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const formatNumber = (value) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  // Ambil 5 data teratas untuk grafik peringkat user
  const userChartData = useMemo(() => filteredData.slice(0, 5), [filteredData]);
  // Data untuk grafik kontribusi sales (tidak lagi digunakan di sini, tapi tetap ada untuk referensi jika diperlukan)
  // const salesContributionData = useMemo(() => 
  //   filteredData.map(user => ({ name: user.name, value: user.total_achievement }))
  //   .filter(user => user.value > 0)
  // , [filteredData]);

  return (
    <div className="top-sales-data-table-wrapper">
      <h3 className="table-title">Analisis Kinerja Tim Sales</h3>
      
      {loading ? (
        <div className="loading-state">Memuat data...</div>
      ) : (
        <>
          <div className="summary-container">
            <div className="summary-chart">
              {/* Tombol untuk mengganti grafik */}
              <div className="chart-toggle-buttons">
                <button onClick={() => setActiveChart('users')} className={activeChart === 'users' ? 'active' : ''}>Peringkat Sales</button>
                <button onClick={() => setActiveChart('products')} className={activeChart === 'products' ? 'active' : ''}>Produk Terlaris</button>
              </div>
              {/* Render grafik secara kondisional */}
              {activeChart === 'users' ? (
                <TopUsersAchievementChart data={userChartData} />
              ) : (
                <TopProductsChart data={topProducts} />
              )}
            </div>
            {/* Pie Chart Produk Terlaris yang baru */}
            <div className="summary-pie-chart">
              <ProductPieChart />
            </div>
          </div>

          <div className="table-controls">
            <div className="filter-buttons">
              <button onClick={() => setPeriod('daily')} className={period === 'daily' ? 'active' : ''}>Harian</button>
              <button onClick={() => setPeriod('weekly')} className={period === 'weekly' ? 'active' : ''}>Mingguan</button>
              <button onClick={() => setPeriod('monthly')} className={period === 'monthly' ? 'active' : ''}>Bulanan</button>
            </div>
            <input
              type="text"
              placeholder="Cari nama sales..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Peringkat</th>
                  <th>Nama Sales</th>
                  <th>Email</th>
                  <th>Produk Terlaris</th>
                  <th>Total Pencapaian</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((user, index) => (
                    <tr key={user.id}>
                      <td data-label="Peringkat">{index + 1}</td>
                      <td data-label="Nama Sales">{user.name}</td>
                      <td data-label="Email">{user.email}</td>
                      <td data-label="Produk Terlaris">{user.top_product_name || '-'}</td>
                      <td data-label="Total Pencapaian" className="achievement-value">
                        {formatNumber(user.total_achievement)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">Tidak ada data untuk ditampilkan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default TopSalesDataTable;
