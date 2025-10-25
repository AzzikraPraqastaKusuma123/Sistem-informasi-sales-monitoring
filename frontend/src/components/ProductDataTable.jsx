import React, { useState, useEffect } from 'react';
import api from '../api';
import DataTable from './DataTable';
import { useNotification } from '../contexts/NotificationContext';

const ProductDataTable = () => {
  const [data, setData] = useState({ daily: [], weekly: [], monthly: [] });
  const [loading, setLoading] = useState(true);
  const { showError } = useNotification();

  useEffect(() => {
    api.get('/dashboard/sales/product-sales')
      .then(res => setData(res.data))
      .catch(() => showError('Gagal memuat data penjualan produk.'))
      .finally(() => setLoading(false));
  }, [showError]);

  const headers = [
    { label: 'Nama Produk', key: 'name' },
    { label: 'Total Terjual', key: 'total_sold' },
  ];

  if (loading) return <div>Memuat data produk...</div>;

  return (
    <div className="product-data-table-container">
      <h3>Produk Terlaris</h3>
      <div className="product-data-tables">
        <div className="product-data-table">
          <h4>Harian</h4>
          <DataTable headers={headers} data={data.daily} />
        </div>
        <div className="product-data-table">
          <h4>Mingguan</h4>
          <DataTable headers={headers} data={data.weekly} />
        </div>
        <div className="product-data-table">
          <h4>Bulanan</h4>
          <DataTable headers={headers} data={data.monthly} />
        </div>
      </div>
    </div>
  );
};

export default ProductDataTable;
