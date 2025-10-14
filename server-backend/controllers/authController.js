// server-backend/controllers/authController.js

const pool = require('../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Buat objek kosong untuk di-export
const authController = {};

// Tambahkan fungsi loginUser ke objek
authController.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password dibutuhkan" });
  }

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Tambahkan fungsi registerUser ke objek
authController.registerUser = async (req, res) => {
  const { name, email, password, role = 'sales' } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Nama, email, dan password dibutuhkan" });
  }

  try {
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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

// Export seluruh objek
module.exports = authController;