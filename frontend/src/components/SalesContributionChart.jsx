import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#4A90E2', '#50E3C2', '#F5A623', '#367BBF', '#D0021B'];

const SalesContributionChart = ({ data }) => {
  const chartData = Array.isArray(data) && data.length > 0 ? data : [{ name: 'No Data', value: 1 }];
  const noData = chartData[0].name === 'No Data';

  return (
    <div className="chart-wrapper">
        <h3 style={{ color: 'var(--color-text-primary)' }}>Kontribusi Sales (Bulan Ini)</h3>
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                    label={noData ? false : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={noData ? '#E0E0E0' : COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                {!noData && <Tooltip />}
                {!noData && <Legend />}
                {noData && (
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="16" fill="#888">
                        Data Belum Tersedia
                    </text>
                )}
            </PieChart>
        </ResponsiveContainer>
    </div>
  );
};

export default SalesContributionChart;