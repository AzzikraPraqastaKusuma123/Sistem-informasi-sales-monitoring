import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
            <h3>Produk Terlaris (Bulan Ini)</h3>
            {isMockData && <p style={{ textAlign: 'center', color: '#888', fontSize: '12px', marginTop: '-10px' }}>(Contoh data ditampilkan)</p>}
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DEE2E6" />
                    <XAxis dataKey="name" stroke="var(--color-text-secondary)" />
                    <YAxis stroke="var(--color-text-secondary)" />
                    <Tooltip formatter={(value) => `${value} unit`} />
                    <Legend />
                    <Bar dataKey="total_sold" name="Total Terjual" fill="#50E3C2" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TopProductsChart;