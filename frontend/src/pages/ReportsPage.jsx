import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import DataTable from '../components/DataTable';
import { useAuth } from '../contexts/AuthContext';
import './ReportsPage.css';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    userId: 'all',
    productId: 'all',
  });
  const [salesUsers, setSalesUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '' && value !== 'all')
      );
      
      const { data } = await api.get('/reports', { params: activeFilters });

      const formattedData = data.map(item => ({
        ...item,
        achievement_date: new Date(item.achievement_date).toLocaleDateString('id-ID', {
          day: '2-digit', month: 'long', year: 'numeric'
        })
      }));
      setReports(formattedData);
    } catch (error) {
      console.error("Gagal memuat laporan:", error);
      alert('Gagal memuat data laporan.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [usersRes, productsRes] = await Promise.all([
          api.get('/targets/sales-users'),
          api.get('/products'),
        ]);
        setSalesUsers(usersRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error("Gagal memuat data filter", error);
      }
    };
    
    // Hanya panggil jika user bukan sales
    if (user && user.role !== 'sales') {
        fetchInitialData();
        fetchReports();
    } else {
        setLoading(false); // Selesaikan loading jika user adalah sales
    }
  }, [user, fetchReports]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilter = () => {
    fetchReports();
  };

  const headers = [
    { key: 'userName', label: 'Nama Sales' },
    { key: 'productName', label: 'Produk' },
    { key: 'achieved_value', label: 'Jumlah' },
    { key: 'achievement_date', label: 'Tanggal' },
  ];

  if (user.role === 'sales') {
    return (
      <div className="page-container">
        <h1>Akses Ditolak</h1>
        <p>Anda tidak memiliki izin untuk mengakses halaman laporan.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Laporan Penjualan</h1>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label>Dari Tanggal</label>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
        </div>
        <div className="filter-group">
          <label>Sampai Tanggal</label>
          <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
        </div>
        <div className="filter-group">
          <label>Sales</label>
          <select name="userId" value={filters.userId} onChange={handleFilterChange}>
            <option value="all">Semua Sales</option>
            {salesUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Produk</label>
          <select name="productId" value={filters.productId} onChange={handleFilterChange}>
            <option value="all">Semua Produk</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="filter-group">
            <label>&nbsp;</label>
            <button onClick={handleApplyFilter} disabled={loading}>
              {loading ? 'Memuat...' : 'Terapkan Filter'}
            </button>
        </div>
      </div>
      
      {loading ? <div>Memuat laporan...</div> : <DataTable headers={headers} data={reports} />}
    </div>
  );
};

export default ReportsPage;