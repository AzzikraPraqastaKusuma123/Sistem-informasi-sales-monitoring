const express = require('express');
const router = express.Router();
const { getAchievementsReport } = require('../controllers/reportController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// Melindungi rute ini agar hanya bisa diakses oleh admin dan supervisor
router.get('/', verifyToken, authorize(['admin', 'supervisor']), getAchievementsReport);

module.exports = router;