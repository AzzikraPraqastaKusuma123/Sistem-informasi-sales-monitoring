import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
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

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/products');
      setProducts(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
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

  const handleFormSubmit = async (productData) => {
    try {
      if (productData.id) {
        // Update product
        await api.put(`/api/products/${productData.id}`, productData);
      } else {
        // Create new product
        await api.post('/api/products', productData);
      }
      fetchProducts(); // Refresh data
      handleCloseModal();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
      alert(`Error: ${errorMessage}`);
      console.error(err);
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      try {
        await api.delete(`/api/products/${product.id}`);
        fetchProducts(); // Refresh data
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
        alert(`Error: ${errorMessage}`);
        console.error(err);
      }
    }
  };

  const headers = [
    { key: 'name', label: 'Product Name' },
    { key: 'description', label: 'Description' },
  ];

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Product Management</h1>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          + Add Product
        </button>
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
            onSubmit={handleFormSubmit}
            productToEdit={productToEdit}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default ProductsPage;