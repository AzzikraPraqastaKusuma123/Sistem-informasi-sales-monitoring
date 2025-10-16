const express = require('express');
const router = express.Router();
const {
  createTarget,
  getTargets,
  updateTarget,
  deleteTarget,
  getSalesUsers,
} = require('../controllers/targetController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// Middleware untuk memastikan hanya admin/supervisor yang bisa mengakses semua rute di file ini
router.use(verifyToken, authorize(['admin', 'supervisor']));

// Rute untuk mendapatkan daftar sales (untuk dropdown di form)
router.get('/sales-users', getSalesUsers);

// Rute utama untuk /api/targets
router.route('/')
  .post(createTarget)
  .get(getTargets);

// Rute untuk /api/targets/:id
router.route('/:id')
  .put(updateTarget)
  .delete(deleteTarget);

module.exports = router;