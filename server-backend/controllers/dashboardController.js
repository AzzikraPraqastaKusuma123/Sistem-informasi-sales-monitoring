const db = require('../config/db');

// @desc    Mendapatkan ringkasan data untuk Admin/Supervisor
// @route   GET /api/dashboard/summary
const getDashboardSummary = async (req, res) => {
  try {
    // Logika lama untuk kartu KPI tetap ada
    const [users] = await db.query('SELECT COUNT(*) as totalUsers FROM users');
    const [products] = await db.query('SELECT COUNT(*) as totalProducts FROM products');
    const [achievements] = await db.query('SELECT COUNT(*) as totalAchievements FROM achievements');

    // --- LOGIKA BARU: Mengambil data performa untuk grafik ---
    // Query ini akan menjumlahkan total pencapaian untuk setiap sales di bulan ini
    const topSalesQuery = `
      SELECT u.name, SUM(a.achieved_value) as total_achievement
      FROM achievements a
      JOIN users u ON a.user_id = u.id
      WHERE MONTH(a.achievement_date) = MONTH(CURRENT_DATE()) AND YEAR(a.achievement_date) = YEAR(CURRENT_DATE())
      GROUP BY u.id, u.name
      ORDER BY total_achievement DESC
      LIMIT 10;
    `;
    const [topSales] = await db.query(topSalesQuery);

    res.json({
      // Data lama
      totalUsers: users[0].totalUsers,
      totalProducts: products[0].totalProducts,
      totalAchievements: achievements[0].totalAchievements,
      // Data baru untuk grafik
      topSalesPerformance: topSales,
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mendapatkan ringkasan data untuk Sales
// @route   GET /api/dashboard/sales
const getSalesDashboard = async (req, res) => {
  const userId = req.user.id; // ID sales yang sedang login

  try {
    // --- LOGIKA BARU: Menghitung pencapaian vs target ---
    const query = `
      SELECT
        (SELECT SUM(achieved_value) FROM achievements WHERE user_id = ? AND MONTH(achievement_date) = MONTH(CURRENT_DATE()) AND YEAR(achievement_date) = YEAR(CURRENT_DATE())) as currentAchievement,
        (SELECT SUM(target_value) FROM targets WHERE user_id = ? AND CURRENT_DATE() BETWEEN period_start AND period_end) as currentTarget
    `;
    const [performance] = await db.query(query, [userId, userId]);

    const achievement = performance[0].currentAchievement || 0;
    const target = performance[0].currentTarget || 0;
    
    // Hitung persentase, hindari pembagian dengan nol
    const percentage = target > 0 ? Math.round((achievement / target) * 100) : 0;

    res.json({
      achievement,
      target,
      percentage
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