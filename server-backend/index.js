// index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./config/db');

// Import semua rute yang sudah ada
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');
// --- TAMBAHKAN IMPORT BARU ---
const targetRoutes = require('./routes/targetRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pendaftaran semua rute ke Express
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
// --- DAFTARKAN RUTE BARU ---
app.use('/api/targets', targetRoutes);

// Coba koneksi ke database
db.query('SELECT 1')
  .then(() => console.log('MySQL connected...'))
  .catch((err) => console.log('MySQL connection error:', err));

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));