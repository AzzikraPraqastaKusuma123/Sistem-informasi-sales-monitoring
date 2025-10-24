import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import UserForm from '../components/UserForm';
import './UserManagementPage.css';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const { user: loggedInUser } = useAuth(); // Mengambil info user yang sedang login

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      setError('Gagal memuat data pengguna.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenModal = (user = null) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setUserToEdit(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (userData) => {
    try {
      if (userToEdit) { // Mode Edit
        await api.put(`/users/${userToEdit.id}`, userData);
      } else { // Mode Tambah
        await api.post('/users', userData);
      }
      fetchUsers();
      handleCloseModal();
    } catch (err) {
      const message = err.response?.data?.message || 'Terjadi kesalahan.';
      alert(`Error: ${message}`);
    }
  };

  const handleDelete = async (userToDelete) => {
    if (window.confirm(`Anda yakin ingin menghapus pengguna "${userToDelete.name}"?`)) {
      try {
        await api.delete(`/users/${userToDelete.id}`);
        fetchUsers();
      } catch (err) {
        const message = err.response?.data?.message || 'Gagal menghapus pengguna.';
        alert(`Error: ${message}`);
      }
    }
  };

  const headers = [
    { key: 'name', label: 'Nama' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Peran' },
  ];

  if (loading) return <div className="page-container user-management-page loading-message">Memuat...</div>;
  if (error) return <div className="page-container user-management-page error-message">{error}</div>;

  // Proteksi tambahan di sisi client
  if (loggedInUser.role !== 'admin') {
    return (
        <div className="page-container user-management-page">
            <h1>Akses Ditolak</h1>
            <p>Hanya Admin yang dapat mengakses halaman ini.</p>
        </div>
    );
  }

  return (
    <div className="page-container user-management-page">
      <div className="page-header">
        <h1>Manajemen Pengguna</h1>
        <button className="add-btn" onClick={() => handleOpenModal()}>+ Tambah Pengguna</button>
      </div>
      <DataTable
        headers={headers}
        data={users}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <UserForm
            userToEdit={userToEdit}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default UserManagementPage;