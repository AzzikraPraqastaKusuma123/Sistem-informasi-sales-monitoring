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
      topUsersAchievement: topSales, // PERBAIKAN: Tambahkan kunci ini untuk grafik baru
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
    // Dapatkan tanggal saat ini dan informasi bulan
    const today = new Date();
    const currentDayOfMonth = today.getDate();
    const totalDaysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

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

    // --- LOGIKA BARU UNTUK PROYEKSI PENCAPAIAN ---
    let projectedAchievement = 0;
    if (currentDayOfMonth > 0 && achievement > 0) {
      const dailyAverageAchievement = achievement / currentDayOfMonth;
      projectedAchievement = Math.round(dailyAverageAchievement * totalDaysInMonth);
    }

    // --- KUMPULKAN DATA UNTUK GRAFIK-GRAFIK LAINNYA ---

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
      projectedAchievement, // Data baru
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


const getProductSalesData = async (req, res) => {
  const userId = req.user.id;

  try {
    const dailyQuery = `
      SELECT p.name, SUM(a.achieved_value) as total_sold
      FROM achievements a
      JOIN products p ON a.product_id = p.id
      WHERE a.user_id = ? AND DATE(a.achievement_date) = CURDATE()
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC;
    `;
    const [daily] = await db.query(dailyQuery, [userId]);

    const weeklyQuery = `
      SELECT p.name, SUM(a.achieved_value) as total_sold
      FROM achievements a
      JOIN products p ON a.product_id = p.id
      WHERE a.user_id = ? AND YEARWEEK(a.achievement_date, 1) = YEARWEEK(CURDATE(), 1)
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC;
    `;
    const [weekly] = await db.query(weeklyQuery, [userId]);

    const monthlyQuery = `
      SELECT p.name, SUM(a.achieved_value) as total_sold
      FROM achievements a
      JOIN products p ON a.product_id = p.id
      WHERE a.user_id = ? AND MONTH(a.achievement_date) = MONTH(CURRENT_DATE()) AND YEAR(a.achievement_date) = YEAR(CURRENT_DATE())
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC;
    `;
    const [monthly] = await db.query(monthlyQuery, [userId]);

    res.json({ daily, weekly, monthly });
  } catch (error) {
    console.error('Get product sales data error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mendapatkan data peringkat sales untuk tabel
// @route   GET /api/dashboard/top-sales-table
const getTopSalesTable = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query; // Default 'monthly'

    let dateFilter = '';
    let whereClause = '';
    switch (period) {
      case 'daily':
        whereClause = 'WHERE DATE(a.achievement_date) = CURDATE()';
        dateFilter = 'AND DATE(a.achievement_date) = CURDATE()';
        break;
      case 'weekly':
        whereClause = 'WHERE YEARWEEK(a.achievement_date, 1) = YEARWEEK(CURDATE(), 1)';
        dateFilter = 'AND YEARWEEK(a.achievement_date, 1) = YEARWEEK(CURDATE(), 1)';
        break;
      default:
        whereClause = 'WHERE MONTH(a.achievement_date) = MONTH(CURRENT_DATE()) AND YEAR(a.achievement_date) = YEAR(CURRENT_DATE())';
        dateFilter = 'AND MONTH(a.achievement_date) = MONTH(CURRENT_DATE()) AND YEAR(a.achievement_date) = YEAR(CURRENT_DATE())';
        break;
    }

    // Query 1: Mendapatkan peringkat sales dengan produk terlarisnya
    const usersQuery = `
      WITH RankedSales AS (
        SELECT
          u.id,
          u.name,
          u.email,
          COALESCE(SUM(a.achieved_value), 0) as total_achievement
        FROM users u
        LEFT JOIN achievements a ON u.id = a.user_id ${dateFilter}
        WHERE u.role = 'sales'
        GROUP BY u.id, u.name, u.email
      ),
      TopProductsPerUser AS (
        SELECT
          a.user_id,
          p.name as top_product_name,
          ROW_NUMBER() OVER(PARTITION BY a.user_id ORDER BY SUM(a.achieved_value) DESC) as rn
        FROM achievements a
        JOIN products p ON a.product_id = p.id
        ${whereClause}
        GROUP BY a.user_id, p.name
      )
      SELECT
        rs.id,
        rs.name,
        rs.email,
        rs.total_achievement,
        tppu.top_product_name
      FROM RankedSales rs
      LEFT JOIN TopProductsPerUser tppu ON rs.id = tppu.user_id AND tppu.rn = 1
      ORDER BY rs.total_achievement DESC;
    `;
    const [users] = await db.query(usersQuery);

    // Query 2: Mendapatkan produk terlaris secara keseluruhan untuk periode yang sama
    const topProductsQuery = `
      SELECT p.name, COUNT(a.id) as total_sold
      FROM achievements a
      JOIN products p ON a.product_id = p.id
      ${whereClause}
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC
      LIMIT 5;
    `;
    const [topProducts] = await db.query(topProductsQuery);

    // Kalkulasi rekap
    const totalRecap = users.reduce((acc, user) => acc + Number(user.total_achievement), 0);

    res.json({
      data: users,
      recap: {
        total: totalRecap,
        count: users.length,
      },
      topProducts: topProducts, // Tambahkan data produk terlaris ke respons
    });
  } catch (error) {
    console.error('Get top sales table error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mendapatkan data untuk Pie Chart Produk
// @route   GET /api/dashboard/product-pie-chart
const getProductPieChart = async (req, res) => {
  try {
    const { period = 'monthly', sort = 'desc' } = req.query;

    let whereClause = '';
    switch (period) {
      case 'weekly':
        whereClause = 'WHERE YEARWEEK(a.achievement_date, 1) = YEARWEEK(CURDATE(), 1)';
        break;
      default: // Default to monthly if period is not weekly or daily (which is now removed)
        whereClause = 'WHERE MONTH(a.achievement_date) = MONTH(CURRENT_DATE()) AND YEAR(a.achievement_date) = YEAR(CURRENT_DATE())';
        break;
    }

    const sortOrder = sort === 'asc' ? 'ASC' : 'DESC';

    const query = `
      SELECT p.name, COUNT(a.id) as value
      FROM achievements a
      JOIN products p ON a.product_id = p.id
      ${whereClause}
      GROUP BY p.id, p.name
      ORDER BY value ${sortOrder}
      LIMIT 5;
    `;
    
    const [data] = await db.query(query);
    res.json(data);

  } catch (error) {
    console.error('Get product pie chart error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  getDashboardSummary,
  getSalesDashboard,
  exportSalesData,
  getProductSalesData,
  getTopSalesTable,
  getProductPieChart, // Ekspor fungsi baru
};

