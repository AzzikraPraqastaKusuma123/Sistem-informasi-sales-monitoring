import React from 'react';
import DataTable from './DataTable';
import './ProductDataTable.css';

const ProductDataTable = ({ data, loading, period }) => {
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const headers = [
    { label: 'Nama Produk', key: 'name' },
    {
      label: 'Total Nilai Penjualan',
      key: 'total_value',
      customRenderer: (row) => `${formatNumber(row.total_value)}`,
    },
    {
      label: 'Aktivitas Terakhir',
      key: 'lastActivityTime',
      customRenderer: (row) => {
        if (!row.lastActivityTime) return '-';
        const date = new Date(row.lastActivityTime);
        return new Intl.DateTimeFormat('id-ID', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }).format(date);
      },
    },
  ];

  const periodTitle = {
    daily: 'Harian',
    weekly: 'Mingguan',
    monthly: 'Bulanan',
  };

  if (loading) {
    return (
      <div className="product-data-table-container">
        <h3>Produk Terlaris</h3>
        <p>Memuat data produk...</p>
      </div>
    );
  }

  return (
    <div className="product-data-table-container">
      <h3>Produk Terlaris ({periodTitle[period]})</h3>
      {data && data.length > 0 ? (
        <DataTable headers={headers} data={data} />
      ) : (
        <p>Tidak ada data penjualan produk untuk periode ini.</p>
      )}
    </div>
  );
};

export default ProductDataTable;
