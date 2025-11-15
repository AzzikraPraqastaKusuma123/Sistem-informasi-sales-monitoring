import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';
import api from '../api';
import { useNotification } from '../contexts/NotificationContext';
import './ProductPieChart.css';

// Skydash Theme Colors for Pie Chart (Max 4 main colors)
const PIE_COLORS = ['#4B49AC', '#7DA0FA', '#98BDFF', '#F3797E']; // Pink Coral for the most important section

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: '#7DA0FA', // Soft blue
                color: '#333', // Dark text
                borderRadius: '5px',
                padding: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                border: 'none'
            }}>
                <p className="label">{`${payload[0].name}`}</p>
                <p className="intro">{`Jumlah: ${payload[0].value} unit`}</p>
            </div>
        );
    }
    return null;
};

// Data contoh untuk ditampilkan jika data asli kosong
const mockData = [
    { name: 'Produk X', value: 50 },
    { name: 'Produk Y', value: 30 },
    { name: 'Produk Z', value: 20 },
    { name: 'Produk W', value: 10 },
];

const ProductPieChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly'); // Default to monthly
  const { showError } = useNotification();

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

  // Custom label for Pie Chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="#333" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" style={{ fontSize: '12px' }}>
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

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
            label={renderCustomizedLabel} // Use custom label renderer
            outerRadius={100} // Slightly larger
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            isAnimationActive={true} // Smooth animation
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductPieChart;
