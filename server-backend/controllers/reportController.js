const db = require('../config/db');

// @desc    Mendapatkan laporan pencapaian dengan filter
// @route   GET /api/reports
// @access  Private (Admin, Supervisor)
const getAchievementsReport = async (req, res) => {
  try {
    const { startDate, endDate, userId, productId } = req.query;

    let query = `
      SELECT
        a.id,
        u.name as userName,
        p.name as productName,
        a.achieved_value,
        a.achievement_date
      FROM achievements a
      JOIN users u ON a.user_id = u.id
      JOIN products p ON a.product_id = p.id
    `;

    const whereClauses = [];
    const queryParams = [];

    if (startDate) {
      whereClauses.push('a.achievement_date >= ?');
      queryParams.push(startDate);
    }
    if (endDate) {
      whereClauses.push('a.achievement_date <= ?');
      queryParams.push(endDate);
    }
    // Cek jika userId ada dan bukan string 'all'
    if (userId && userId !== 'all') {
      whereClauses.push('a.user_id = ?');
      queryParams.push(userId);
    }
    // Cek jika productId ada dan bukan string 'all'
    if (productId && productId !== 'all') {
      whereClauses.push('a.product_id = ?');
      queryParams.push(productId);
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    query += ' ORDER BY a.achievement_date DESC';

    const [reports] = await db.query(query, queryParams);
    res.status(200).json(reports);

  } catch (error) {
    console.error('Error saat mengambil laporan:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getAchievementsReport,
};