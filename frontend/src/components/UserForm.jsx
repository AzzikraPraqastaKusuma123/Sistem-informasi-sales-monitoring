import React, { useState, useEffect } from 'react';
import './UserForm.css'; // Import CSS baru

const UserForm = ({ userToEdit, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    nik: '',
    email: '',
    password: '',
    role: 'sales',
    phone_number: '',
    address: '',
    hire_date: '',
    profile_picture_url: '',
    region: '',
  });

  const isEditMode = Boolean(userToEdit);

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: userToEdit.name || '',
        nik: userToEdit.nik || '',
        email: userToEdit.email || '',
        password: '', // Kosongkan password untuk keamanan
        role: userToEdit.role || 'sales',
        phone_number: userToEdit.phone_number || '',
        address: userToEdit.address || '',
        hire_date: userToEdit.hire_date ? userToEdit.hire_date.split('T')[0] : '', // Format tanggal untuk input type="date"
        profile_picture_url: userToEdit.profile_picture_url || '',
        region: userToEdit.region || '',
      });
    }
  }, [userToEdit, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Kirim hanya data yang diisi
    const dataToSend = { ...formData };
    if (isEditMode && !dataToSend.password) {
        delete dataToSend.password; // Jangan kirim password kosong saat edit
    }
    onSubmit(dataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <h2>{isEditMode ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h2>

      {/* Bagian Informasi Dasar */}
      <div className="form-section">
        <h3>Informasi Dasar</h3>
        <div className="user-form-grid">
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Nama Lengkap Pengguna" />
          </div>
          <div className="form-group">
            <label>NIK</label>
            <input type="text" name="nik" value={formData.nik} onChange={handleChange} required placeholder="Nomor Induk Karyawan" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@example.com" />
          </div>
          <div className="form-group">
            <label>Peran</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="sales">Sales</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bagian Detail Kontak */}
      <div className="form-section">
        <h3>Detail Kontak</h3>
        <div className="user-form-grid">
          <div className="form-group">
            <label>Nomor Telepon</label>
            <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Contoh: 081234567890" />
          </div>
          <div className="form-group full-width">
            <label>Alamat</label>
            <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Alamat lengkap pengguna"></textarea>
          </div>
        </div>
      </div>

      {/* Bagian Informasi Pekerjaan */}
      <div className="form-section">
        <h3>Informasi Pekerjaan</h3>
        <div className="user-form-grid">
          <div className="form-group">
            <label>Tanggal Bergabung</label>
            <input type="date" name="hire_date" value={formData.hire_date} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Wilayah</label>
            <input type="text" name="region" value={formData.region} onChange={handleChange} placeholder="Contoh: Jakarta, Jawa Barat" />
          </div>
          <div className="form-group full-width">
            <label>URL Gambar Profil</label>
            <input type="url" name="profile_picture_url" value={formData.profile_picture_url} onChange={handleChange} placeholder="https://example.com/profile.jpg" />
          </div>
        </div>
      </div>

      {/* Bagian Keamanan */}
      <div className="form-section">
        <h3>Keamanan</h3>
        <div className="form-group full-width">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={isEditMode ? "Biarkan kosong jika tidak ingin mengubah" : "Wajib diisi untuk pengguna baru"} required={!isEditMode} />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit">{isEditMode ? 'Update Pengguna' : 'Tambah Pengguna'}</button>
        <button type="button" onClick={onCancel}>Batal</button>
      </div>
    </form>
  );
};

export default UserForm;