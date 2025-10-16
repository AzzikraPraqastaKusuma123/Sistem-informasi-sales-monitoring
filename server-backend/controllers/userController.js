const db = require('../config/db');
const bcrypt = require('bcrypt');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  // Fungsi ini tetap ada, tidak berubah
  res.status(200).json(req.user);
};

// --- FUNGSI-FUNGSI BARU DI BAWAH INI ---

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, role FROM users ORDER BY name ASC');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error saat mengambil semua pengguna:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new user by Admin
// @route   POST /api/users
// @access  Private (Admin only)
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Harap isi semua kolom' });
  }

  try {
    const [userExists] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (userExists.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    res.status(201).json({ id: result.insertId, name, email, role });
  } catch (error) {
    console.error('Error saat membuat pengguna:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user by Admin
// @route   PUT /api/users/:id
// @access  Private (Admin only)
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    if (!name || !email || !role) {
        return res.status(400).json({ message: 'Nama, email, dan peran harus diisi' });
    }

    try {
        let hashedPassword;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const fieldsToUpdate = ['name = ?', 'email = ?', 'role = ?'];
        const params = [name, email, role];

        if (hashedPassword) {
            fieldsToUpdate.push('password = ?');
            params.push(hashedPassword);
        }
        
        params.push(id); // Tambahkan ID untuk klausa WHERE

        const [result] = await db.query(
            `UPDATE users SET ${fieldsToUpdate.join(', ')} WHERE id = ?`,
            params
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
        }

        res.status(200).json({ message: 'Pengguna berhasil diperbarui' });
    } catch (error) {
        console.error('Error saat memperbarui pengguna:', error);
        // Tangani error jika email duplikat
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email sudah digunakan oleh pengguna lain.' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Delete user by Admin
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  const { id } = req.params;
  
  // Mencegah admin menghapus akunnya sendiri
  if (parseInt(id, 10) === req.user.id) {
    return res.status(400).json({ message: 'Anda tidak dapat menghapus akun Anda sendiri.' });
  }

  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }
    res.status(200).json({ message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    console.error('Error saat menghapus pengguna:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getUserProfile, // Fungsi lama tetap ada
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};