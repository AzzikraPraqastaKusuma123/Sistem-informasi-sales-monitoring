// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardSummary } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// Proteksi route ini dengan middleware 'protect'
router.get('/summary', protect, getDashboardSummary);

module.exports = router;