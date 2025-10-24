const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import multer
const path = require('path'); // Import path module
const {
  getUserProfile,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
} = require('../controllers/userController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// Konfigurasi Multer untuk upload gambar profil
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile_pictures'); // Folder penyimpanan
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Nama file unik
  },
});

const upload = multer({ storage: storage });

// Rute untuk mendapatkan profil pribadi (tetap ada)
router.get('/profile', verifyToken, getUserProfile);

// --- RUTE BARU UNTUK MANAJEMEN PENGGUNA (ADMIN ONLY) ---

// Mengambil semua user & membuat user baru
router.route('/')
  .get(verifyToken, authorize('admin'), getAllUsers)
  .post(verifyToken, authorize('admin'), upload.single('profile_picture'), createUser); // Tambahkan middleware upload

// Mengambil, Mengubah & menghapus user berdasarkan ID
router.route('/:id')
  .get(verifyToken, authorize('admin'), getUserById)
  .put(verifyToken, authorize('admin'), upload.single('profile_picture'), updateUser) // Tambahkan middleware upload
  .delete(verifyToken, authorize('admin'), deleteUser);

module.exports = router;