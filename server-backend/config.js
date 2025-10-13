// config.js
const mysql = require('mysql2/promise');

// Buat koneksi pool agar lebih efisien
const pool = mysql.createPool({
  host: 'localhost',      // Biasanya 'localhost'
  user: 'root',           // User database Anda (default XAMPP: 'root')
  password: '',          // Password database Anda (default XAMPP: kosong)
  database: 'sales_monitoring_db' // Nama database yang sudah kita buat
});

module.exports = pool;