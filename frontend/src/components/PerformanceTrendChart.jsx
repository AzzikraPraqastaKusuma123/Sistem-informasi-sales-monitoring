import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PerformanceTrendChart = ({ data }) => {
    const formattedData = data.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    }));

    return (
        <div className="chart-wrapper">
            <h3>Tren Pencapaian Harian (30 Hari)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" name="Total Penjualan" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PerformanceTrendChart;