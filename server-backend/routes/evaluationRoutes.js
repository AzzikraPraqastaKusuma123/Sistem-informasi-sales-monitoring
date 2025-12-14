const express = require('express');
const router = express.Router();
const {
  createEvaluation,
  getMyEvaluations,
  getUnreadEvaluationsCount,
  markEvaluationsAsRead,
} = require('../controllers/evaluationController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// Rute untuk sales
router.get('/my', verifyToken, authorize('sales'), getMyEvaluations);
router.get('/unread-count', verifyToken, authorize('sales'), getUnreadEvaluationsCount);
router.post('/mark-as-read', verifyToken, authorize('sales'), markEvaluationsAsRead);

// Rute untuk supervisor membuat evaluasi baru
router.post('/', verifyToken, authorize(['supervisor', 'admin']), createEvaluation);

module.exports = router;