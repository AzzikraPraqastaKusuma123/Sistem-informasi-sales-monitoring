const db = require('../config/db');

// @desc    Membuat target baru
// @route   POST /api/targets
// @access  Private (Admin, Supervisor)
const createTarget = async (req, res) => {
  const { userId, productId, targetValue, periodStart, periodEnd } = req.body;

  if (!userId || !productId || !targetValue || !periodStart || !periodEnd) {
    return res.status(400).json({ message: 'Semua field harus diisi' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO targets (user_id, product_id, target_value, period_start, period_end) VALUES (?, ?, ?, ?, ?)',
      [userId, productId, targetValue, periodStart, periodEnd]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error saat membuat target:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mendapatkan semua target (dengan join untuk nama user dan produk)
// @route   GET /api/targets
// @access  Private (Admin, Supervisor)
const getTargets = async (req, res) => {
  try {
    const query = `
      SELECT 
        t.id, 
        u.name as userName, 
        p.name as productName, 
        t.target_value, 
        t.period_start, 
        t.period_end
      FROM targets t
      JOIN users u ON t.user_id = u.id
      JOIN products p ON t.product_id = p.id
      ORDER BY t.period_start DESC, u.name ASC
    `;
    const [targets] = await db.query(query);
    res.status(200).json(targets);
  } catch (error) {
    console.error('Error saat mengambil data target:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Memperbarui target
// @route   PUT /api/targets/:id
// @access  Private (Admin, Supervisor)
const updateTarget = async (req, res) => {
    const { id } = req.params;
    const { targetValue, periodStart, periodEnd } = req.body;

    if (!targetValue || !periodStart || !periodEnd) {
        return res.status(400).json({ message: 'Silakan isi semua field' });
    }

    try {
        const [result] = await db.query(
            'UPDATE targets SET target_value = ?, period_start = ?, period_end = ? WHERE id = ?',
            [targetValue, periodStart, periodEnd, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Target tidak ditemukan' });
        }
        res.status(200).json({ message: 'Target berhasil diperbarui' });
    } catch (error) {
        console.error('Error saat memperbarui target:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Menghapus target
// @route   DELETE /api/targets/:id
// @access  Private (Admin, Supervisor)
const deleteTarget = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM targets WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Target tidak ditemukan' });
    }
    res.status(200).json({ message: 'Target berhasil dihapus' });
  } catch (error) {
    console.error('Error saat menghapus target:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- Tambahan: Ambil daftar user dengan role 'sales' ---
// Ini dibutuhkan untuk form di frontend nanti
const getSalesUsers = async (req, res) => {
    try {
        const [users] = await db.query("SELECT id, name FROM users WHERE role = 'sales' ORDER BY name ASC");
        res.status(200).json(users);
    } catch (error) {
        console.error('Error saat mengambil user sales:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
  createTarget,
  getTargets,
  updateTarget,
  deleteTarget,
  getSalesUsers,
};