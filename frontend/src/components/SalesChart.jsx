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
                <p className="label">{`Sales: ${label}`}</p>
                <p className="intro">{`Pencapaian: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(payload[0].value)}`}</p>
            </div>
        );
    }
    return null;
};

const SalesChart = ({ data }) => {
  // Jika tidak ada data atau data kosong, tampilkan pesan
  if (!data || data.length === 0) {
    return (
        <div className="chart-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Belum ada data performa tim untuk bulan ini.</p>
        </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <h3>Peringkat Kinerja Tim (Bulan Ini)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} /> {/* Thin, soft gridlines */}
          <XAxis 
            type="number" 
            stroke="var(--color-text-secondary)" 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value)}
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={100} 
            stroke="var(--color-text-secondary)" 
            tickLine={false} 
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="total_achievement" 
            fill={PRIMARY_COLOR} 
            name="Total Pencapaian" 
            radius={[5, 5, 0, 0]} // Slightly rounded bar corners (top-right, bottom-right)
            barSize={20} // Adjust bar size for better appearance
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;