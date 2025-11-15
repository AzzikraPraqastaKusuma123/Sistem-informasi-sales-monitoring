// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css';
import {
  FaTachometerAlt,
  FaUserCircle,
  FaPlusSquare,
  FaHistory,
  FaClipboardList,
  FaBoxOpen,
  FaBullseye,
  FaChartLine,
  FaUsers,
  FaAward,
  FaSignOutAlt,
} from 'react-icons/fa'; // Import icons

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
        <NavLink to="/" end><FaTachometerAlt className="nav-icon" /> <span>Dashboard</span></NavLink>
        <NavLink to="/profile"><FaUserCircle className="nav-icon" /> <span>Profil</span></NavLink>

        {isSales && (
          <>
            <NavLink to="/input-achievement"><FaPlusSquare className="nav-icon" /> <span>Input Achievement</span></NavLink>
            <NavLink to="/my-achievements"><FaHistory className="nav-icon" /> <span>My History</span></NavLink>
            <NavLink to="/evaluations"><FaClipboardList className="nav-icon" /> <span>Evaluations</span></NavLink>
          </>
        )}

        {(isAdmin || isSupervisor) && (
          <>
            <NavLink to="/products"><FaBoxOpen className="nav-icon" /> <span>Manage Products</span></NavLink>
            <NavLink to="/manage-targets"><FaBullseye className="nav-icon" /> <span>Manage Targets</span></NavLink>
            <NavLink to="/reports"><FaChartLine className="nav-icon" /> <span>Reports</span></NavLink>
            <NavLink to="/evaluations"><FaClipboardList className="nav-icon" /> <span>Evaluations</span></NavLink>
            <NavLink to="/ranking"><FaAward className="nav-icon" /> <span>Ranking</span></NavLink>
          </>
        )}
        
        {isAdmin && (
           <NavLink to="/users"><FaUsers className="nav-icon" /> <span>Manage Users</span></NavLink>
        )}

      </nav>
      <div className="sidebar-footer">
        <button onClick={logout}><FaSignOutAlt className="nav-icon" /> <span>Logout</span></button>
      </div>
    </aside>
  );
};

export default Sidebar;