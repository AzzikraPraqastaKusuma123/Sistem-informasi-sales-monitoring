const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// Mendefinisikan rute untuk /api/products

// Rute untuk GET (semua produk) dan POST (buat produk baru)
router
  .route('/')
  .get(verifyToken, getProducts) // Siapa pun yang sudah login bisa lihat semua produk
  .post(verifyToken, authorize(['admin', 'supervisor']), createProduct); // Hanya admin & supervisor

// Rute untuk GET (satu produk), PUT (update), dan DELETE berdasarkan ID
router
  .route('/:id')
  .get(verifyToken, getProductById) // Siapa pun yang sudah login bisa lihat detail produk
  .put(verifyToken, authorize(['admin', 'supervisor']), updateProduct) // Hanya admin & supervisor
  .delete(verifyToken, authorize(['admin', 'supervisor']), deleteProduct); // Hanya admin & supervisor

module.exports = router;