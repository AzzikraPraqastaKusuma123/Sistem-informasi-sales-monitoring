const db = require('../config/db');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  // Data 'req.user' sudah disisipkan oleh middleware 'verifyToken'
  // Kita hanya perlu mengirimkannya kembali sebagai response.
  res.status(200).json(req.user);
};

module.exports = {
  getUserProfile,
};