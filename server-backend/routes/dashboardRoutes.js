const express = require('express');
const router = express.Router();
const { getDashboardSummary } = require('../controllers/dashboardController');

// DIUBAH: Menggunakan { verifyToken } sesuai file middleware terbaru
const { verifyToken } = require('../middleware/authMiddleware');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
// DIUBAH: Mengganti 'protect' menjadi 'verifyToken'
router.get('/summary', verifyToken, getDashboardSummary);

module.exports = router;