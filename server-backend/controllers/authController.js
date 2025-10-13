// controllers/authController.js
const pool = require('../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// --- FUNGSI LOGIN (TETAP SAMA) ---
const loginUser = async (req, res) => {
  // ... (kode login dari langkah sebelumnya)
};

// --- FUNGSI BARU UNTUK REGISTRASI ---
const registerUser = async (req, res) => {
  const { name, email, password, role = 'sales' } = req.body; // Default role adalah 'sales'

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Nama, email, dan password dibutuhkan" });
  }

  try {
    // Cek apakah email sudah terdaftar
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    // Hash password sebelum disimpan
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan pengguna baru ke database
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    res.status(201).json({ message: "Pengguna berhasil didaftarkan", userId: result.insertId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

module.exports = {
  loginUser,
  registerUser, // <-- Ekspor fungsi baru
};