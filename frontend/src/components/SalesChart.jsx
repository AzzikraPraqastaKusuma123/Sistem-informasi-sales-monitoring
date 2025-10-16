import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesChart = ({ data }) => {
  // Jika tidak ada data atau data kosong, tampilkan pesan
  if (!data || data.length === 0) {
    return (
        <div style={{ width: '100%', height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <p>Belum ada data performa tim untuk bulan ini.</p>
        </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 350, backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <h3>Peringkat Kinerja Tim (Bulan Ini)</h3>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical" // Membuat grafik menjadi horizontal agar mudah dibaca
          margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip />
          <Legend />
          <Bar dataKey="total_achievement" fill="#8884d8" name="Total Pencapaian" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;