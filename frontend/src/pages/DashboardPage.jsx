// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import SalesChart from '../components/SalesChart';
import API from '../api'; // Impor API
import './DashboardPage.css';

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await API.get('/dashboard/summary');
        setSummary(response.data);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
        // Handle error, mungkin redirect ke login jika token tidak valid
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []); // Array kosong berarti useEffect hanya berjalan sekali

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard Kinerja Sales</h1>

      <div className="summary-cards">
        {summary && (
          <>
            <Card title="Total Pencapaian" value={summary.totalPencapaian} icon="🎯" />
            <Card title="Produk Terjual" value={summary.produkTerjual} icon="📦" />
            <Card title="Target Tercapai" value={summary.targetTercapai} icon="🏆" />
            <Card title="Sales Terbaik" value={summary.salesTerbaik} icon="🥇" />
          </>
        )}
      </div>

      <div className="charts-area">
        <SalesChart />
      </div>
    </div>
  );
}

export default DashboardPage;