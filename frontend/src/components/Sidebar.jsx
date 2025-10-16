import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css'; // We will create this CSS file next

const Sidebar = () => {
  const { user, logout } = useAuth();

  // Do not render anything if the user data is not yet available
  if (!user) {
    return null;
  }

  // Determine user role to show/hide menus
  const isAdmin = user.role === 'admin';
  const isSupervisor = user.role === 'supervisor';
  const isSales = user.role === 'sales';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Sales App</h2>
        <p>Welcome, {user.name}</p>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end>Dashboard</NavLink>

        {/* Menu specific to Sales role */}
        {isSales && (
          <>
            <NavLink to="/input-achievement">Input Achievement</NavLink>
            <NavLink to="/my-achievements">My History</NavLink>
          </>
        )}

        {/* Menu for Admin and Supervisor roles */}
        {(isAdmin || isSupervisor) && (
          <NavLink to="/products">Manage Products</NavLink>
        )}
        
        <NavLink to="/reports">Reports</NavLink>

        {/* Menu for Admin role only */}
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