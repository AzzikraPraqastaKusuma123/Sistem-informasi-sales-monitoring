import React, { useState } from 'react';
import SalesChart from './SalesChart';
import PerformanceTrendChart from './PerformanceTrendChart';
import ActivityChart from './ActivityChart';
import './MainDashboardChart.css';

const MainDashboardChart = ({ performanceData, trendData, activityData }) => {
  const [activeChart, setActiveChart] = useState('performance'); // 'performance', 'trend', 'activity'

  return (
    <div className="main-chart-container chart-wrapper">
      <div className="main-chart-toggle">
        <button 
          onClick={() => setActiveChart('performance')} 
          className={activeChart === 'performance' ? 'active' : ''}
        >
          Peringkat Tim
        </button>
        <button 
          onClick={() => setActiveChart('trend')} 
          className={activeChart === 'trend' ? 'active' : ''}
        >
          Tren Pencapaian
        </button>
        <button 
          onClick={() => setActiveChart('activity')} 
          className={activeChart === 'activity' ? 'active' : ''}
        >
          Aktivitas Laporan
        </button>
      </div>

      <div className="main-chart-content">
        {activeChart === 'performance' && <SalesChart data={performanceData} />}
        {activeChart === 'trend' && <PerformanceTrendChart data={trendData} />}
        {activeChart === 'activity' && <ActivityChart data={activityData} />}
      </div>
    </div>
  );
};

export default MainDashboardChart;
