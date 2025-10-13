// routes/authRoutes.js
const express = require('express');
const router = express.Router();
// Impor kedua fungsi dari controller
const { loginUser, registerUser } = require('../controllers/authController');

// Definisikan route untuk POST /login
router.post('/login', loginUser);

// Definisikan route untuk POST /register
router.post('/register', registerUser); // <-- Route baru

module.exports = router;