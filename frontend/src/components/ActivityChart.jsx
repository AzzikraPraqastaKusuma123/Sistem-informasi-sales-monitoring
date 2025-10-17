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
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" name="Jumlah Laporan" stroke="#ffc658" fill="#ffc658" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ActivityChart;