import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TopUsersAchievementChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
        <div className="chart-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Belum ada data pencapaian pengguna teratas.</p>
        </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <h3 style={{ color: 'var(--color-text-primary)' }}>Pencapaian Pengguna Teratas</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="name" stroke="var(--color-text-secondary)" />
          <YAxis stroke="var(--color-text-secondary)" />
          <Tooltip />
          <Legend />
          <Bar dataKey="total_achievement" fill="var(--color-primary)" name="Total Pencapaian" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopUsersAchievementChart;