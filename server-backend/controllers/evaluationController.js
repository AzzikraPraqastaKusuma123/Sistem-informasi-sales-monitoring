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
      'INSERT INTO evaluations (supervisor_id, sales_id, comment) VALUES (?, ?, ?)',
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
      SELECT e.id, u.name as supervisorName, e.comment, e.created_at
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

module.exports = {
  createEvaluation,
  getMyEvaluations,
};