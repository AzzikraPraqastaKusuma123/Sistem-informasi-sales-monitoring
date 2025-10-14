// server-backend/index.js

const express = require('express');
const cors = require('cors');

// Impor semua file routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Inisialisasi aplikasi express
const app = express();
const PORT = 5000;

// --- MIDDLEWARE ---

// Konfigurasi CORS yang lebih spesifik
const corsOptions = {
  origin: 'http://localhost:3000', // Hanya izinkan request dari frontend Anda
  optionsSuccessStatus: 200
};

// Mengaktifkan CORS untuk semua request dengan opsi yang telah ditentukan
app.use(cors(corsOptions));

// Mengizinkan Express untuk membaca body request dalam format JSON
app.use(express.json());


// --- ROUTES ---
// Mendaftarkan setiap modul route ke path utamanya
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);


// --- MENJALANKAN SERVER ---
// Menjalankan server pada port yang telah ditentukan
app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});