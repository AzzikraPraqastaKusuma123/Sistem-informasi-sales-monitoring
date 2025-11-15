import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api';
import { useNotification } from '../contexts/NotificationContext';
import './ProductPieChart.css';

const COLORS = ['#4A90E2', '#50E3C2', '#F5A623', '#367BBF', '#D0021B', '#8E44AD', '#27AE60'];

const ProductPieChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly'); // Default to monthly
  const { showError } = useNotification();

  // Data contoh untuk ditampilkan jika data asli kosong
  const mockData = [
    { name: 'Produk X', value: 50 },
    { name: 'Produk Y', value: 30 },
    { name: 'Produk Z', value: 20 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/dashboard/product-pie-chart?period=${period}`);
        setData(res.data);
      } catch (err) {
        showError('Gagal memuat data produk terlaris.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period, showError]);

  const chartData = (Array.isArray(data) && data.length > 0) ? data : mockData;
  const isMockData = !data || data.length === 0;

  return (
    <div className="product-pie-chart-wrapper chart-wrapper">
      <h3>Produk Terlaris</h3>
      {isMockData && <p style={{ textAlign: 'center', color: '#888', fontSize: '12px', marginTop: '-10px' }}>(Contoh data ditampilkan)</p>}

      <div className="product-pie-chart-controls">
        <button onClick={() => setPeriod('weekly')} className={period === 'weekly' ? 'active' : ''}>Mingguan</button>
        <button onClick={() => setPeriod('monthly')} className={period === 'monthly' ? 'active' : ''}>Bulanan</button>
      </div>

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
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} unit`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductPieChart;
