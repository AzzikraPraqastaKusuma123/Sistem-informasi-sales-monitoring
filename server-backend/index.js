const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./config/db');

// 1. Import semua rute yang sudah kita buat
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');
const targetRoutes = require('./routes/targetRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const reportRoutes = require('./routes/reportRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const rankingRoutes = require('./routes/rankingRoutes'); // Pastikan file ini sudah ada

dotenv.config();
const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory

// 3. Pendaftaran semua rute ke aplikasi Express
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/targets', targetRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/ranking', rankingRoutes); // Rute yang menyebabkan error kini sudah valid

// 4. Sisa kode (koneksi DB dan listener)
db.query('SELECT 1')
  .then(() => console.log('MySQL connected...'))
  .catch((err) => console.log('MySQL connection error:', err));

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));