const db = require('../config');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    // Menggunakan 'db' dari config.js yang sudah di-promise
    const [rows] = await db.query('SELECT id, name, email, role FROM users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
// FUNGSI INI DITAMBAHKAN UNTUK MEMPERBAIKI ERROR
const getUserProfile = async (req, res) => {
  // req.user didapat dari middleware verifyToken
  // Cukup kembalikan data user yang sudah ada di req.user
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = {
  getAllUsers,
  getUserProfile, // Sekarang ekspor ini valid
};