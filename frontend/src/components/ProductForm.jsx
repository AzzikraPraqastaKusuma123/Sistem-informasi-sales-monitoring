import React, { useState, useEffect } from 'react';

const ProductForm = ({ productToEdit, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setDescription(productToEdit.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [productToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ id: productToEdit?.id, name, description });
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>{productToEdit ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
      <div className="form-group">
        <label>Nama Produk</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Deskripsi (Opsional)</label>
        <textarea
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-actions">
        <button type="submit">{productToEdit ? 'Update' : 'Simpan'}</button>
        <button type="button" onClick={onCancel}>Batal</button>
      </div>
    </form>
  );
};

export default ProductForm;