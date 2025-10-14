import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // DIUBAH: Impor useAuth
import './Sidebar.css';

const Sidebar = () => {
  // DIUBAH: Menggunakan hook useAuth untuk mendapatkan user dan fungsi logout
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // --- INI PERBAIKAN UTAMANYA ---
  // Guard Clause: Jika user masih null (sedang loading atau belum login),
  // jangan render komponen ini sama sekali. Ini akan mencegah error.
  if (!user) {
    return null;
  }

  // Kode di bawah ini hanya akan berjalan jika 'user' sudah ada datanya.
  const isAdmin = user.role === 'admin';
  const isSupervisor = user.role === 'supervisor';

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Sales App</h2>
        {/* Tampilkan nama pengguna yang sedang login */}
        <p>Welcome, {user.name}</p>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end>
          Dashboard
        </NavLink>

        {/* Hanya tampilkan menu 'Products' jika rolenya admin atau supervisor */}
        {(isAdmin || isSupervisor) && (
          <NavLink to="/products">Products</NavLink>
        )}

        <NavLink to="/reports">Reports</NavLink>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;