const jwt = require('jsonwebtoken');
const db = require('../config');

const verifyToken = async (req, res, next) => {
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
      
      // Dapatkan pengguna dari database berdasarkan ID di token
      const [rows] = await db.query('SELECT id, name, email, role FROM users WHERE id = ?', [decoded.id]);
      
      if (rows.length === 0) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Simpan data pengguna di object request untuk digunakan di controller selanjutnya
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

// FUNGSI BARU UNTUK OTORISASI BERBASIS PERAN
const authorize = (roles = []) => {
  // roles param bisa berupa string tunggal (cth: 'admin') atau array (cth: ['admin', 'supervisor'])
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user || (roles.length && !roles.includes(req.user.role))) {
      // Jika pengguna tidak memiliki peran yang diizinkan
      return res.status(403).json({ message: 'Forbidden: You do not have access rights' });
    }

    // Lanjutkan jika autentikasi dan otorisasi berhasil
    next();
  };
};

module.exports = { verifyToken, authorize };