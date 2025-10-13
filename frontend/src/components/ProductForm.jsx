// src/components/ProductForm.jsx
import React from 'react';

function ProductForm() {
  return (
    <form className="product-form">
      <div className="form-group">
        <label htmlFor="name">Nama Produk</label>
        <input type="text" id="name" />
      </div>
      <div className="form-group">
        <label htmlFor="description">Deskripsi</label>
        <textarea id="description" rows="3"></textarea>
      </div>
      <div className="form-actions">
        <button type="submit">Simpan</button>
      </div>
    </form>
  );
}

export default ProductForm;