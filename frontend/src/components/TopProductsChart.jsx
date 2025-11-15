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
                <p className="label">{`Produk: ${label}`}</p>
                <p className="intro">{`Total Terjual: ${payload[0].value} unit`}</p>
            </div>
        );
    }
    return null;
};

// Data contoh untuk ditampilkan jika data asli kosong
const mockData = [
    { name: 'Produk A', total_sold: 120 },
    { name: 'Produk B', total_sold: 98 },
    { name: 'Produk C', total_sold: 86 },
    { name: 'Produk D', total_sold: 75 },
    { name: 'Produk E', total_sold: 45 },
];

const TopProductsChart = ({ data }) => {
    const isMockData = !data || data.length === 0;
    const chartData = isMockData ? mockData : data;

    return (
        <div className="chart-wrapper">
            <h3>Produk Terlaris</h3>
            {isMockData && <p style={{ textAlign: 'center', color: '#888', fontSize: '12px', marginTop: '-10px' }}>(Contoh data ditampilkan)</p>}
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} /> {/* Thin, soft gridlines */}
                    <XAxis type="number" stroke="var(--color-text-secondary)" tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="name" stroke="var(--color-text-secondary)" width={80} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                        dataKey="total_sold" 
                        name="Total Terjual" 
                        fill={PRIMARY_COLOR} 
                        radius={[5, 5, 0, 0]} // Slightly rounded bar corners
                        barSize={20} // Adjust bar size
                        isAnimationActive={true}
                        animationDuration={800}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TopProductsChart;