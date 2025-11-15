import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
                border: 'none' // Ensure no default border
            }}>
                <p className="label">{`Tanggal: ${label}`}</p>
                <p className="intro">{`Jumlah Laporan: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

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
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} /> {/* Thin, soft gridlines */}
                    <XAxis dataKey="date" stroke="var(--color-text-secondary)" tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--color-text-secondary)" allowDecimals={false} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="count"
                        name="Jumlah Laporan"
                        stroke={PRIMARY_COLOR} // Outline stroke
                        fillOpacity={0.4} // 40% opacity
                        fill="url(#colorCount)" // Gradient fill
                        isAnimationActive={true} // Smooth entrance animation
                        animationDuration={800}
                    />
                    {/* Define gradient for area fill */}
                    <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={LIGHT_BLUE} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={LIGHT_BLUE} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ActivityChart;