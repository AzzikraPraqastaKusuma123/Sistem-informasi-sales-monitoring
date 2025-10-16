import React, { useState, useEffect } from 'react';
import api from '../api';
import './RankingPage.css';

const RankingPage = () => {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const { data } = await api.get('/ranking');
                setRanking(data);
            } catch (error) {
                console.error("Gagal mengambil data peringkat", error);
                alert('Gagal memuat data peringkat.');
            } finally {
                setLoading(false);
            }
        };
        fetchRanking();
    }, []);

    if (loading) {
        return <div className="page-container">Memuat Papan Peringkat...</div>;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Papan Peringkat Sales</h1>
            </div>
            <p>Peringkat berdasarkan persentase pencapaian target di bulan ini.</p>
            
            <div className="ranking-list">
                {ranking.length > 0 ? (
                    ranking.map((sales, index) => (
                        <div key={sales.id} className={`ranking-item rank-${index + 1}`}>
                            <div className="rank-number">#{index + 1}</div>
                            <div className="rank-details">
                                <h3>{sales.name}</h3>
                                <p>
                                    Pencapaian: {sales.totalAchievement} / Target: {sales.totalTarget}
                                </p>
                            </div>
                            <div className="rank-percentage">
                                {sales.percentage}%
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Belum ada data peringkat untuk ditampilkan.</p>
                )}
            </div>
        </div>
    );
};

export default RankingPage;