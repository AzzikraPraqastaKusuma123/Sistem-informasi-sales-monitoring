import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Interceptor yang akan berjalan sebelum setiap request dikirim
API.interceptors.request.use((req) => {
  // Ambil token dari localStorage
  const token = localStorage.getItem('token');
  if (token) {
    // Jika token ada, tambahkan ke header Authorization
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;