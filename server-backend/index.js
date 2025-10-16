const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./config/db');

// Import semua rute yang ada
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');
const targetRoutes = require('./routes/targetRoutes');

// --- TAMBAHKAN IMPORT BARU INI ---
const achievementRoutes = require('./routes/achievementRoutes');

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
app.use('/api/targets', targetRoutes);

// --- DAFTARKAN RUTE BARU DI SINI ---
app.use('/api/achievements', achievementRoutes);


// Coba koneksi ke database
db.query('SELECT 1')
  .then(() => console.log('MySQL connected...'))
  .catch((err) => console.log('MySQL connection error:', err));

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));