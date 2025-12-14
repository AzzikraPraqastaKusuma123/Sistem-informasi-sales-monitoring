import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import DataTable from '../components/DataTable';
import UserAchievementChart from '../components/UserAchievementChart'; // Import the new chart component
import './MyAchievementsPage.css'; // Import the new CSS file

const MyAchievementsPage = () => {
  const [achievements, setAchievements] = useState([]); // Raw data for the chart
  const [tableData, setTableData] = useState([]); // Formatted data for the table
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyAchievements = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/achievements/my');
      
      // Set raw data for the chart
      setAchievements(data);

      // Create and set formatted data for the table
      const formattedData = data.map(item => ({
        ...item,
        achievement_date: new Date(item.inputTime).toLocaleString('id-ID', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit', hour12: false
        })
      }));
      setTableData(formattedData);

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

  if (loading) return <div className="page-container my-achievements-page">Memuat riwayat...</div>;
  if (error) return <div className="page-container my-achievements-page" style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="page-container my-achievements-page">
      <div className="page-header">
        <h1>Riwayat Pencapaian Saya</h1>
      </div>
      <div className="chart-container">
        <UserAchievementChart data={achievements} />
      </div>
      <div className="data-table-wrapper">
        <DataTable headers={headers} data={tableData} />
      </div>
    </div>
  );
};

export default MyAchievementsPage;