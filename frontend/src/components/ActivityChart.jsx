import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ActivityChart = ({ data }) => {
    const formattedData = data.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    }));

    return (
        <div className="chart-wrapper">
            <h3>Aktivitas Laporan Harian (30 Hari)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DEE2E6" />
                    <XAxis dataKey="date" stroke="var(--color-text-secondary)" />
                    <YAxis stroke="var(--color-text-secondary)" />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" name="Jumlah Laporan" stroke="#F5A623" fill="#F5A623" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ActivityChart;