// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // <-- Impor middleware

// Terapkan middleware 'protect' pada route ini
// Hanya pengguna dengan token valid yang bisa mengaksesnya
router.get('/profile', protect, getUserProfile); 

module.exports = router;