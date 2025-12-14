const express = require('express');
const router = express.Router();
const { getDashboardSummary, getSalesDashboard, exportSalesData, getTopProductsForSales, getSalesContributionData, getTopSalesTable, getProductPieChart } = require('../controllers/dashboardController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// JIKA ROLE ADALAH 'admin' ATAU 'supervisor', HANYA BISA AKSES RUTE INI
router.get('/summary', verifyToken, authorize(['admin', 'supervisor']), getDashboardSummary);
router.get('/top-sales-table', verifyToken, authorize(['admin', 'supervisor']), getTopSalesTable); // Rute baru untuk tabel data
router.get('/product-pie-chart', verifyToken, authorize(['admin', 'supervisor']), getProductPieChart); // Rute baru untuk pie chart produk

// JIKA ROLE ADALAH 'sales', HANYA BISA AKSES RUTE INI
router.get('/sales', verifyToken, authorize('sales'), getSalesDashboard);
router.get('/sales/export', verifyToken, authorize('sales'), exportSalesData);
router.get('/sales/top-products', verifyToken, authorize('sales'), getTopProductsForSales); // Rute baru untuk produk terlaris sales
router.get('/sales/contribution', verifyToken, authorize('sales'), getSalesContributionData); // Rute baru untuk pie chart kontribusi


module.exports = router;