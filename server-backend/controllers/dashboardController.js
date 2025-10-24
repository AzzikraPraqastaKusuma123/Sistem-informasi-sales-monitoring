const db = require('../config/db');
const ExcelJS = require('exceljs');

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

// @desc    Mendapatkan ringkasan data untuk Sales (DIPERBARUI)
// @route   GET /api/dashboard/sales
const getSalesDashboard = async (req, res) => {
  const userId = req.user.id; // ID sales yang sedang login

  try {
    // 1. Data KPI Utama (Pencapaian, Target, Persentase) - Logika tidak berubah
    const performanceQuery = `
      SELECT
        (SELECT SUM(achieved_value) FROM achievements WHERE user_id = ? AND MONTH(achievement_date) = MONTH(CURRENT_DATE()) AND YEAR(achievement_date) = YEAR(CURRENT_DATE())) as currentAchievement,
        (SELECT SUM(target_value) FROM targets WHERE user_id = ? AND CURRENT_DATE() BETWEEN period_start AND period_end) as currentTarget
    `;
    const [performance] = await db.query(performanceQuery, [userId, userId]);
    
    const achievement = performance[0].currentAchievement || 0;
    const target = performance[0].currentTarget || 0;
    const percentage = target > 0 ? Math.round((achievement / target) * 100) : 0;

    // --- KUMPULKAN DATA UNTUK GRAFIK-GRAFIK BARU ---

    // 2. Tren Kinerja Harian (Grafik Garis)
    const dailyTrendQuery = `
      SELECT DATE_FORMAT(achievement_date, '%Y-%m-%d') as date, SUM(achieved_value) as total
      FROM achievements
      WHERE user_id = ? AND achievement_date >= CURDATE() - INTERVAL 30 DAY
      GROUP BY date
      ORDER BY date ASC;
    `;
    const [dailyTrend] = await db.query(dailyTrendQuery, [userId]);

    // 3. Produk Terlaris (Grafik Batang)
    const topProductsQuery = `
      SELECT p.name, SUM(a.achieved_value) as total_sold
      FROM achievements a
      JOIN products p ON a.product_id = p.id
      WHERE a.user_id = ? AND MONTH(a.achievement_date) = MONTH(CURRENT_DATE()) AND YEAR(a.achievement_date) = YEAR(CURRENT_DATE())
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC
      LIMIT 5;
    `;
    const [topProducts] = await db.query(topProductsQuery, [userId]);

    // 4. Kontribusi Penjualan per Produk (Grafik Pai)
    const salesContributionQuery = `
      SELECT p.name, SUM(a.achieved_value) as value
      FROM achievements a
      JOIN products p ON a.product_id = p.id
      WHERE a.user_id = ? AND MONTH(a.achievement_date) = MONTH(CURRENT_DATE()) AND YEAR(a.achievement_date) = YEAR(CURRENT_DATE())
      GROUP BY p.id, p.name
      HAVING value > 0;
    `;
    const [salesContribution] = await db.query(salesContributionQuery, [userId]);

    // Kirim semua data sebagai respons
    res.json({
      achievement,
      target,
      percentage,
      dailyTrend,
      topProducts,
      salesContribution,
    });
    
  } catch (error) {
    console.error('Sales dashboard error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Export data sales ke Excel
// @route   GET /api/dashboard/sales/export
const exportSalesData = async (req, res) => {
  const userId = req.user.id;

  try {
    // Ambil data yang sama dengan getSalesDashboard
    const performanceQuery = `
      SELECT
        (SELECT SUM(achieved_value) FROM achievements WHERE user_id = ? AND MONTH(achievement_date) = MONTH(CURRENT_DATE()) AND YEAR(achievement_date) = YEAR(CURRENT_DATE())) as currentAchievement,
        (SELECT SUM(target_value) FROM targets WHERE user_id = ? AND CURRENT_DATE() BETWEEN period_start AND period_end) as currentTarget
    `;
    const [performance] = await db.query(performanceQuery, [userId, userId]);
    
    const achievement = performance[0].currentAchievement || 0;
    const target = performance[0].currentTarget || 0;
    const percentage = target > 0 ? Math.round((achievement / target) * 100) : 0;

    const dailyTrendQuery = `
      SELECT DATE_FORMAT(achievement_date, '%Y-%m-%d') as date, SUM(achieved_value) as total
      FROM achievements
      WHERE user_id = ? AND achievement_date >= CURDATE() - INTERVAL 30 DAY
      GROUP BY date
      ORDER BY date ASC;
    `;
    const [dailyTrend] = await db.query(dailyTrendQuery, [userId]);

    const topProductsQuery = `
      SELECT p.name, SUM(a.achieved_value) as total_sold
      FROM achievements a
      JOIN products p ON a.product_id = p.id
      WHERE a.user_id = ? AND MONTH(a.achievement_date) = MONTH(CURRENT_DATE()) AND YEAR(a.achievement_date) = YEAR(CURRENT_DATE())
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC
      LIMIT 5;
    `;
    const [topProducts] = await db.query(topProductsQuery, [userId]);

    const salesContributionQuery = `
      SELECT p.name, SUM(a.achieved_value) as value
      FROM achievements a
      JOIN products p ON a.product_id = p.id
      WHERE a.user_id = ? AND MONTH(a.achievement_date) = MONTH(CURRENT_DATE()) AND YEAR(a.achievement_date) = YEAR(CURRENT_DATE())
      GROUP BY p.id, p.name
      HAVING value > 0;
    `;
    const [salesContribution] = await db.query(salesContributionQuery, [userId]);

    // Buat workbook Excel baru
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Sales Monitoring App';
    workbook.lastModifiedBy = req.user.name;
    workbook.created = new Date();
    workbook.modified = new Date();

    // Sheet Ringkasan Kinerja
    const summarySheet = workbook.addWorksheet('Ringkasan Kinerja');
    summarySheet.columns = [
      { header: 'Metrik', key: 'metric', width: 30 },
      { header: 'Nilai', key: 'value', width: 20 },
    ];
    summarySheet.addRow({ metric: 'Pencapaian Bulan Ini', value: achievement });
    summarySheet.addRow({ metric: 'Target Bulan Ini', value: target });
    summarySheet.addRow({ metric: 'Persentase Target', value: `${percentage}%` });

    // Sheet Tren Harian
    const dailyTrendSheet = workbook.addWorksheet('Tren Harian');
    dailyTrendSheet.columns = [
      { header: 'Tanggal', key: 'date', width: 15 },
      { header: 'Total Penjualan', key: 'total', width: 20 },
    ];
    dailyTrend.forEach(row => {
      dailyTrendSheet.addRow(row);
    });

    // Sheet Produk Terlaris
    const topProductsSheet = workbook.addWorksheet('Produk Terlaris');
    topProductsSheet.columns = [
      { header: 'Nama Produk', key: 'name', width: 30 },
      { header: 'Total Terjual', key: 'total_sold', width: 20 },
    ];
    topProducts.forEach(row => {
      topProductsSheet.addRow(row);
    });

    // Sheet Kontribusi Penjualan
    const salesContributionSheet = workbook.addWorksheet('Kontribusi Penjualan');
    salesContributionSheet.columns = [
      { header: 'Nama Produk', key: 'name', width: 30 },
      { header: 'Kontribusi (Nilai)', key: 'value', width: 25 },
    ];
    salesContribution.forEach(row => {
      salesContributionSheet.addRow(row);
    });

    // Set header untuk respons
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + 'Sales_Dashboard_Export_' + Date.now() + '.xlsx'
    );

    // Tulis workbook ke respons
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Export sales data error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  getDashboardSummary,
  getSalesDashboard,
  exportSalesData,
};

