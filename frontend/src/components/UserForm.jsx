import React, { useState, useEffect } from 'react';
import './UserForm.css'; // Import CSS baru
import { useNotification } from '../contexts/NotificationContext'; // Import useNotification

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
    region: '',
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const { showError } = useNotification(); // Inisialisasi useNotification

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
        hire_date: userToEdit.hire_date ? userToEdit.hire_date.split('T')[0] : '',
        region: userToEdit.region || '',
      });
      // Set preview untuk gambar profil yang sudah ada
      if (userToEdit.profile_picture_url) {
        setProfilePicturePreview(`${import.meta.env.VITE_API_BASE_URL}/${userToEdit.profile_picture_url}`);
      } else {
        setProfilePicturePreview(null);
      }
    } else {
      // Reset preview saat menambah pengguna baru
      setProfilePicturePreview(null);
    }
  }, [userToEdit, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Basic file type validation
    if (file && !file.type.startsWith('image/')) {
      showError('Hanya file gambar yang diizinkan.');
      e.target.value = null; // Clear the input
      setProfilePictureFile(null);
      setProfilePicturePreview(null);
      return;
    }
    setProfilePictureFile(file);
    if (file) {
      setProfilePicturePreview(URL.createObjectURL(file));
    } else {
      setProfilePicturePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] !== '' && formData[key] !== null) { // Hanya kirim data yang tidak kosong
        dataToSend.append(key, formData[key]);
      }
    }

    if (profilePictureFile) {
      dataToSend.append('profile_picture', profilePictureFile); // Nama field harus sesuai dengan Multer di backend
    } else if (isEditMode && userToEdit.profile_picture_url) {
      // Jika tidak ada file baru diupload tapi ada gambar lama, kirim URL lama
      dataToSend.append('profile_picture_url_existing', userToEdit.profile_picture_url);
    } else if (isEditMode && !userToEdit.profile_picture_url && !profilePictureFile) {
      // Jika di edit mode, tidak ada gambar lama, dan tidak ada upload baru, kirim null untuk menghapus
      dataToSend.append('profile_picture_url_existing', '');
    }

    // Jika password kosong di edit mode, jangan kirim password
    if (isEditMode && !formData.password) {
      dataToSend.delete('password');
    }

    onSubmit(dataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="user-form" encType="multipart/form-data">
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
            <label>Gambar Profil</label>
            <input type="file" name="profile_picture" accept="image/*" onChange={handleFileChange} />
            {profilePicturePreview && (
              <div className="profile-picture-preview">
                <img src={profilePicturePreview} alt="Profile Preview" />
              </div>
            )}
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