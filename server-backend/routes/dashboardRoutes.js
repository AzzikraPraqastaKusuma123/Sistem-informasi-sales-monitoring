// server-backend/routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/dashboardController'); // Impor fungsi dari controller
const { protect } = require('../middleware/authMiddleware'); // Impor middleware proteksi

// Definisikan rute GET /summary
// 1. 'protect' akan dijalankan terlebih dahulu untuk verifikasi token
// 2. Jika token valid, 'getSummary' akan dijalankan
router.get('/summary', protect, getSummary);

module.exports = router;