import React from 'react';
import './TargetProjectionCard.css';

const TargetProjectionCard = ({ achievement, target, projectedAchievement }) => {
  // 1. Tentukan skala maksimum untuk progress bar. Gunakan 1 untuk menghindari pembagian dengan nol.
  const scaleMax = Math.max(target, projectedAchievement, 1);

  // 2. Hitung persentase berdasarkan skala maksimum yang baru
  const progressPercent = (achievement / scaleMax) * 100;
  const targetPercent = (target / scaleMax) * 100;
  const projectionPercent = (projectedAchievement / scaleMax) * 100;

  // Fungsi untuk mendapatkan status teks
  const getStatus = () => {
    if (projectedAchievement >= target) {
      return "Di Jalur Melampaui Target!";
    } else if (projectedAchievement >= target * 0.8) {
      return "Mendekati Target!";
    } else {
      return "Butuh Usaha Lebih!";
    }
  };
  
  // Fungsi BARU untuk menentukan warna progress bar berdasarkan pencapaian terhadap target
  const getProgressColor = () => {
    const currentProgressVsTarget = target > 0 ? (achievement / target) * 100 : 0;
    if (currentProgressVsTarget < 40) return 'progress-bar-danger';
    if (currentProgressVsTarget < 80) return 'progress-bar-warning';
    return 'progress-bar-success';
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  return (
    <div className="target-projection-card">
      <h3>Proyeksi Pencapaian Target Bulan Ini</h3>
      <div className="projection-summary">
        <div className="summary-item">
          <span className="label">Target Bulan Ini:</span>
          <span className="value target">{formatNumber(target)}</span>
        </div>
        <div className="summary-item">
          <span className="label">Pencapaian Saat Ini:</span>
          <span className="value achievement">{formatNumber(achievement)}</span>
        </div>
        <div className="summary-item">
          <span className="label">Proyeksi Akhir Bulan:</span>
          <span className="value projected">{formatNumber(projectedAchievement)}</span>
        </div>
      </div>

      <div className="progress-bar-container">
        {/* Progress bar utama dengan warna dinamis */}
        <div className={`progress-bar ${getProgressColor()}`} style={{ width: `${progressPercent}%` }}></div>
        
        {/* Penanda untuk Target */}
        <div
          className="target-marker"
          style={{ left: `${targetPercent}%` }}
          title={`Target: ${formatNumber(target)}`}
        ></div>

        {/* Penanda untuk Proyeksi */}
        <div
          className="projection-marker"
          style={{ left: `${projectionPercent}%` }}
          title={`Proyeksi: ${formatNumber(projectedAchievement)}`}
        ></div>
      </div>

      {/* Legenda untuk menjelaskan penanda */}
      <div className="projection-legend">
        <div className="legend-item">
          <span className={`legend-color-box achievement ${getProgressColor()}`}></span>Pencapaian Saat Ini
        </div>
        <div className="legend-item">
          <span className="legend-color-box target"></span>Target
        </div>
        <div className="legend-item">
          <span className="legend-color-box projected"></span>Proyeksi
        </div>
      </div>
      
      <p className="projection-status">Status: {getStatus()}</p>
    </div>
  );
};

export default TargetProjectionCard;