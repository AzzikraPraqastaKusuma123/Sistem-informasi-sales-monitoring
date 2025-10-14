const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// Routes for /api/products
router
  .route('/')
  .get(verifyToken, getProducts)
  .post(verifyToken, authorize(['admin', 'supervisor']), createProduct);

router
  .route('/:id')
  .get(verifyToken, getProductById)
  .put(verifyToken, authorize(['admin', 'supervisor']), updateProduct)
  .delete(verifyToken, authorize(['admin', 'supervisor']), deleteProduct);

module.exports = router;