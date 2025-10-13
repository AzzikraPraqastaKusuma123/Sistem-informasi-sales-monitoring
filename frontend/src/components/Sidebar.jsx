// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Sales App</h2>
      <nav>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/reports">Laporan</Link></li>
          <li><Link to="/products">Produk</Link></li>
          <li><Link to="/login">Logout</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;