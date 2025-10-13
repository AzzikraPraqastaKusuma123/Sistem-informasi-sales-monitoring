// src/pages/ProductsPage.jsx (Versi Final)
import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';             // <-- Impor Modal
import ProductForm from '../components/ProductForm';   // <-- Impor ProductForm
import './ProductsPage.css';

const dummyProductsData = [/* ...data dummy Anda... */];
const columns = [/* ...kolom Anda... */];

function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Manajemen Produk</h1>
        <button onClick={() => setIsModalOpen(true)}>+ Tambah Produk</button>
      </div>
      
      <div className="table-container">
        <DataTable columns={columns} data={dummyProductsData} />
      </div>

      {isModalOpen && (
        <Modal title="Tambah Produk Baru" onClose={() => setIsModalOpen(false)}>
          <ProductForm />
        </Modal>
      )}
    </div>
  );
}

export default ProductsPage;