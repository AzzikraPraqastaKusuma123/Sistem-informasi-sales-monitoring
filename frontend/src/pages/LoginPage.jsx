// frontend/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // <-- Menggunakan hook custom kita //
import './LoginPage.css'; //

function LoginPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' }); //
  const [error, setError] = useState(''); //
  const [loading, setLoading] = useState(false); //
  const { login } = useAuth(); // <-- Mengambil fungsi login dari context //

  // Fungsi untuk handle perubahan di input form
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value }); //
  };

  // Fungsi untuk handle submit form (DENGAN PENANGANAN ERROR LEBIH BAIK)
  const handleSubmit = async (event) => {
    event.preventDefault(); //
    setLoading(true); //
    setError(''); //

    try {
      await login(credentials); //
      // Navigasi ke dashboard sudah di-handle di dalam fungsi login di AuthContext
    } catch (err) {
      // Ambil pesan error dari backend jika ada, jika tidak, tampilkan pesan default
      const errorMessage = err.response?.data?.message || 'Email atau password salah. Silakan coba lagi.';
      setError(errorMessage);
      setLoading(false); // Hentikan loading hanya jika terjadi error //
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login Monitoring Sales</h1>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email" // Atribut 'name' penting untuk handleChange //
            value={credentials.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password" // Atribut 'name' penting untuk handleChange //
            value={credentials.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;