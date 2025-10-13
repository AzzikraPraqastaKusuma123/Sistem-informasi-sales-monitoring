// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // Cek apakah ada header 'Authorization' dan dimulai dengan 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Ambil token dari header (setelah kata 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // 2. Verifikasi token menggunakan secret key
      const decoded = jwt.verify(token, 'kunci_rahasia_super_aman');

      // 3. Simpan data pengguna dari token ke object 'req'
      //    agar bisa diakses di controller selanjutnya
      req.user = decoded;
      next(); // Lanjutkan ke controller berikutnya

    } catch (error) {
      res.status(401).json({ message: 'Token tidak valid, otorisasi gagal' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Tidak ada token, otorisasi gagal' });
  }
};

module.exports = { protect };