const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserProfile,
} = require('../controllers/userController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', verifyToken, authorize('admin'), getAllUsers);

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', verifyToken, getUserProfile);

module.exports = router;