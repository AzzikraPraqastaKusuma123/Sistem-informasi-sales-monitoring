import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Skydash Theme Colors
const PRIMARY_COLOR = '#4B49AC';
const LIGHT_BLUE = '#98BDFF';
const SOFT_BLUE = '#7DA0FA';
const SOFT_PURPLE = '#7978E9';
const PINK_CORAL = '#F3797E';

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: SOFT_BLUE,
                color: '#333', // Dark text
                borderRadius: '5px',
                padding: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                border: 'none'
            }}>
                <p className="label">{`${label}`}</p>
                <p className="intro">{`Nilai: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(payload[0].value)}`}</p>
            </div>
        );
    }
    return null;
};

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
      <h3>Performa Penjualan Saya</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} /> {/* Thin, soft gridlines */}
          <XAxis dataKey="name" stroke="var(--color-text-secondary)" tickLine={false} axisLine={false} />
          <YAxis 
            stroke="var(--color-text-secondary)" 
            tickFormatter={(value) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value)}
            tickLine={false} axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="value" 
            fill={PRIMARY_COLOR} 
            radius={[5, 5, 0, 0]} // Slightly rounded bar corners
            barSize={30} // Adjust bar size
            isAnimationActive={true}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesPerformanceChart;