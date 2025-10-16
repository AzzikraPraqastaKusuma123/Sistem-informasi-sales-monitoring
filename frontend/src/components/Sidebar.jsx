// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const isSupervisor = user.role === 'supervisor';
  const isSales = user.role === 'sales';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Sales App</h2>
        <p className="sidebar-username">Welcome, {user.name}</p>
        <p className="sidebar-role">{user.role}</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end>Dashboard</NavLink>

        {isSales && (
          <>
            <NavLink to="/input-achievement">Input Achievement</NavLink>
            <NavLink to="/my-achievements">My History</NavLink>
            <NavLink to="/evaluations">Evaluations</NavLink>
          </>
        )}

        {(isAdmin || isSupervisor) && (
          <>
            <NavLink to="/products">Manage Products</NavLink>
            <NavLink to="/manage-targets">Manage Targets</NavLink>
            <NavLink to="/reports">Reports</NavLink>
            <NavLink to="/evaluations">Evaluations</NavLink>
            {/* --- TAMBAHKAN LINK BARU DI SINI --- */}
            <NavLink to="/ranking">Ranking</NavLink>
          </>
        )}
        
        {isAdmin && (
           <NavLink to="/users">Manage Users</NavLink>
        )}

      </nav>
      <div className="sidebar-footer">
        <button onClick={logout}>Logout</button>
      </div>
    </aside>
  );
};

export default Sidebar;