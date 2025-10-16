const express = require('express');
const router = express.Router();
const {
  createAchievement,
  getMyAchievements,
} = require('../controllers/achievementController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// Rute untuk mendapatkan riwayat pencapaian (bisa diakses semua peran yang login)
router.get('/my', verifyToken, getMyAchievements);

// Rute untuk membuat laporan baru (hanya bisa diakses oleh 'sales')
router.post('/', verifyToken, authorize('sales'), createAchievement);

module.exports = router;