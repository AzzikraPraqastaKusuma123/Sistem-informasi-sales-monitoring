import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TopProductsChart = ({ data }) => {
    return (
        <div className="chart-wrapper">
            <h3>Produk Terlaris (Bulan Ini)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DEE2E6" />
                    <XAxis dataKey="name" stroke="var(--color-text-secondary)" />
                    <YAxis stroke="var(--color-text-secondary)" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total_sold" name="Total Terjual" fill="#50E3C2" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TopProductsChart;