import React from 'react';
import './TargetProjectionCard.css';

const TargetProjectionCard = ({ achievement, target, projectedAchievement }) => {
  const progress = target > 0 ? (achievement / target) * 100 : 0;
  const projectionPercentage = target > 0 ? (projectedAchievement / target) * 100 : 0;

  const getStatus = () => {
    if (projectedAchievement >= target) {
      return "On Track to Exceed Target!";
    } else if (projectedAchievement >= target * 0.8) {
      return "Close to Target!";
    } else {
      return "Needs More Effort!";
    }
  };

  const formatValue = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="target-projection-card">
      <h3>Proyeksi Pencapaian Target Bulan Ini</h3>
      <div className="projection-summary">
        <div className="summary-item">
          <span className="label">Target Bulan Ini:</span>
          <span className="value target">{formatValue(target)}</span>
        </div>
        <div className="summary-item">
          <span className="label">Pencapaian Saat Ini:</span>
          <span className="value achievement">{formatValue(achievement)}</span>
        </div>
        <div className="summary-item">
          <span className="label">Proyeksi Akhir Bulan:</span>
          <span className="value projected">{formatValue(projectedAchievement)}</span>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${Math.min(100, progress)}%` }}>
          <span className="progress-label">{Math.round(progress)}% Tercapai</span>
        </div>
        {projectedAchievement > achievement && (
          <div className="projection-indicator" style={{ left: `${Math.min(100, projectionPercentage)}%` }}>
            <span>Proyeksi {Math.round(projectionPercentage)}%</span>
          </div>
        )}
      </div>
      <p className="projection-status">Status: {getStatus()}</p>
    </div>
  );
};

export default TargetProjectionCard;