// controllers/dashboardController.js

// Fungsi ini akan mengembalikan data summary untuk KPI cards
const getDashboardSummary = async (req, res) => {
  try {
    // Nanti, data ini akan diambil dari query database yang kompleks.
    // Untuk sekarang, kita kirim data dummy.
    const summaryData = {
      totalPencapaian: '1,250',
      produkTerjual: '89',
      targetTercapai: '75%',
      salesTerbaik: 'Andi (dari DB)', // Data dari database
    };
    res.json(summaryData);

  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data summary" });
  }
};

module.exports = {
  getDashboardSummary,
};