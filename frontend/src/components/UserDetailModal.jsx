import React, { useState, useEffect } from 'react';
import api from '../api';
import Modal from './Modal';
import './UserDetailModal.css';

const UserDetailModal = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/users/${userId}`);
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user detail:", err);
        setError('Gagal memuat detail pengguna.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetail();
    }
  }, [userId]);

  if (loading) return <Modal onClose={onClose}><div className="user-detail-modal-content">Memuat detail pengguna...</div></Modal>;
  if (error) return <Modal onClose={onClose}><div className="user-detail-modal-content error-message">{error}</div></Modal>;
  if (!user) return <Modal onClose={onClose}><div className="user-detail-modal-content">Pengguna tidak ditemukan.</div></Modal>;

  const formatValue = (value) => value || '-';
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <Modal onClose={onClose}>
      <div className="user-detail-modal-content">
        <h2>Detail Pengguna: {user.name}</h2>
        <div className="user-detail-header">
          {user.profile_picture_url ? (
            <img src={user.profile_picture_url} alt={user.name} className="profile-picture" />
          ) : (
            <div className="profile-picture-placeholder">{user.name.charAt(0)}</div>
          )}
          <div className="user-basic-info">
            <h3>{user.name}</h3>
            <p className="user-role">Peran: {user.role}</p>
          </div>
        </div>

        <div className="user-detail-section">
          <h4>Informasi Pribadi</h4>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">NIK:</span>
              <span className="value">{formatValue(user.nik)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Email:</span>
              <span className="value">{formatValue(user.email)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Nomor Telepon:</span>
              <span className="value">{formatValue(user.phone_number)}</span>
            </div>
            <div className="detail-item full-width">
              <span className="label">Alamat:</span>
              <span className="value">{formatValue(user.address)}</span>
            </div>
          </div>
        </div>

        <div className="user-detail-section">
          <h4>Informasi Pekerjaan</h4>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Tanggal Bergabung:</span>
              <span className="value">{formatDate(user.hire_date)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Wilayah:</span>
              <span className="value">{formatValue(user.region)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Dibuat Pada:</span>
              <span className="value">{formatDate(user.created_at)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Terakhir Diperbarui:</span>
              <span className="value">{formatDate(user.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailModal;