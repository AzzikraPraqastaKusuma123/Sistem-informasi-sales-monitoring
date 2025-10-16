import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import './EvaluationsPage.css';

// Komponen untuk Supervisor
const SupervisorEvaluationView = () => {
    const [salesUsers, setSalesUsers] = useState([]);
    const [selectedSales, setSelectedSales] = useState('');
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSalesUsers = async () => {
            try {
                const { data } = await api.get('/targets/sales-users');
                setSalesUsers(data);
                if (data.length > 0) {
                    setSelectedSales(data[0].id);
                }
            } catch (error) {
                console.error("Gagal mengambil daftar sales", error);
            }
        };
        fetchSalesUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/evaluations', { salesId: selectedSales, comment });
            setMessage('Evaluasi berhasil dikirim!');
            setComment('');
        } catch (error) {
            setMessage('Gagal mengirim evaluasi.');
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
                {message && <p className="form-message">{message}</p>}
            </form>
        </div>
    );
};

// Komponen untuk Sales
const SalesEvaluationView = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyEvaluations = async () => {
            try {
                const { data } = await api.get('/evaluations/my');
                setEvaluations(data);
            } catch (error) {
                console.error("Gagal mengambil evaluasi", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyEvaluations();
    }, []);

    if (loading) return <div>Memuat evaluasi...</div>;

    return (
        <div className="evaluation-list">
            <h3>Umpan Balik Diterima</h3>
            {evaluations.length > 0 ? (
                evaluations.map(eva => (
                    <div key={eva.id} className="evaluation-item">
                        <blockquote>{eva.comment}</blockquote>
                        <p className="meta">
                            Dari: <strong>{eva.supervisorName}</strong> - {new Date(eva.created_at).toLocaleString('id-ID')}
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