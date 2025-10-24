# 🚀 Sistem Informasi Sales Monitoring 🚀

Aplikasi web modern untuk memantau dan mengelola kinerja penjualan tim Anda secara efisien. Dilengkapi dashboard interaktif, manajemen pengguna komprehensif, dan fitur ekspor data.

## ✨ Fitur Unggulan

*   **Dashboard Dinamis:** Visualisasi kinerja penjualan untuk Admin/Supervisor dan Sales.
*   **Manajemen Pengguna Lengkap:** Kelola data karyawan dengan profil detail (NIK, kontak, dll.).
*   **Manajemen Produk & Target:** Atur produk dan target penjualan dengan mudah.
*   **Input Pencapaian:** Catat dan lacak pencapaian sales.
*   **Ekspor Data:** Unduh laporan dashboard sales ke Excel.
*   **UI/UX Responsif:** Tampilan adaptif di berbagai perangkat.

## 🛠️ Teknologi

**Backend:**
*   Node.js, Express.js
*   MySQL
*   `bcrypt`, `jsonwebtoken`
*   `exceljs`

**Frontend:**
*   React.js, Vite
*   Axios
*   Chart.js

## 📂 Struktur Proyek

```
Sistem-informasi-sales-monitoring/
├───README.md
├───frontend/
│   ├───src/
│   │   ├───api/
│   │   ├───components/ (UserForm.jsx, UserForm.css, Modal.css)
│   │   ├───contexts/
│   │   ├───pages/ (DashboardPage.jsx, UserManagementPage.jsx)
│   │   └───...
│   └───package.json
└───server-backend/
    ├───config/
    ├───controllers/ (dashboardController.js, userController.js)
    ├───database/ (sales_monitoring_db.sql)
    ├───middleware/ (authMiddleware.js)
    ├───routes/ (dashboardRoutes.js, userRoutes.js)
    ├───.env
    └───package.json
```

## 🚀 Memulai Proyek

### 📋 Persyaratan

*   Node.js (v14+)
*   MySQL Server (v8.0+)

### ⚙️ Instalasi & Setup

1.  **Clone Repositori:**
    ```bash
    git clone https://github.com/your-username/Sistem-informasi-sales-monitoring.git
    cd Sistem-informasi-sales-monitoring
    ```

2.  **Setup Database MySQL:**
    *   Buat database baru: `CREATE DATABASE sales_monitoring_db;`
    *   Import skema dan data awal dari `server-backend/database/sales_monitoring_db.sql`.
    *   **PENTING:** Jalankan SQL berikut untuk menambahkan kolom profil pengguna baru:
        ```sql
        ALTER TABLE `users`
        ADD COLUMN `nik` VARCHAR(50) UNIQUE NOT NULL AFTER `name`,
        ADD COLUMN `phone_number` VARCHAR(20) NULL AFTER `email`,
        ADD COLUMN `address` TEXT NULL AFTER `phone_number`,
        ADD COLUMN `hire_date` DATE NULL AFTER `address`,
        ADD COLUMN `profile_picture_url` VARCHAR(255) NULL AFTER `hire_date`,
        ADD COLUMN `region` VARCHAR(100) NULL AFTER `profile_picture_url`;
        ```

3.  **Backend Setup:**
    ```bash
    cd server-backend
    npm install
    # Pastikan juga exceljs terinstal jika belum
    npm install exceljs
    ```
    *   Buat file `.env` di `server-backend/` dengan konfigurasi berikut:
        ```
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=your_mysql_password
        DB_NAME=sales_monitoring_db
        JWT_SECRET=your_jwt_secret_key
        PORT=5000
        ```
    *   Jalankan server: `npm start`

4.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    ```
    *   Jalankan aplikasi: `npm run dev`

## 🌐 Penggunaan Aplikasi

*   Akses aplikasi di `http://localhost:5173`.
*   Login dengan kredensial dari database Anda (misal: `admin@example.com` / `password`).
*   Jelajahi dashboard, manajemen pengguna, dan fitur ekspor Excel.

---

## 🌟 Pembaruan Terkini

*   **Dashboard Sales Ditingkatkan:** Lebih banyak grafik visualisasi kinerja pribadi.
*   **Ekspor Data ke Excel:** Unduh laporan dashboard sales dengan satu klik.
*   **Profil Pengguna Kaya Data:** Admin dapat mengelola NIK, kontak, alamat, dll.
*   **UI/UX Responsif:** Form input pengguna yang adaptif dan terstruktur.

---
