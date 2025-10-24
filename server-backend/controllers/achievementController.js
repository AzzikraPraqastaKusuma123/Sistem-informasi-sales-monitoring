const db = require('../config/db');

// @desc    Membuat laporan pencapaian baru
// @route   POST /api/achievements
// @access  Private (Hanya untuk Sales)
const createAchievement = async (req, res) => {
  const { productId, achievedValue, achievementDate } = req.body;
  const userId = req.user.id; // ID pengguna diambil dari token JWT

  if (!productId || !achievedValue || !achievementDate) {
    return res.status(400).json({ message: 'Harap isi semua kolom yang diperlukan' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO achievements (user_id, product_id, achieved_value, achievement_date) VALUES (?, ?, ?, ?)',
      [userId, productId, achievedValue, achievementDate]
    );
    res.status(201).json({
      id: result.insertId,
      userId,
      productId,
      achievedValue,
      achievementDate,
    });
  } catch (error) {
    console.error('Error saat membuat pencapaian:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mendapatkan riwayat pencapaian milik pengguna yang login
// @route   GET /api/achievements/my
// @access  Private
const getMyAchievements = async (req, res) => {
  const userId = req.user.id;

  try {
    const query = `
      SELECT 
        a.id, 
        p.name as productName, 
        a.achieved_value, 
        a.achievement_date, 
        a.created_at as inputTime 
      FROM achievements a
      JOIN products p ON a.product_id = p.id
      WHERE a.user_id = ?
      ORDER BY a.achievement_date DESC, a.created_at DESC
    `;
    const [rows] = await db.query(query, [userId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error saat mengambil riwayat pencapaian:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mendapatkan riwayat pencapaian pengguna yang login berdasarkan rentang waktu
// @route   GET /api/achievements/history?startDate=&endDate=
// @access  Private (Hanya untuk Sales)
const getAchievementHistory = async (req, res) => {
  const userId = req.user.id;
  const { startDate, endDate } = req.query;

  try {
    let query = `
      SELECT 
        a.id, 
        p.name as productName, 
        a.achieved_value, 
        a.achievement_date, 
        a.created_at as inputTime 
      FROM achievements a
      JOIN products p ON a.product_id = p.id
      WHERE a.user_id = ?
    `;
    const params = [userId];

    if (startDate && endDate) {
      query += ` AND a.achievement_date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    } else if (startDate) {
      query += ` AND a.achievement_date >= ?`;
      params.push(startDate);
    } else if (endDate) {
      query += ` AND a.achievement_date <= ?`;
      params.push(endDate);
    }

    query += ` ORDER BY a.achievement_date DESC, a.created_at DESC`;

    const [rows] = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error saat mengambil riwayat pencapaian:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createAchievement,
  getMyAchievements,
  getAchievementHistory,
};