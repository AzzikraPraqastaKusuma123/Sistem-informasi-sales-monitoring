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
                <p className="label">{`Pengguna: ${label}`}</p>
                <p className="intro">{`Pencapaian: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(payload[0].value)}`}</p>
            </div>
        );
    }
    return null;
};

// Data contoh untuk ditampilkan jika data asli kosong
const mockData = [
    { name: 'User A', total_achievement: 4850000 },
    { name: 'User B', total_achievement: 3900000 },
    { name: 'User C', total_achievement: 3100000 },
    { name: 'User D', total_achievement: 2780000 },
    { name: 'User E', total_achievement: 1890000 },
];

const TopUsersAchievementChart = ({ data }) => {
  // Gunakan data contoh hanya jika data asli kosong atau tidak ada
  const chartData = (Array.isArray(data) && data.length > 0) ? data : mockData;
  const isMockData = !data || data.length === 0;

  return (
    <div className="chart-wrapper">
      <h3>Pencapaian Pengguna Teratas</h3>
      {isMockData && <p style={{ textAlign: 'center', color: '#888', fontSize: '12px', marginTop: '-10px' }}>(Contoh data ditampilkan)</p>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
            dataKey="total_achievement" 
            fill={PRIMARY_COLOR} 
            name="Total Pencapaian" 
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

export default TopUsersAchievementChart;