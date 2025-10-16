import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL dasar backend Anda
});

export default api;