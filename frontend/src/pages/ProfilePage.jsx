import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user: loggedInUser } = useAuth(); // Get basic user info from context
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // Fetch the full profile from the backend
        const response = await api.get('/users/profile');
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError('Gagal memuat profil pengguna.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <div className="page-container profile-page loading-message">Memuat Profil...</div>;
  if (error) return <div className="page-container profile-page error-message">{error}</div>;
  if (!profile) return <div className="page-container profile-page">Profil tidak ditemukan.</div>;

  const formatValue = (value) => value || '-';
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="page-container profile-page">
      <h1>Profil Pengguna</h1>

      <div className="profile-card">
        <div className="profile-header">
          {profile.profile_picture_url ? (
            <img src={profile.profile_picture_url} alt={profile.name} className="profile-picture" />
          ) : (
            <div className="profile-picture-placeholder">{profile.name.charAt(0)}</div>
          )}
          <div className="user-basic-info">
            <h2>{profile.name}</h2>
            <p className="user-role">Peran: {profile.role}</p>
          </div>
        </div>

        <div className="profile-section">
          <h3>Informasi Pribadi</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">NIK:</span>
              <span className="value">{formatValue(profile.nik)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Email:</span>
              <span className="value">{formatValue(profile.email)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Nomor Telepon:</span>
              <span className="value">{formatValue(profile.phone_number)}</span>
            </div>
            <div className="detail-item full-width">
              <span className="label">Alamat:</span>
              <span className="value">{formatValue(profile.address)}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Informasi Pekerjaan</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Tanggal Bergabung:</span>
              <span className="value">{formatDate(profile.hire_date)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Wilayah:</span>
              <span className="value">{formatValue(profile.region)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Dibuat Pada:</span>
              <span className="value">{formatDate(profile.created_at)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Terakhir Diperbarui:</span>
              <span className="value">{formatDate(profile.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;