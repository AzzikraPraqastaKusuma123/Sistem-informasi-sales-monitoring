const db = require('../config/db');

// @desc    Mendapatkan ringkasan data untuk Admin/Supervisor
// @route   GET /api/dashboard/summary
const getDashboardSummary = async (req, res) => {
  try {
    // 1. Query untuk KPI Cards (Logika Lama, tetap ada)
    const [users] = await db.query('SELECT COUNT(*) as totalUsers FROM users');
    const [products] = await db.query('SELECT COUNT(*) as totalProducts FROM products');
    const [achievements] = await db.query('SELECT COUNT(*) as totalAchievements FROM achievements');

    // 2. Query untuk Peringkat Kinerja Tim (Grafik 1 - Logika Lama, tetap ada)
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

    // --- LOGIKA BARU UNTUK GRAFIK-GRAFIK BARU ---

    // 3. Query untuk Tren Pencapaian Harian (Grafik 2 - Line Chart)
    // PERBAIKAN: GROUP BY menggunakan alias 'date'
    const dailyTrendQuery = `
      SELECT DATE_FORMAT(achievement_date, '%Y-%m-%d') as date, SUM(achieved_value) as total
      FROM achievements
      WHERE achievement_date >= CURDATE() - INTERVAL 30 DAY
      GROUP BY date
      ORDER BY date ASC;
    `;
    const [dailyTrend] = await db.query(dailyTrendQuery);

    // 4. Query untuk Produk Terlaris (Grafik 3 - Bar Chart)
    const topProductsQuery = `
      SELECT p.name, SUM(a.achieved_value) as total_sold
      FROM achievements a
      JOIN products p ON a.product_id = p.id
      WHERE MONTH(a.achievement_date) = MONTH(CURRENT_DATE()) AND YEAR(a.achievement_date) = YEAR(CURRENT_DATE())
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC
      LIMIT 5;
    `;
    const [topProducts] = await db.query(topProductsQuery);

    // 5. Query untuk Kontribusi Sales (Grafik 4 - Pie Chart)
    const salesContributionQuery = `
      SELECT u.name, SUM(a.achieved_value) as value
      FROM achievements a
      JOIN users u ON a.user_id = u.id
      WHERE MONTH(a.achievement_date) = MONTH(CURRENT_DATE()) AND YEAR(a.achievement_date) = YEAR(CURRENT_DATE())
      GROUP BY u.id, u.name
      HAVING value > 0;
    `;
    const [salesContribution] = await db.query(salesContributionQuery);
    
    // 6. Query untuk Aktivitas Laporan Harian (Grafik 5 - Area Chart)
    // PERBAIKAN: GROUP BY menggunakan alias 'date'
    const dailyActivityQuery = `
      SELECT DATE_FORMAT(achievement_date, '%Y-%m-%d') as date, COUNT(id) as count
      FROM achievements
      WHERE achievement_date >= CURDATE() - INTERVAL 30 DAY
      GROUP BY date
      ORDER BY date ASC;
    `;
    const [dailyActivity] = await db.query(dailyActivityQuery);


    res.json({
      // Data KPI Cards
      totalUsers: users[0].totalUsers,
      totalProducts: products[0].totalProducts,
      totalAchievements: achievements[0].totalAchievements,
      // Data untuk 5 Grafik
      topSalesPerformance: topSales,
      dailyTrend,
      topProducts,
      salesContribution,
      dailyActivity,
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mendapatkan ringkasan data untuk Sales (TIDAK DIUBAH)
// @route   GET /api/dashboard/sales
const getSalesDashboard = async (req, res) => {
  const userId = req.user.id; // ID sales yang sedang login

  try {
    const query = `
      SELECT
        (SELECT SUM(achieved_value) FROM achievements WHERE user_id = ? AND MONTH(achievement_date) = MONTH(CURRENT_DATE()) AND YEAR(achievement_date) = YEAR(CURRENT_DATE())) as currentAchievement,
        (SELECT SUM(target_value) FROM targets WHERE user_id = ? AND CURRENT_DATE() BETWEEN period_start AND period_end) as currentTarget
    `;
    const [performance] = await db.query(query, [userId, userId]);

    const achievement = performance[0].currentAchievement || 0;
    const target = performance[0].currentTarget || 0;
    
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

