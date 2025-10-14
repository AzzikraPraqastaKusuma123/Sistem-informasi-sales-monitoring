const db = require('../config');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY name ASC');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Private
const getProductById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Admin, Supervisor)
const createProduct = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Product name is required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO products (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    res.status(201).json({
      id: result.insertId,
      name,
      description,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin, Supervisor)
const updateProduct = async (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;

  if (!name) {
    return res.status(400).json({ message: 'Product name is required' });
  }

  try {
    const [result] = await db.query(
      'UPDATE products SET name = ?, description = ? WHERE id = ?',
      [name, description || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ id, name, description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin, Supervisor)
const deleteProduct = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product removed' });
  } catch (error) {
    console.error(error);
    // Handle foreign key constraint error
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ message: 'Cannot delete product because it is being used in achievements or targets.' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};