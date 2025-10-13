// src/components/ProtectedLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './ProtectedLayout.css';

function ProtectedLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="content-area">
        <Outlet />
        {/* Outlet akan merender halaman (misal: DashboardPage) */}
      </main>
    </div>
  );
}

export default ProtectedLayout;