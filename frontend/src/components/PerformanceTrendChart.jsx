import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Data contoh untuk 30 hari terakhir
const generateMockData = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
            date: date.toISOString().split('T')[0], // Format YYYY-MM-DD
            total: Math.floor(Math.random() * (5000000 - 500000 + 1)) + 500000,
        });
    }
    return data;
};

const PerformanceTrendChart = ({ data }) => {
    const isMockData = !data || data.length === 0;
    const chartData = isMockData ? generateMockData() : data;

    const formattedData = chartData.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    }));

    return (
        <div className="chart-wrapper">
            <h3>Tren Pencapaian Harian (30 Hari)</h3>
            {isMockData && <p style={{ textAlign: 'center', color: '#888', fontSize: '12px', marginTop: '-10px' }}>(Contoh data ditampilkan)</p>}
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DEE2E6" />
                    <XAxis dataKey="date" stroke="var(--color-text-secondary)" />
                    <YAxis 
                        stroke="var(--color-text-secondary)"
                        tickFormatter={(value) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value)}
                    />
                    <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)} />
                    <Legend />
                    <Line type="monotone" dataKey="total" name="Total Penjualan" stroke="#4A90E2" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PerformanceTrendChart;