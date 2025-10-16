const express = require('express');
const router = express.Router();
const {
  createEvaluation,
  getMyEvaluations,
} = require('../controllers/evaluationController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// Rute untuk sales melihat evaluasi yang diterima
router.get('/my', verifyToken, authorize('sales'), getMyEvaluations);

// Rute untuk supervisor membuat evaluasi baru
router.post('/', verifyToken, authorize(['supervisor', 'admin']), createEvaluation);

module.exports = router;