const express = require('express');
const router = express.Router();
const { getDashboardSummary, getSalesDashboard, exportSalesData, getProductSalesData } = require('../controllers/dashboardController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// JIKA ROLE ADALAH 'admin' ATAU 'supervisor', HANYA BISA AKSES RUTE INI
router.get('/summary', verifyToken, authorize(['admin', 'supervisor']), getDashboardSummary);

// JIKA ROLE ADALAH 'sales', HANYA BISA AKSES RUTE INI
router.get('/sales', verifyToken, authorize('sales'), getSalesDashboard);
router.get('/sales/export', verifyToken, authorize('sales'), exportSalesData);
router.get('/sales/product-sales', verifyToken, authorize('sales'), getProductSalesData);


module.exports = router;