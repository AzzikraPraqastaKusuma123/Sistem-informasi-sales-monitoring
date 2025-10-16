const db = require('../config/db'); // Pastikan path ini benar menuju file koneksi database Anda

// @desc    Membuat produk baru
// @route   POST /api/products
// @access  Private (Admin, Supervisor)
const createProduct = async (req, res) => {
  const { name, description } = req.body;

  // Validasi input
  if (!name) {
    return res.status(400).json({ message: 'Nama produk harus diisi' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO products (name, description) VALUES (?, ?)',
      [name, description || null] // Jika deskripsi tidak ada, isi dengan NULL
    );

    // Kirim kembali data produk yang baru dibuat
    res.status(201).json({
      id: result.insertId,
      name,
      description,
    });
  } catch (error) {
    console.error('Error saat membuat produk:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mendapatkan semua produk
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY name ASC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error saat mengambil produk:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mendapatkan satu produk berdasarkan ID
// @route   GET /api/products/:id
// @access  Private
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error saat mengambil produk berdasarkan ID:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Memperbarui produk
// @route   PUT /api/products/:id
// @access  Private (Admin, Supervisor)
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  // Validasi input
  if (!name) {
    return res.status(400).json({ message: 'Nama produk harus diisi' });
  }

  try {
    const [result] = await db.query(
      'UPDATE products SET name = ?, description = ? WHERE id = ?',
      [name, description || null, id]
    );

    // Cek apakah ada baris yang terpengaruh (artinya produk ditemukan dan diupdate)
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    res.status(200).json({ id: parseInt(id), name, description });
  } catch (error) {
    console.error('Error saat memperbarui produk:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Menghapus produk
// @route   DELETE /api/products/:id
// @access  Private (Admin, Supervisor)
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    res.status(200).json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error('Error saat menghapus produk:', error);
    // Error ini biasanya terjadi jika produk masih digunakan di tabel lain (achievements/targets)
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ message: 'Produk tidak dapat dihapus karena masih digunakan dalam data pencapaian atau target.' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};