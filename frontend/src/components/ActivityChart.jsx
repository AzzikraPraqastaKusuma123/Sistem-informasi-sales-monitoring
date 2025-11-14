import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Data contoh untuk 30 hari terakhir
const generateMockData = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
            date: date.toISOString().split('T')[0], // Format YYYY-MM-DD
            count: Math.floor(Math.random() * (15 - 2 + 1)) + 2,
        });
    }
    return data;
};

const ActivityChart = ({ data }) => {
    const isMockData = !data || data.length === 0;
    const chartData = isMockData ? generateMockData() : data;

    const formattedData = chartData.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    }));

    return (
        <div className="chart-wrapper">
            <h3>Aktivitas Laporan Harian (30 Hari)</h3>
            {isMockData && <p style={{ textAlign: 'center', color: '#888', fontSize: '12px', marginTop: '-10px' }}>(Contoh data ditampilkan)</p>}
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DEE2E6" />
                    <XAxis dataKey="date" stroke="var(--color-text-secondary)" />
                    <YAxis stroke="var(--color-text-secondary)" allowDecimals={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" name="Jumlah Laporan" stroke="#F5A623" fill="#F5A623" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ActivityChart;