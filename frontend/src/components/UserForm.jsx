import React, { useState, useEffect } from 'react';

const UserForm = ({ userToEdit, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'sales',
  });

  const isEditMode = Boolean(userToEdit);

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: userToEdit.name,
        email: userToEdit.email,
        password: '', // Kosongkan password untuk keamanan
        role: userToEdit.role,
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
    <form onSubmit={handleSubmit} className="product-form">
      <h2>{isEditMode ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h2>
      <div className="form-group">
        <label>Nama Lengkap</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={isEditMode ? "Isi untuk mengubah" : "Wajib diisi"} required={!isEditMode} />
      </div>
      <div className="form-group">
        <label>Peran</label>
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="sales">Sales</option>
          <option value="supervisor">Supervisor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="submit">{isEditMode ? 'Update' : 'Simpan'}</button>
        <button type="button" onClick={onCancel}>Batal</button>
      </div>
    </form>
  );
};

export default UserForm;