const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// Rute untuk mendapatkan profil pribadi (tetap ada)
router.get('/profile', verifyToken, getUserProfile);

// --- RUTE BARU UNTUK MANAJEMEN PENGGUNA (ADMIN ONLY) ---

// Mengambil semua user & membuat user baru
router.route('/')
  .get(verifyToken, authorize('admin'), getAllUsers)
  .post(verifyToken, authorize('admin'), createUser);

// Mengubah & menghapus user berdasarkan ID
router.route('/:id')
  .put(verifyToken, authorize('admin'), updateUser)
  .delete(verifyToken, authorize('admin'), deleteUser);

module.exports = router;