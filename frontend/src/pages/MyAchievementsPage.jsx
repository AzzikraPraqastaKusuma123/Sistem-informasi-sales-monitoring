import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import DataTable from '../components/DataTable';
import UserAchievementChart from '../components/UserAchievementChart'; // Import the new chart component

const MyAchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyAchievements = useCallback(async () => {
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
      setAchievements(data); // Keep original data for chart, formatted for table
    } catch (err) {
      setError('Gagal memuat riwayat pencapaian.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyAchievements();
  }, [fetchMyAchievements]);

  const headers = [
    { key: 'productName', label: 'Nama Produk' },
    { key: 'achieved_value', label: 'Jumlah' },
    { key: 'achievement_date', label: 'Tanggal' },
  ];

  if (loading) return <div className="page-container">Memuat riwayat...</div>;
  if (error) return <div className="page-container" style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Riwayat Pencapaian Saya</h1>
      </div>
      <UserAchievementChart data={achievements} />
      <div style={{ marginTop: '2rem' }}>
        <DataTable headers={headers} data={achievements} />
      </div>
    </div>
  );
};

export default MyAchievementsPage;