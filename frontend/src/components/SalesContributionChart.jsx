import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#4A90E2', '#50E3C2', '#F5A623', '#367BBF', '#D0021B'];

const SalesContributionChart = ({ data }) => {
  // Jika tidak ada data atau data kosong, tampilkan pesan
  if (!data || data.length === 0) {
    return (
        <div className="chart-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Belum ada data kontribusi sales untuk bulan ini.</p>
        </div>
    );
  }

  return (
    <div className="chart-wrapper">
        <h3 style={{ color: 'var(--color-text-primary)' }}>Kontribusi Sales (Bulan Ini)</h3>
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    </div>
  );
};

export default SalesContributionChart;