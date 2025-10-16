import React, { useState, useEffect } from 'react';
import api from '../api';
import DataTable from '../components/DataTable'; // Menggunakan kembali DataTable

const MyAchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyAchievements = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/achievements/my');
        // Format tanggal agar lebih mudah dibaca
        const formattedData = data.map(item => ({
          ...item,
          achievement_date: new Date(item.achievement_date).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric'
          })
        }));
        setAchievements(formattedData);
      } catch (err) {
        setError('Gagal memuat riwayat pencapaian.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyAchievements();
  }, []);

  const headers = [
    { key: 'productName', label: 'Nama Produk' },
    { key: 'achieved_value', label: 'Jumlah' },
    { key: 'achievement_date', label: 'Tanggal' },
  ];

  if (loading) return <div>Memuat riwayat...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="page-container">
      <h1>Riwayat Pencapaian Saya</h1>
      <DataTable headers={headers} data={achievements} />
    </div>
  );
};

export default MyAchievementsPage;