// src/pages/ReportsPage.jsx
import React from 'react';
import DataTable from '../components/DataTable'; // Komponen tabel yang akan kita buat
import './ReportsPage.css';

// Data dummy untuk tabel laporan
const dummyReportsData = [
  { id: 1, tanggal: '2025-10-12', namaSales: 'Andi', produk: 'TAB REG', jumlah: 5 },
  { id: 2, tanggal: '2025-10-12', namaSales: 'Bagus', produk: 'MTB', jumlah: 2 },
  { id: 3, tanggal: '2025-10-11', namaSales: 'Nisa', produk: 'CC', jumlah: 1 },
  { id: 4, tanggal: '2025-10-11', namaSales: 'Andi', produk: 'AXA', jumlah: 1 },
  { id: 5, tanggal: '2025-10-10', namaSales: 'Roy', produk: 'TAB NOW', jumlah: 3 },
];

// Konfigurasi kolom untuk tabel
const columns = [
  { Header: 'Tanggal', accessor: 'tanggal' },
  { Header: 'Nama Sales', accessor: 'namaSales' },
  { Header: 'Produk', accessor: 'produk' },
  { Header: 'Jumlah', accessor: 'jumlah' },
];

function ReportsPage() {
  return (
    <div className="reports-page">
      <h1>Laporan Penjualan</h1>

      <div className="filters-container">
        <select>
          <option>Semua Periode</option>
          <option>Bulan Ini</option>
          <option>Minggu Ini</option>
        </select>
        <select>
          <option>Semua Sales</option>
          <option>Andi</option>
          <option>Bagus</option>
        </select>
        <button>Terapkan Filter</button>
        <button className="export-button">Ekspor ke Excel</button>
      </div>

      <div className="table-container">
        <DataTable columns={columns} data={dummyReportsData} />
      </div>
    </div>
  );
}

export default ReportsPage;