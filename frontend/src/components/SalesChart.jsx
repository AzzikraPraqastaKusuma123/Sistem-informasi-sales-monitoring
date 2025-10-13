// src/components/SalesChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Data dummy untuk grafik
const monthlyData = [
  { name: 'Jan', pencapaian: 400, target: 500 },
  { name: 'Feb', pencapaian: 300, target: 450 },
  { name: 'Mar', pencapaian: 500, target: 480 },
  { name: 'Apr', pencapaian: 480, target: 520 },
  { name: 'Mei', pencapaian: 590, target: 500 },
  { name: 'Jun', pencapaian: 650, target: 600 },
];

function SalesChart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>Grafik Pencapaian vs Target</h3>
      <ResponsiveContainer>
        <BarChart
          data={monthlyData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pencapaian" fill="#8884d8" name="Pencapaian" />
          <Bar dataKey="target" fill="#82ca9d" name="Target" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesChart;