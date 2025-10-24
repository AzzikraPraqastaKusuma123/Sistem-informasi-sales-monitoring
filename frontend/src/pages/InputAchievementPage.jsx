import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useNotification } from '../contexts/NotificationContext'; // Import useNotification
import './InputAchievementPage.css';

const InputAchievementPage = () => {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [achievedValue, setAchievedValue] = useState('');
  const [achievementDate, setAchievementDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [achievementHistory, setAchievementHistory] = useState([]); // State untuk riwayat pencapaian
  const [filterRange, setFilterRange] = useState('today'); // 'today', 'last7days', 'thismonth', 'alltime', 'custom'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const { showSuccess, showError } = useNotification(); // Inisialisasi useNotification

  const fetchAchievementHistory = useCallback(async (range, start, end) => {
    try {
      let url = '/achievements/history';
      const params = {};

      const today = new Date();
      const yyyy_mm_dd = (date) => date.toISOString().split('T')[0];

      if (range === 'today') {
        params.startDate = yyyy_mm_dd(today);
        params.endDate = yyyy_mm_dd(today);
      } else if (range === 'last7days') {
        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - 6);
        params.startDate = yyyy_mm_dd(last7Days);
        params.endDate = yyyy_mm_dd(today);
      } else if (range === 'thismonth') {
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        params.startDate = yyyy_mm_dd(firstDayOfMonth);
        params.endDate = yyyy_mm_dd(today);
      } else if (range === 'custom' && start && end) {
        params.startDate = start;
        params.endDate = end;
      }
      // Jika 'alltime' atau tidak ada filter, tidak perlu params

      const { data } = await api.get(url, { params });
      setAchievementHistory(data);
    } catch (error) {
      showError('Error: Gagal memuat riwayat pencapaian.');
    }
  }, [showError]);

  useEffect(() => {
    // Ambil daftar produk dari backend untuk dropdown
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
        if (data.length > 0) {
          setProductId(data[0].id); // Set produk pertama sebagai default
        }
      } catch (error) {
        showError('Error: Gagal memuat daftar produk.');
      }
    };
    fetchProducts();
    fetchAchievementHistory(filterRange, customStartDate, customEndDate); // Muat riwayat saat komponen dimuat atau filter berubah
  }, [showError, fetchAchievementHistory, filterRange, customStartDate, customEndDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId || !achievedValue || !achievementDate) {
      showError('Semua kolom wajib diisi.');
      return;
    }

    setLoading(true);

    try {
      // Kirim data ke backend dengan endpoint yang benar
      await api.post('/achievements', {
        productId: parseInt(productId),
        achievedValue: parseInt(achievedValue),
        achievementDate,
      });
      showSuccess('Laporan pencapaian berhasil disimpan!');
      setAchievedValue(''); // Kosongkan input jumlah setelah berhasil
      fetchAchievementHistory(filterRange, customStartDate, customEndDate); // Muat ulang riwayat pencapaian setelah submit
    } catch (error) {
      // Menampilkan pesan error dari backend jika ada
      const errorText = error.response?.data?.message || 'Gagal menyimpan laporan.';
      showError(`Error: ${errorText}`);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatDay = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', { weekday: 'short' });
  };

  return (
    <div className="page-container input-achievement-page">
      <div className="page-header">
        <h1>Input Pencapaian Harian</h1>
      </div>
      <div className="achievement-content-wrapper">
        <div className="achievement-history-section">
          <h3>Riwayat Pencapaian</h3>
          <div className="history-filters">
            <select value={filterRange} onChange={(e) => setFilterRange(e.target.value)}>
              <option value="today">Hari Ini</option>
              <option value="last7days">7 Hari Terakhir</option>
              <option value="thismonth">Bulan Ini</option>
              <option value="alltime">Sepanjang Waktu</option>
              <option value="custom">Kustom</option>
            </select>
            {filterRange === 'custom' && (
              <div className="custom-date-range">
                <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} />
                <span>-</span>
                <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} />
              </div>
            )}
          </div>
          {achievementHistory.length > 0 ? (
            <div className="history-table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Waktu</th>
                    <th>Hari</th>
                    <th>Tanggal</th>
                    <th>Produk</th>
                    <th>Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {achievementHistory.map((item) => (
                    <tr key={item.id}>
                      <td>{formatTime(item.inputTime)}</td>
                      <td>{formatDay(item.achievement_date)}</td>
                      <td>{formatDate(item.achievement_date)}</td>
                      <td>{item.productName}</td>
                      <td>{item.achievedValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Belum ada pencapaian untuk rentang waktu ini.</p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="achievement-form">
          <h3>Form Input Pencapaian</h3>
          <div className="form-group">
            <label htmlFor="product">Produk</label>
            <select id="product" value={productId} onChange={(e) => setProductId(e.target.value)} required>
              {products.length === 0 ? (
                  <option disabled>Memuat produk...</option>
              ) : (
                  products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                  ))
              )}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="achievedValue">Jumlah / Nilai Tercapai</label>
            <input
              id="achievedValue"
              type="number"
              value={achievedValue}
              onChange={(e) => setAchievedValue(e.target.value)}
              placeholder="Contoh: 10"
              required
              min="1"
            />
          </div>
          <div className="form-group">
            <label htmlFor="achievementDate">Tanggal Pencapaian</label>
            <input
              id="achievementDate"
              type="date"
              value={achievementDate}
              onChange={(e) => setAchievementDate(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Laporan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputAchievementPage;