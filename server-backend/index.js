// server-backend/index.js

const express = require('express');
const cors = require('cors'); // Mengizinkan komunikasi antar port

// Impor semua file routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Inisialisasi aplikasi express
const app = express();
const PORT = 5000; // Port untuk server backend

// --- MIDDLEWARE ---
// Mengaktifkan CORS untuk semua request
app.use(cors()); 

// Mengizinkan Express untuk membaca body request dalam format JSON
app.use(express.json()); 


// --- ROUTES ---
// Mendaftarkan setiap modul route ke path utamanya
app.use('/api/auth', authRoutes);       // Rute untuk registrasi dan login
app.use('/api/users', userRoutes);       // Rute untuk data pengguna (profil, dll.)
app.use('/api/dashboard', dashboardRoutes); // Rute untuk data dashboard


// --- MENJALANKAN SERVER ---
// Menjalankan server pada port yang telah ditentukan
app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});