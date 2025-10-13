import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';
import ProductsPage from './pages/ProductsPage';
import ProtectedLayout from './components/ProtectedLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Rute publik yang bisa diakses siapa saja */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rute-rute di bawah ini akan dilindungi */}
      <Route element={<ProtectedRoute />}>
        {/* Semua halaman di dalam sini akan memiliki layout dengan sidebar */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
