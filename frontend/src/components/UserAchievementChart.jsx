import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
                <p className="label">{`Tanggal: ${label}`}</p>
                <p className="intro">{`Total Pencapaian: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(payload[0].value)}`}</p>
            </div>
        );
    }
    return null;
};

const UserAchievementChart = ({ data }) => {
  // Ensure data is sorted by date for proper trend visualization
  const sortedData = [...data].sort((a, b) => new Date(a.achievement_date) - new Date(b.achievement_date));

  // Aggregate data by date to sum up achieved_value for each day
  const aggregatedData = sortedData.reduce((acc, item) => {
    const date = new Date(item.achievement_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    if (!acc[date]) {
      acc[date] = { date, totalAchieved: 0 };
    }
    acc[date].totalAchieved += item.achieved_value;
    return acc;
  }, {});

  const chartData = Object.values(aggregatedData);

  if (!chartData || chartData.length === 0) {
    return (
        <div className="chart-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Belum ada data pencapaian untuk ditampilkan dalam grafik.</p>
        </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <h3>Tren Pencapaian Saya</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} /> {/* Thin, soft gridlines */}
          <XAxis dataKey="date" stroke="var(--color-text-secondary)" tickLine={false} axisLine={false} />
          <YAxis 
            stroke="var(--color-text-secondary)" 
            tickFormatter={(value) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value)}
            tickLine={false} axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="totalAchieved" 
            name="Total Pencapaian" 
            stroke={PRIMARY_COLOR} 
            activeDot={{ r: 6, fill: LIGHT_BLUE, stroke: PRIMARY_COLOR, strokeWidth: 2 }} // Data points
            isAnimationActive={true}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserAchievementChart;