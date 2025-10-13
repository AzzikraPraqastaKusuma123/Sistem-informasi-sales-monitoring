// server-backend/controllers/dashboardController.js

const pool = require('../config');

// Fungsi untuk mengambil data summary dashboard
const getSummary = async (req, res) => {
  try {
    // Di sini Anda akan menulis query ke database untuk mendapatkan data
    // Contoh:
    const [users] = await pool.query('SELECT COUNT(*) as total_sales FROM users WHERE role = "sales"');
    const [products] = await pool.query('SELECT COUNT(*) as total_products FROM products');
    
    const summaryData = {
      totalSales: users[0].total_sales,
      totalProducts: products[0].total_products,
      // Tambahkan data lain yang Anda perlukan
    };

    res.status(200).json(summaryData);

  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

module.exports = {
  getSummary,
};