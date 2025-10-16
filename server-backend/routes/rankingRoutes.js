const express = require('express');
const router = express.Router();
const { getSalesRanking } = require('../controllers/rankingController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

router.get('/', verifyToken, authorize(['admin', 'supervisor']), getSalesRanking);

module.exports = router;