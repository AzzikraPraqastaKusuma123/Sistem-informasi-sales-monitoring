// server-backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // Cek apakah header Authorization ada dan berformat 'Bearer <token>'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Ambil token dari header
      token = req.headers.authorization.split(' ')[1];

      // 2. Verifikasi token menggunakan secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Simpan data pengguna dari token ke object 'req'
      // Ini agar bisa diakses di controller selanjutnya
      req.user = decoded; 

      next(); // Lanjutkan ke controller selanjutnya
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