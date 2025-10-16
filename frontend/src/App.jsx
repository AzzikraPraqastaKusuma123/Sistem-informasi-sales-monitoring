import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import InputAchievementPage from './pages/InputAchievementPage';
import MyAchievementsPage from './pages/MyAchievementsPage';
import ManageTargetsPage from './pages/ManageTargetsPage';
import ProtectedRoute from './components/ProtectedRoute';

// --- HAPUS PLACEHOLDER DAN GANTI DENGAN IMPORT YANG BENAR ---
import ReportsPage from './pages/ReportsPage'; // Import halaman laporan yang fungsional

// Placeholder untuk halaman yang belum dibuat
const UserManagementPage = () => <h1>Halaman Manajemen Pengguna</h1>;


function App() {
  return (
    <Routes>
      {/* Rute publik */}
      <Route path="/login" element={<LoginPage />} />

      {/* Grup rute yang dilindungi */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/input-achievement" element={<InputAchievementPage />} />
        <Route path="/my-achievements" element={<MyAchievementsPage />} />
        <Route path="/manage-targets" element={<ManageTargetsPage />} />
        
        {/* --- GUNAKAN KOMPONEN YANG SUDAH DI-IMPORT --- */}
        <Route path="/reports" element={<ReportsPage />} /> 
        <Route path="/users" element={<UserManagementPage />} />
      </Route>
    </Routes>
  );
}

export default App;