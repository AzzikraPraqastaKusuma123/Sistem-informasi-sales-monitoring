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
        const data = payload[0].payload; // The full data object for the point
        return (
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#333',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                border: '1px solid #ddd'
            }}>
                <p className="label" style={{ fontWeight: 'bold', marginBottom: '8px' }}>Tanggal: {label}</p>
                <p className="intro" style={{ color: PRIMARY_COLOR, fontWeight: '600' }}>
                  Total Jumlah: {new Intl.NumberFormat('id-ID').format(data.totalAchieved)}
                </p>
                <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #eee' }} />
                <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.9em' }}>
                    {data.products && data.products.map((product, index) => (
                        <li key={index} style={{ marginBottom: '4px' }}>
                            {product.name}: {new Intl.NumberFormat('id-ID').format(product.value)}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
    return null;
};

const UserAchievementChart = ({ data }) => {
  // Ensure data is sorted by date for proper trend visualization
  const sortedData = [...data].sort((a, b) => new Date(a.achievement_date) - new Date(b.achievement_date));

  // Aggregate data by date to sum up achieved_value and collect product details
  const aggregatedData = sortedData.reduce((acc, item) => {
    const date = new Date(item.achievement_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    if (!acc[date]) {
      acc[date] = { date, totalAchieved: 0, products: [] };
    }
    acc[date].totalAchieved += item.achieved_value;
    acc[date].products.push({ name: item.productName, value: item.achieved_value });
    return acc;
  }, {});

  const chartData = Object.values(aggregatedData);

  if (!chartData || chartData.length === 0) {
    return (
        <div className="chart-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
            <p>Belum ada data pencapaian untuk ditampilkan dalam grafik.</p>
        </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <h3>Tren Pencapaian Saya</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} /> {/* Thin, soft gridlines */}
          <XAxis dataKey="date" stroke="var(--color-text-secondary)" tickLine={false} axisLine={false} />
          <YAxis 
            stroke="var(--color-text-secondary)" 
            tickFormatter={(value) => new Intl.NumberFormat('id-ID').format(value)}
            tickLine={false} axisLine={false}
            tick={{ fontSize: 10 }} // Reduce font size
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