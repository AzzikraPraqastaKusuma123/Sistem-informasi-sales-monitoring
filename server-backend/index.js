const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./config');

// Impor semua file routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const productRoutes = require('./routes/productRoutes'); // <-- BARU: Impor rute produk

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Mengizinkan request dari semua origin (bisa disesuaikan nanti)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tes Koneksi Database
db.query('SELECT 1')
  .then(() => console.log('MySQL connected...'))
  .catch((err) => console.log('MySQL connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mendaftarkan setiap modul route ke path utamanya
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes); // <-- BARU: Mendaftarkan rute produk

const PORT = process.env.PORT || 5000;

// Menjalankan server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));