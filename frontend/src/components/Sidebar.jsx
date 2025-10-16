import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();

  // Guard clause ini penting, jangan dihapus.
  // Ini memastikan sidebar tidak error jika data user belum siap.
  if (!user) {
    return null;
  }

  // Logika untuk menentukan peran (tetap sama, tidak ada yang dihilangkan)
  const isAdmin = user.role === 'admin';
  const isSupervisor = user.role === 'supervisor';
  const isSales = user.role === 'sales';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Sales App</h2>
        {/* --- PERUBAHAN DI SINI --- */}
        {/* Sekarang nama dan peran diambil dari data user yang login */}
        <p className="sidebar-username">Welcome, {user.name}</p>
        <p className="sidebar-role">{user.role}</p>
      </div>

      {/* Bagian navigasi ini tidak berubah sama sekali */}
      <nav className="sidebar-nav">
        <NavLink to="/" end>Dashboard</NavLink>

        {isSales && (
          <>
            <NavLink to="/input-achievement">Input Achievement</NavLink>
            <NavLink to="/my-achievements">My History</NavLink>
          </>
        )}

        {(isAdmin || isSupervisor) && (
          <>
            <NavLink to="/products">Manage Products</NavLink>
            <NavLink to="/manage-targets">Manage Targets</NavLink>
          </>
        )}
        
        <NavLink to="/reports">Reports</NavLink>

        {isAdmin && (
           <NavLink to="/users">Manage Users</NavLink>
        )}
      </nav>

      {/* Bagian footer ini tidak berubah */}
      <div className="sidebar-footer">
        <button onClick={logout}>Logout</button>
      </div>
    </aside>
  );
};

export default Sidebar;