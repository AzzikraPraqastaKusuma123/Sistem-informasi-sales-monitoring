const express = require('express');
const router = express.Router();
const { getDashboardSummary, getSalesDashboard, exportSalesData, getProductSalesData, getTopSalesTable } = require('../controllers/dashboardController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// JIKA ROLE ADALAH 'admin' ATAU 'supervisor', HANYA BISA AKSES RUTE INI
router.get('/summary', verifyToken, authorize(['admin', 'supervisor']), getDashboardSummary);
router.get('/top-sales-table', verifyToken, authorize(['admin', 'supervisor']), getTopSalesTable); // Rute baru untuk tabel data

// JIKA ROLE ADALAH 'sales', HANYA BISA AKSES RUTE INI
router.get('/sales', verifyToken, authorize('sales'), getSalesDashboard);
router.get('/sales/export', verifyToken, authorize('sales'), exportSalesData);
router.get('/sales/product-sales', verifyToken, authorize('sales'), getProductSalesData);


module.exports = router;