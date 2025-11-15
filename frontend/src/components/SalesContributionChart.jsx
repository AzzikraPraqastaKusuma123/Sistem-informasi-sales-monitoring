import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
                <p className="intro">{`Kontribusi: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(payload[0].value)}`}</p>
            </div>
        );
    }
    return null;
};

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
    <div className="chart-wrapper">
        <h3>Kontribusi Sales (Bulan Ini)</h3>
        {isMockData && <p style={{ textAlign: 'center', color: '#888', fontSize: '12px', marginTop: '-10px' }}>(Contoh data ditampilkan)</p>}
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel} // Use custom label renderer
                    outerRadius={100} // Slightly larger
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

export default SalesContributionChart;