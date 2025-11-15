import React from 'react';
import './Card.css';

const Card = ({ title, value, unit = '' }) => {
  // Fungsi untuk memberi warna berbeda pada setiap card icon area
  const getCardColor = (cardTitle) => {
    switch (cardTitle) {
      case 'Total Pengguna':
        return { background: 'rgba(0, 123, 255, 0.1)', color: 'var(--color-primary)' };
      case 'Total Produk':
        return { background: 'rgba(40, 167, 69, 0.1)', color: 'var(--color-success)' };
      case 'Total Laporan Masuk':
        return { background: 'rgba(255, 193, 7, 0.1)', color: '#ffc107' };
      default:
        return {};
    }
  };

  return (
    <div className="card">
      <div className="card-icon-area" style={getCardColor(title)}>
        {/* Ikon bisa ditambahkan di sini nanti, contoh: <i className="fas fa-users"></i> */}
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-value">
          {value !== null && value !== undefined ? value : '0'}
          {unit && <span className="card-unit">{unit}</span>}
        </p>
      </div>
    </div>
  );
};

export default Card;