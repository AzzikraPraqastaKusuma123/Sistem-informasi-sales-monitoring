const jwt = require('jsonwebtoken');
const pool = require('../config');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Dapatkan token dari header
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // --- PERBAIKAN DI SINI ---
      // Ganti 'username' menjadi 'name' agar sesuai dengan kolom di database Anda
      const [rows] = await pool.query('SELECT id, name, role FROM users WHERE id = ?', [decoded.id]);
      
      if (rows.length === 0) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = rows[0];
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };