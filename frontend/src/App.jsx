// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import InputAchievementPage from './pages/InputAchievementPage';
import MyAchievementsPage from './pages/MyAchievementsPage';
import ProtectedRoute from './components/ProtectedRoute';

// --- TAMBAHKAN IMPORT BARU ---
import ManageTargetsPage from './pages/ManageTargetsPage'; 

// Placeholder
const ReportsPage = () => <h1>Halaman Laporan</h1>;
const UserManagementPage = () => <h1>Halaman Manajemen Pengguna</h1>;


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/input-achievement" element={<InputAchievementPage />} />
        <Route path="/my-achievements" element={<MyAchievementsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        {/* --- DAFTARKAN RUTE BARU --- */}
        <Route path="/manage-targets" element={<ManageTargetsPage />} />
      </Route>
    </Routes>
  );
}

export default App;