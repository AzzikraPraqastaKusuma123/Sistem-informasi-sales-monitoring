const db = require('../config/db');

// @desc    Mendapatkan peringkat sales berdasarkan persentase target
// @route   GET /api/ranking
// @access  Private (Admin, Supervisor)
const getSalesRanking = async (req, res) => {
  try {
    // Query ini menggabungkan data pencapaian dan target untuk setiap sales di bulan ini,
    // lalu menghitung totalnya dan persentasenya.
    const query = `
      SELECT
        u.id,
        u.name,
        COALESCE(SUM(a.achieved_value), 0) AS totalAchievement,
        COALESCE(t.totalTarget, 0) AS totalTarget,
        CASE
          WHEN COALESCE(t.totalTarget, 0) > 0 THEN (COALESCE(SUM(a.achieved_value), 0) / t.totalTarget) * 100
          ELSE 0
        END AS percentage
      FROM users u
      LEFT JOIN achievements a ON u.id = a.user_id AND MONTH(a.achievement_date) = MONTH(CURRENT_DATE()) AND YEAR(a.achievement_date) = YEAR(CURRENT_DATE())
      LEFT JOIN (
        SELECT user_id, SUM(target_value) as totalTarget
        FROM targets
        WHERE CURRENT_DATE() BETWEEN period_start AND period_end
        GROUP BY user_id
      ) t ON u.id = t.user_id
      WHERE u.role = 'sales'
      GROUP BY u.id, u.name, t.totalTarget
      ORDER BY percentage DESC, totalAchievement DESC;
    `;

    const [ranking] = await db.query(query);
    
    // Format hasil agar lebih rapi
    const formattedRanking = ranking.map(item => ({
      ...item,
      totalAchievement: parseInt(item.totalAchievement, 10),
      totalTarget: parseInt(item.totalTarget, 10),
      percentage: parseFloat(item.percentage).toFixed(2) // Ambil 2 angka di belakang koma
    }));

    res.status(200).json(formattedRanking);
  } catch (error) {
    console.error('Error saat mengambil data peringkat:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getSalesRanking,
};