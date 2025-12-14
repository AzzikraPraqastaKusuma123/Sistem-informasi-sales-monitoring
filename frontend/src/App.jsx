// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import InputAchievementPage from './pages/InputAchievementPage';
import MyAchievementsPage from './pages/MyAchievementsPage';
import ManageTargetsPage from './pages/ManageTargetsPage';
import ReportsPage from './pages/ReportsPage';
import UserManagementPage from './pages/UserManagementPage';
import EvaluationsPage from './pages/EvaluationsPage';
import ProtectedRoute from './components/ProtectedRoute';

// --- TAMBAHKAN IMPORT BARU ---
import RankingPage from './pages/RankingPage';
import ProfilePage from './pages/ProfilePage'; // Import ProfilePage

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/input-achievement" element={<InputAchievementPage />} />
        <Route path="/my-achievements" element={<MyAchievementsPage />} />
        <Route path="/manage-targets" element={<ManageTargetsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/evaluations" element={<EvaluationsPage />} />
        {/* --- DAFTARKAN RUTE BARU DI SINI --- */}
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/profile" element={<ProfilePage />} /> {/* Rute untuk halaman profil */}
      </Route>
    </Routes>
  );
}

export default App;