// ... import lainnya
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; // Pastikan Anda mengimpor instance axios Anda
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await API.post('/auth/login', { email, password });

      if (response.data && response.data.token) {
        // --- PERBAIKAN PENTING ---
        // Simpan token ke localStorage setelah login berhasil
        localStorage.setItem('token', response.data.token);

        // Arahkan ke dashboard
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal, silakan coba lagi.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;