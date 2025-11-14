import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Data contoh untuk ditampilkan jika data asli kosong
const mockData = [
    { name: 'User A', total_achievement: 4850000 },
    { name: 'User B', total_achievement: 3900000 },
    { name: 'User C', total_achievement: 3100000 },
    { name: 'User D', total_achievement: 2780000 },
    { name: 'User E', total_achievement: 1890000 },
];

const TopUsersAchievementChart = ({ data }) => {
  // Gunakan data contoh hanya jika data asli kosong atau tidak ada
  const chartData = (Array.isArray(data) && data.length > 0) ? data : mockData;
  const isMockData = !data || data.length === 0;

  return (
    <div className="chart-wrapper">
      <h3 style={{ color: 'var(--color-text-primary)' }}>Pencapaian Pengguna Teratas</h3>
      {isMockData && <p style={{ textAlign: 'center', color: '#888', fontSize: '12px', marginTop: '-10px' }}>(Contoh data ditampilkan)</p>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="name" stroke="var(--color-text-secondary)" />
          <YAxis 
            stroke="var(--color-text-secondary)" 
            tickFormatter={(value) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value)}
          />
          <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)} />
          <Legend />
          <Bar dataKey="total_achievement" fill="var(--color-primary)" name="Total Pencapaian" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopUsersAchievementChart;