// server-backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Impor seluruh objek dari controller
const authController = require('../controllers/authController');

// Pastikan authController dan fungsinya tidak undefined
if (!authController || typeof authController.loginUser !== 'function' || typeof authController.registerUser !== 'function') {
  console.error("Critical Error: authController or its methods are not defined.");
  // Hentikan aplikasi jika controller tidak ter-load dengan benar
  process.exit(1); 
}

// Definisikan route dengan handler dari objek controller
router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);

module.exports = router;