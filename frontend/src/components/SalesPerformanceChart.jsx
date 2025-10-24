import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesPerformanceChart = ({ achievement, target }) => {
  const data = [
    { name: 'Pencapaian', value: achievement },
    { name: 'Target', value: target },
  ];

  if (!achievement && !target) {
    return (
        <div className="chart-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Belum ada data performa penjualan untuk ditampilkan.</p>
        </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <h3 style={{ color: 'var(--color-text-primary)' }}>Performa Penjualan Saya</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="name" stroke="var(--color-text-secondary)" />
          <YAxis stroke="var(--color-text-secondary)" />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="var(--color-primary)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesPerformanceChart;