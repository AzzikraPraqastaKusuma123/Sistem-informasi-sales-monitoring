// controllers/userController.js
const pool = require('../config');

// Fungsi untuk mengambil profil pengguna yang sedang login
const getUserProfile = async (req, res) => {
  try {
    // Ambil id dari token yang sudah diverifikasi oleh middleware
    const userId = req.user.id; 

    const [users] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [userId]);

    if (users.length > 0) {
      res.json(users[0]);
    } else {
      res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

module.exports = {
  getUserProfile,
};