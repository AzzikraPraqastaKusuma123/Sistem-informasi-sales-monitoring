import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import './ProtectedLayout.css';
import { FaUserCircle } from 'react-icons/fa'; // Import an icon for the avatar

const ProtectedLayout = () => {
  const { user } = useAuth(); // Get user from context

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <header className="main-header">
          <div className="welcome-message">
            Welcome back, {user?.name}!
          </div>
          <div className="user-info">
            <span>{user?.name} ({user?.role})</span>
            <div className="user-avatar">
              <FaUserCircle />
            </div>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;