import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#4A90E2', '#50E3C2', '#F5A623', '#367BBF', '#D0021B'];

// Data contoh untuk ditampilkan jika data asli kosong
const mockData = [
  { name: 'Sales A', value: 4500000 },
  { name: 'Sales B', value: 3200000 },
  { name: 'Sales C', value: 2800000 },
  { name: 'Sales D', value: 1500000 },
];

const SalesContributionChart = ({ data }) => {
  // Gunakan data contoh hanya jika data asli kosong atau tidak ada
  const chartData = (Array.isArray(data) && data.length > 0) ? data : mockData;
  const isMockData = !data || data.length === 0;

  return (
    <div className="chart-wrapper">
        <h3 style={{ color: 'var(--color-text-primary)' }}>Kontribusi Sales (Bulan Ini)</h3>
        {isMockData && <p style={{ textAlign: 'center', color: '#888', fontSize: '12px', marginTop: '-10px' }}>(Contoh data ditampilkan)</p>}
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    </div>
  );
};

export default SalesContributionChart;