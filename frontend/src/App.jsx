import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import yang sebelumnya error

// Komponen placeholder untuk halaman lain agar tidak error
const ProductsPage = () => <h1>Halaman Manajemen Produk</h1>;
const InputAchievementPage = () => <h1>Halaman Input Pencapaian</h1>;
const MyAchievementsPage = () => <h1>Halaman Riwayat Saya</h1>;
const ReportsPage = () => <h1>Halaman Laporan</h1>;
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
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/users" element={<UserManagementPage />} />
      </Route>
    </Routes>
  );
}

export default App;