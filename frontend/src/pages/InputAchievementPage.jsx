import React, { useState, useEffect } from 'react';
import api from '../api';
import './InputAchievementPage.css';

const InputAchievementPage = () => {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [achievedValue, setAchievedValue] = useState('');
  const [achievementDate, setAchievementDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // Menggunakan state tunggal untuk pesan

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
        setMessage('Error: Gagal memuat daftar produk.');
        console.error('Failed to fetch products', error);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId || !achievedValue || !achievementDate) {
      setMessage('Semua kolom wajib diisi.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Kirim data ke backend dengan endpoint yang benar
      await api.post('/achievements', {
        productId: parseInt(productId),
        achievedValue: parseInt(achievedValue),
        achievementDate,
      });
      setMessage('Laporan pencapaian berhasil disimpan!');
      setAchievedValue(''); // Kosongkan input jumlah setelah berhasil
    } catch (error) {
      // Menampilkan pesan error dari backend jika ada
      const errorText = error.response?.data?.message || 'Gagal menyimpan laporan.';
      setMessage(`Error: ${errorText}`);
      console.error(error); // Tampilkan detail error di console
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Input Pencapaian Harian</h1>
      </div>
      <form onSubmit={handleSubmit} className="achievement-form">
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
        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default InputAchievementPage;