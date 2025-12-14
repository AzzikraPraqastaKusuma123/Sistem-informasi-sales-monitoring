const db = require('../config/db');

// @desc    Membuat evaluasi baru oleh Supervisor
// @route   POST /api/evaluations
// @access  Private (Supervisor only)
const createEvaluation = async (req, res) => {
  const { salesId, comment } = req.body;
  const supervisorId = req.user.id; // ID supervisor yang sedang login

  if (!salesId || !comment) {
    return res.status(400).json({ message: 'Harap pilih sales dan isi komentar.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO evaluations (supervisor_id, sales_id, comment, is_read) VALUES (?, ?, ?, 0)',
      [supervisorId, salesId, comment]
    );
    res.status(201).json({
      id: result.insertId,
      supervisorId,
      salesId,
      comment,
    });
  } catch (error) {
    console.error('Error saat membuat evaluasi:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mendapatkan evaluasi yang diterima oleh sales
// @route   GET /api/evaluations/my
// @access  Private (Sales only)
const getMyEvaluations = async (req, res) => {
  const salesId = req.user.id;
  try {
    const query = `
      SELECT e.id, u.name as supervisorName, e.comment, e.created_at, e.is_read
      FROM evaluations e
      JOIN users u ON e.supervisor_id = u.id
      WHERE e.sales_id = ?
      ORDER BY e.created_at DESC
    `;
    const [evaluations] = await db.query(query, [salesId]);
    res.status(200).json(evaluations);
  } catch (error) {
    console.error('Error saat mengambil evaluasi:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get count of unread evaluations for the logged-in sales user
// @route   GET /api/evaluations/unread-count
// @access  Private (Sales only)
const getUnreadEvaluationsCount = async (req, res) => {
  const salesId = req.user.id;
  try {
    const [rows] = await db.query(
      'SELECT COUNT(*) as unreadCount FROM evaluations WHERE sales_id = ? AND is_read = 0',
      [salesId]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error getting unread evaluations count:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mark evaluations as read for the logged-in sales user
// @route   POST /api/evaluations/mark-as-read
// @access  Private (Sales only)
const markEvaluationsAsRead = async (req, res) => {
  const salesId = req.user.id;
  try {
    await db.query(
      'UPDATE evaluations SET is_read = 1 WHERE sales_id = ? AND is_read = 0',
      [salesId]
    );
    res.status(200).json({ message: 'Evaluations marked as read' });
  } catch (error) {
    console.error('Error marking evaluations as read:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createEvaluation,
  getMyEvaluations,
  getUnreadEvaluationsCount,
  markEvaluationsAsRead,
};