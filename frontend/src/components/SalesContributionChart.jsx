import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Skydash Theme Colors for Pie Chart (Max 4 main colors)
const PIE_COLORS = ['#4B49AC', '#7DA0FA', '#98BDFF', '#F3797E'];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#333',
                borderRadius: '5px',
                padding: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                border: '1px solid #ddd'
            }}>
                <p className="label">{`${payload[0].name}`}</p>
                <p className="intro">{`Kontribusi: ${new Intl.NumberFormat('id-ID').format(payload[0].value)}`}</p>
            </div>
        );
    }
    return null;
};

const SalesContributionChart = ({ data, loading, period }) => {
  const periodTitle = {
    daily: 'Harian',
    weekly: 'Mingguan',
    monthly: 'Bulanan',
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Jangan tampilkan label jika persentase terlalu kecil
    if (percent < 0.05) return null;

    return (
      <text x={x} y={y} fill="#fff" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="chart-wrapper">
        <h3 style={{ marginTop: '2rem' }}>Kontribusi Produk ({periodTitle[period] || 'Bulan Ini'})</h3>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>Memuat data chart...</div>
        ) : (!data || data.length === 0) ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, color: '#888' }}>Tidak ada data kontribusi untuk periode ini.</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                  <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={110}
                      dataKey="value"
                      nameKey="name"
                      isAnimationActive={true}
                      animationDuration={800}
                  >
                      {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
              </PieChart>
          </ResponsiveContainer>
        )}
    </div>
  );
};

export default SalesContributionChart;