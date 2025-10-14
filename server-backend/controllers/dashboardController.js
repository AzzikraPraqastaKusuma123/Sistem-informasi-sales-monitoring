const db = require('../config');

// @desc    Get dashboard summary data
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = async (req, res) => {
  try {
    // Placeholder logic: Count total users and products for now
    const [users] = await db.query('SELECT COUNT(*) as totalUsers FROM users');
    const [products] = await db.query('SELECT COUNT(*) as totalProducts FROM products');
    const [achievements] = await db.query('SELECT COUNT(*) as totalAchievements FROM achievements');

    res.json({
      totalUsers: users[0].totalUsers,
      totalProducts: products[0].totalProducts,
      totalAchievements: achievements[0].totalAchievements,
      monthlySales: 0, // Placeholder
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// INI BAGIAN YANG HILANG DAN MENYEBABKAN ERROR
module.exports = {
  getDashboardSummary,
};