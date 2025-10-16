import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import DataTable from '../components/DataTable';
import './ManageTargetsPage.css';

const ManageTargetsPage = () => {
  const [targets, setTargets] = useState([]);
  const [salesUsers, setSalesUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk form
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Mengambil semua data yang dibutuhkan secara paralel
      const [targetsRes, usersRes, productsRes] = await Promise.all([
        api.get('/targets'),
        api.get('/targets/sales-users'),
        api.get('/products')
      ]);
      
      const formattedTargets = targetsRes.data.map(t => ({
        ...t,
        period_start: new Date(t.period_start).toLocaleDateString('id-ID'),
        period_end: new Date(t.period_end).toLocaleDateString('id-ID'),
      }))
      setTargets(formattedTargets);
      setSalesUsers(usersRes.data);
      setProducts(productsRes.data);

      // Set nilai default untuk dropdown
      if (usersRes.data.length > 0) setSelectedUser(usersRes.data[0].id);
      if (productsRes.data.length > 0) setSelectedProduct(productsRes.data[0].id);

    } catch (error) {
      console.error("Gagal memuat data", error);
      alert('Gagal memuat data. Pastikan Anda memiliki hak akses.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await api.post('/targets', {
            userId: selectedUser,
            productId: selectedProduct,
            targetValue,
            periodStart,
            periodEnd,
        });
        alert('Target berhasil dibuat!');
        fetchData(); // Muat ulang data
        // Reset form
        setTargetValue('');
        setPeriodStart('');
        setPeriodEnd('');
    } catch (error) {
        alert('Gagal membuat target.');
    }
  };
  
  const handleDelete = async (target) => {
    if (window.confirm(`Yakin ingin menghapus target untuk ${target.userName} pada produk ${target.productName}?`)) {
        try {
            await api.delete(`/targets/${target.id}`);
            alert('Target berhasil dihapus');
            fetchData();
        } catch (error) {
            alert('Gagal menghapus target.');
        }
    }
  }

  const headers = [
    { key: 'userName', label: 'Nama Sales' },
    { key: 'productName', label: 'Produk' },
    { key: 'target_value', label: 'Nilai Target' },
    { key: 'period_start', label: 'Periode Mulai' },
    { key: 'period_end', label: 'Periode Selesai' },
  ];

  if (loading) return <div>Memuat data manajemen target...</div>;

  return (
    <div className="page-container">
      <h1>Manajemen Target</h1>
      
      <form onSubmit={handleSubmit} className="target-form">
        <h3>Buat Target Baru</h3>
        <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
          {salesUsers.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
        </select>
        <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
          {products.map(prod => <option key={prod.id} value={prod.id}>{prod.name}</option>)}
        </select>
        <input type="number" placeholder="Nilai Target" value={targetValue} onChange={e => setTargetValue(e.target.value)} required />
        <input type="date" placeholder="Periode Mulai" value={periodStart} onChange={e => setPeriodStart(e.target.value)} required />
        <input type="date" placeholder="Periode Selesai" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)} required />
        <button type="submit">Simpan Target</button>
      </form>

      <div className="target-list">
        <h3>Daftar Target yang Sudah Ada</h3>
        <DataTable headers={headers} data={targets} onDelete={handleDelete}/>
      </div>
    </div>
  );
};

export default ManageTargetsPage;