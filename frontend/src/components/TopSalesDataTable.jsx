import React, { useState, useEffect, useMemo } from 'react';
import api from '../api';
import { useNotification } from '../contexts/NotificationContext';
import './TopSalesDataTable.css';

const TopSalesDataTable = () => {
  const [data, setData] = useState([]);
  const [recap, setRecap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');
  const [searchTerm, setSearchTerm] = useState('');
  const { showError } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/dashboard/top-sales-table?period=${period}`);
        setData(res.data.data);
        setRecap(res.data.recap);
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="top-sales-data-table-wrapper">
      <h3 className="table-title">Peringkat Pencapaian Sales</h3>
      
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

      {loading ? (
        <div className="loading-state">Memuat data...</div>
      ) : (
        <>
          <div className="recap-section">
            <div className="recap-item">
              <span className="recap-label">Total Sales Aktif:</span>
              <span className="recap-value">{recap?.count || 0}</span>
            </div>
            <div className="recap-item">
              <span className="recap-label">Total Pencapaian ({period}):</span>
              <span className="recap-value">{formatCurrency(recap?.total || 0)}</span>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Peringkat</th>
                  <th>Nama Sales</th>
                  <th>Email</th>
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
                      <td data-label="Total Pencapaian" className="achievement-value">
                        {formatCurrency(user.total_achievement)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">Tidak ada data untuk ditampilkan.</td>
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
