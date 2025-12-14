import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import { useNotification } from '../contexts/NotificationContext'; // Import useNotification
import './EvaluationsPage.css';

// Komponen untuk Supervisor
const SupervisorEvaluationView = () => {
    const [salesUsers, setSalesUsers] = useState([]);
    const [selectedSales, setSelectedSales] = useState('');
    const [comment, setComment] = useState('');
    const { showSuccess, showError } = useNotification(); // Inisialisasi useNotification

    useEffect(() => {
        const fetchSalesUsers = async () => {
            try {
                const { data } = await api.get('/targets/sales-users');
                setSalesUsers(data);
                if (data.length > 0) {
                    setSelectedSales(data[0].id);
                }
            } catch (error) {
                showError("Gagal mengambil daftar sales.");
            }
        };
        fetchSalesUsers();
    }, [showError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/evaluations', { salesId: selectedSales, comment });
            showSuccess('Evaluasi berhasil dikirim!');
            setComment('');
        } catch (error) {
            const message = error.response?.data?.message || 'Gagal mengirim evaluasi.';
            showError(`Error: ${message}`);
        }
    };

    return (
        <div className="form-container">
            <h3>Beri Umpan Balik</h3>
            <form onSubmit={handleSubmit} className="achievement-form">
                <div className="form-group">
                    <label>Pilih Sales</label>
                    <select value={selectedSales} onChange={e => setSelectedSales(e.target.value)}>
                        {salesUsers.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Komentar / Umpan Balik</label>
                    <textarea rows="4" value={comment} onChange={e => setComment(e.target.value)} required />
                </div>
                <button type="submit">Kirim Evaluasi</button>
            </form>
        </div>
    );
};

// Komponen untuk Sales
const SalesEvaluationView = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showError, clearEvaluationNotifCount } = useNotification(); // Ambil fungsi clear

    useEffect(() => {
        const markAndFetch = async () => {
            try {
                // 1. Beri tahu backend bahwa notifikasi sudah dilihat
                await api.post('/evaluations/mark-as-read');
                // 2. Hapus notifikasi dari UI (sidebar)
                clearEvaluationNotifCount();
                
                // 3. Ambil daftar evaluasi untuk ditampilkan
                const { data } = await api.get('/evaluations/my');
                setEvaluations(data);
            } catch (error) {
                showError("Gagal mengambil evaluasi.");
            } finally {
                setLoading(false);
            }
        };
        markAndFetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showError, clearEvaluationNotifCount]);

    if (loading) return <div>Memuat evaluasi...</div>;

    return (
        <div className="evaluation-list">
            <h3>Umpan Balik Diterima</h3>
            {evaluations.length > 0 ? (
                evaluations.map(eva => (
                    <div key={eva.id} className={`evaluation-item ${eva.is_read === 0 ? 'unread' : ''}`}>
                        {eva.is_read === 0 && <span className="new-badge">Baru</span>}
                        <blockquote>{eva.comment}</blockquote>
                        <p className="meta">
                            Dari: <strong>{eva.supervisorName}</strong> - {new Date(eva.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                ))
            ) : (
                <p>Belum ada umpan balik yang diterima.</p>
            )}
        </div>
    );
};

// Komponen Utama Halaman
const EvaluationsPage = () => {
  const { user } = useAuth();
  const isManager = user && (user.role === 'admin' || user.role === 'supervisor');

  return (
    <div className="page-container evaluation-page">
      <div className="page-header">
        <h1>Evaluasi & Umpan Balik</h1>
      </div>
      {isManager ? <SupervisorEvaluationView /> : <SalesEvaluationView />}
    </div>
  );
};

export default EvaluationsPage;