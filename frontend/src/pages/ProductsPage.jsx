import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ProductForm from '../components/ProductForm';
import './ProductsPage.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const { user } = useAuth();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products');
      setProducts(data);
      setError('');
    } catch (err) {
      setError('Gagal memuat data produk. Pastikan Anda memiliki hak akses.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenModal = (product = null) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setProductToEdit(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (productData) => {
    try {
      if (productData.id) {
        await api.put(`/products/${productData.id}`, productData);
      } else {
        await api.post('/products', productData);
      }
      fetchProducts(); // Muat ulang data setelah submit
      handleCloseModal();
    } catch (err) {
      alert('Error: Gagal menyimpan produk.');
      console.error(err);
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Anda yakin ingin menghapus produk "${product.name}"?`)) {
      try {
        await api.delete(`/products/${product.id}`);
        fetchProducts(); // Muat ulang data setelah hapus
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Gagal menghapus produk.';
        alert(`Error: ${errorMessage}`);
      }
    }
  };

  const headers = [
    { key: 'name', label: 'Nama Produk' },
    { key: 'description', label: 'Deskripsi' },
  ];

  if (loading) return <div>Memuat...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  // Larang akses jika role adalah 'sales'
  if (user.role === 'sales') {
    return (
      <div className="page-container">
        <h1>Akses Ditolak</h1>
        <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Manajemen Produk</h1>
        <button className="add-btn" onClick={() => handleOpenModal()}>+ Tambah Produk</button>
      </div>
      <DataTable
        headers={headers}
        data={products}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <ProductForm
            productToEdit={productToEdit}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default ProductsPage;