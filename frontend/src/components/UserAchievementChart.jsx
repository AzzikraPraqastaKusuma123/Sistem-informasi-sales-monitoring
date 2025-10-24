import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserAchievementChart = ({ data }) => {
  // Ensure data is sorted by date for proper trend visualization
  const sortedData = [...data].sort((a, b) => new Date(a.achievement_date) - new Date(b.achievement_date));

  // Aggregate data by date to sum up achieved_value for each day
  const aggregatedData = sortedData.reduce((acc, item) => {
    const date = new Date(item.achievement_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    if (!acc[date]) {
      acc[date] = { date, totalAchieved: 0 };
    }
    acc[date].totalAchieved += item.achieved_value;
    return acc;
  }, {});

  const chartData = Object.values(aggregatedData);

  if (!chartData || chartData.length === 0) {
    return (
        <div className="chart-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Belum ada data pencapaian untuk ditampilkan dalam grafik.</p>
        </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <h3 style={{ color: 'var(--color-text-primary)' }}>Tren Pencapaian Saya</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="date" stroke="var(--color-text-secondary)" />
          <YAxis stroke="var(--color-text-secondary)" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalAchieved" name="Total Pencapaian" stroke="var(--color-primary)" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserAchievementChart;