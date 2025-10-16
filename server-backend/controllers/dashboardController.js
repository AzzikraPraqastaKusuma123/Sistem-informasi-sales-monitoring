const db = require('../config/db');

// FUNGSI UNTUK ADMIN / SUPERVISOR
const getDashboardSummary = async (req, res) => {
  try {
    const [users] = await db.query('SELECT COUNT(*) as totalUsers FROM users');
    const [products] = await db.query('SELECT COUNT(*) as totalProducts FROM products');
    const [achievements] = await db.query(
      'SELECT COUNT(*) as totalAchievements FROM achievements'
    );

    res.json({
      totalUsers: users[0].totalUsers,
      totalProducts: products[0].totalProducts,
      totalAchievements: achievements[0].totalAchievements,
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// FUNGSI KHUSUS UNTUK SALES
const getSalesDashboard = async (req, res) => {
  const userId = req.user.id; // ID sales yang sedang login

  try {
    // 1. Menghitung total pencapaian (value) bulan ini
    const [monthlyAchievements] = await db.query(
      `SELECT SUM(achieved_value) as totalMonthlyValue FROM achievements WHERE user_id = ? AND MONTH(achievement_date) = MONTH(CURRENT_DATE()) AND YEAR(achievement_date) = YEAR(CURRENT_DATE())`,
      [userId]
    );

    // 2. Menghitung jumlah laporan yang dibuat bulan ini
    const [monthlyReports] = await db.query(
      `SELECT COUNT(id) as totalMonthlyReports FROM achievements WHERE user_id = ? AND MONTH(achievement_date) = MONTH(CURRENT_DATE()) AND YEAR(achievement_date) = YEAR(CURRENT_DATE())`,
      [userId]
    );
    
    // 3. Menghitung total pencapaian sepanjang waktu
    const [totalAchievements] = await db.query(
      `SELECT SUM(achieved_value) as lifetimeValue FROM achievements WHERE user_id = ?`,
      [userId]
    );

    res.json({
      monthlyValue: monthlyAchievements[0].totalMonthlyValue || 0,
      monthlyReports: monthlyReports[0].totalMonthlyReports || 0,
      lifetimeValue: totalAchievements[0].lifetimeValue || 0,
    });
  } catch (error) {
    console.error('Sales dashboard error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getDashboardSummary,
  getSalesDashboard,
};