import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // It will use the Sidebar component
import './ProtectedLayout.css';   // We will create this CSS file next

const ProtectedLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {/* This Outlet is where your pages (Dashboard, Products, etc.) will be rendered */}
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;