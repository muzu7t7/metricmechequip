import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, Search, LogOut, Package,
  X, Upload, Eye, EyeOff, ChevronRight, AlertTriangle,
  CheckCircle, Image as ImageIcon, Tag, Layers,
  LayoutGrid, List as ListIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts, useCategories, compressImage } from '../hooks/useProducts';
import './AdminPage.css';

// ─── Config ───────────────────────────────────────────────────────────────────
// Change this password before handing the site over to the customer.
const ADMIN_PASSWORD = 'admin2024';

// ─── Login Screen ─────────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin }) => {
  const [password, setPassword]   = useState('');
  const [showPw,   setShowPw]     = useState(false);
  const [error,    setError]      = useState('');
  const [shaking,  setShaking]    = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError('Incorrect password. Please try again.');
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  };

  return (
    <div className="admin-login-screen">
      <motion.div
        className="admin-login-card"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="login-logo-wrap">
          <Package size={28} />
        </div>
        <h2 className="login-title">Admin Panel</h2>
        <p className="login-subtitle">Metric Mechanical Equipment</p>

        <motion.form
          onSubmit={handleSubmit}
          animate={shaking ? { x: [0, -12, 12, -10, 10, -6, 6, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="login-field">
            <label>Password</label>
            <div className="pw-wrap">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                placeholder="Enter admin password"
                autoFocus
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && <span className="login-error">{error}</span>}
          </div>

          <button type="submit" className="login-btn">
            Sign In <ChevronRight size={16} />
          </button>
        </motion.form>

        <Link to="/" className="login-back">← Back to Website</Link>
      </motion.div>
    </div>
  );
};

// ─── Product Form Drawer ──────────────────────────────────────────────────────
const ProductFormDrawer = ({ product, categories = [], onAddCategory, onSave, onClose }) => {
  const isEditing = !!product;
  const fileRef   = useRef();

  const [form, setForm] = useState({
    name:        product?.name        ?? '',
    category:    product?.category    ?? (categories[0] || 'Hoses & Tubes'),
    description: product?.description ?? '',
    specs:       product?.specs       ?? '',
    inStock:     product?.inStock     !== false,
    imageUrl:    product?.imageUrl    ?? '',
  });
  const [imagePreview,    setImagePreview]    = useState(product?.imageUrl ?? '');
  const [uploading,       setUploading]       = useState(false);
  const [uploadError,     setUploadError]     = useState('');
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName,      setNewCatName]      = useState('');
  const [catError,        setCatError]        = useState('');

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleAddNewCategory = (e) => {
    e?.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) {
      setCatError('Please enter a category name.');
      return;
    }
    if (onAddCategory) {
      onAddCategory(trimmed);
    }
    update('category', trimmed);
    setNewCatName('');
    setShowNewCatInput(false);
    setCatError('');
  };

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setUploadError('Please select an image file.'); return; }
    if (file.size > 5 * 1024 * 1024)    { setUploadError('Image must be under 5 MB.');     return; }

    setUploading(true);
    setUploadError('');
    try {
      const compressed = await compressImage(file);
      setImagePreview(compressed);
      update('imageUrl', compressed);
    } catch {
      setUploadError('Could not process image. Try another file.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  };

  return (
    <>
      <motion.div
        className="drawer-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="product-drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      >
        <div className="drawer-header">
          <h3>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
          <button className="drawer-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form className="drawer-form" onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="form-group">
            <label><ImageIcon size={13} /> Product Image</label>
            <div
              className={`image-drop-zone ${imagePreview ? 'has-image' : ''} ${uploading ? 'uploading' : ''}`}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current.click()}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="preview" className="drop-preview" />
                  <div className="drop-change-overlay">
                    <Upload size={18} /> Change Image
                  </div>
                </>
              ) : uploading ? (
                <div className="drop-placeholder">
                  <div className="upload-spinner" />
                  <p>Processing…</p>
                </div>
              ) : (
                <div className="drop-placeholder">
                  <Upload size={30} />
                  <p>Drop image here or <strong>click to browse</strong></p>
                  <span>JPG · PNG · WEBP — max 5 MB</span>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>
            {uploadError && <span className="field-error">{uploadError}</span>}
          </div>

          {/* Name */}
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              value={form.name}
              placeholder="e.g. Hydraulic Hose"
              required
              onChange={(e) => update('name', e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <div className="form-label-row">
              <label><Tag size={13} /> Category</label>
              {!showNewCatInput && (
                <button
                  type="button"
                  className="add-cat-btn-text"
                  onClick={() => setShowNewCatInput(true)}
                >
                  + Add New Category
                </button>
              )}
            </div>

            <select
              value={showNewCatInput ? '__new__' : form.category}
              onChange={(e) => {
                if (e.target.value === '__new__') {
                  setShowNewCatInput(true);
                } else {
                  setShowNewCatInput(false);
                  update('category', e.target.value);
                }
              }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="__new__">➕ Add New Category...</option>
            </select>

            {showNewCatInput && (
              <div className="new-cat-inline-box">
                <div className="new-cat-input-row">
                  <input
                    type="text"
                    placeholder="Enter new category name..."
                    value={newCatName}
                    autoFocus
                    onChange={(e) => { setNewCatName(e.target.value); setCatError(''); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddNewCategory(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="new-cat-save-btn"
                    onClick={handleAddNewCategory}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="new-cat-cancel-btn"
                    onClick={() => {
                      setShowNewCatInput(false);
                      setCatError('');
                      if (!form.category || form.category === '__new__') {
                        update('category', categories[0] || 'Hoses & Tubes');
                      }
                    }}
                  >
                    Cancel
                  </button>
                </div>
                {catError && <span className="field-error">{catError}</span>}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={form.description}
              rows={3}
              placeholder="Brief product description for customers…"
              onChange={(e) => update('description', e.target.value)}
            />
          </div>

          {/* Specs */}
          <div className="form-group">
            <label><Layers size={13} /> Specifications</label>
            <textarea
              value={form.specs}
              rows={3}
              placeholder="e.g. DN6–DN51, SAE 100R1/R2, rated to 350 bar…"
              onChange={(e) => update('specs', e.target.value)}
            />
          </div>

          {/* In Stock Toggle */}
          <div className="form-group">
            <label>Stock Status</label>
            <button
              type="button"
              className={`toggle-btn ${form.inStock ? 'toggle-on' : 'toggle-off'}`}
              onClick={() => update('inStock', !form.inStock)}
            >
              <span className="toggle-pill" />
              <span className="toggle-label">{form.inStock ? 'In Stock' : 'Out of Stock'}</span>
            </button>
          </div>

          <div className="drawer-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-btn" disabled={uploading}>
              <CheckCircle size={16} />
              {isEditing ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
const DeleteModal = ({ productName, onConfirm, onCancel }) => (
  <motion.div
    className="delete-modal-backdrop"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onCancel}
  >
    <motion.div
      className="delete-modal"
      initial={{ opacity: 0, scale: 0.9, y: 12 }}
      animate={{ opacity: 1, scale: 1,   y: 0  }}
      exit={{ opacity: 0,   scale: 0.9, y: 12 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="delete-icon-wrap"><AlertTriangle size={36} /></div>
      <h3>Delete Product?</h3>
      <p>You are about to delete <strong>"{productName}"</strong>. This cannot be undone.</p>
      <div className="delete-actions">
        <button className="cancel-btn" onClick={onCancel}>Keep It</button>
        <button className="confirm-delete-btn" onClick={onConfirm}>Yes, Delete</button>
      </div>
    </motion.div>
  </motion.div>
);

// ─── Product Row ──────────────────────────────────────────────────────────────
const ProductRow = ({ product, index, onEdit, onDelete }) => (
  <motion.div
    layout
    key={product.id}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0   }}
    exit={{ opacity: 0, x: -20    }}
    transition={{ delay: index * 0.03 }}
    className="product-row"
  >
    <div className="row-thumb">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} />
      ) : (
        <div className="row-thumb-placeholder"><Package size={18} /></div>
      )}
    </div>

    <div className="row-info">
      <span className="row-name">{product.name}</span>
      <span className="row-cat-badge">{product.category}</span>
      {product.description && (
        <span className="row-desc">{product.description.slice(0, 70)}{product.description.length > 70 ? '…' : ''}</span>
      )}
    </div>

    <span className={`row-status ${product.inStock ? 'in-stock' : 'out-stock'}`}>
      {product.inStock ? 'In Stock' : 'Out of Stock'}
    </span>

    <div className="row-actions">
      <button className="row-edit-btn"   onClick={onEdit}   title="Edit"><Edit2  size={15} /></button>
      <button className="row-delete-btn" onClick={onDelete} title="Delete"><Trash2 size={15} /></button>
    </div>
  </motion.div>
);

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type }) => (
  <motion.div
    className={`admin-toast toast-${type}`}
    initial={{ opacity: 0, y: 30, x: '-50%' }}
    animate={{ opacity: 1, y: 0,  x: '-50%' }}
    exit={{ opacity: 0,   y: 30,  x: '-50%' }}
  >
    <CheckCircle size={16} />
    {message}
  </motion.div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, highlight }) => (
  <div className={`stat-card ${highlight ? 'stat-highlight' : ''}`}>
    <span className="stat-value">{value}</span>
    <span className="stat-label">{label}</span>
  </div>
);

// ─── Main Admin Component ─────────────────────────────────────────────────────
const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem('mmequip_admin') === '1'
  );
  const [showForm,      setShowForm]      = useState(false);
  const [editingProduct,setEditingProduct]= useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [searchTerm,    setSearchTerm]    = useState('');
  const [filterCat,     setFilterCat]     = useState('All');
  const [toast,         setToast]         = useState(null);

  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories, addCategory } = useCategories();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = () => {
    sessionStorage.setItem('mmequip_admin', '1');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('mmequip_admin');
    setIsLoggedIn(false);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSave = (data) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
      showToast('Product updated successfully ✓');
    } else {
      addProduct(data);
      showToast('Product added successfully ✓');
    }
    setShowForm(false);
  };

  const handleDelete = () => {
    deleteProduct(deleteTarget.id);
    showToast(`"${deleteTarget.name}" deleted`, 'error');
    setDeleteTarget(null);
  };

  // Category counts for stats bar
  const counts = categories.reduce((acc, cat) => {
    acc[cat] = products.filter((p) => p.category === cat).length;
    return acc;
  }, {});

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat    = filterCat === 'All' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="admin-page">

      {/* ── Header ── */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-brand">
            <Package size={20} />
            <span className="brand-name">Product Manager</span>
            <span className="brand-sep">|</span>
            <span className="brand-site">Metric Mechanical Equipment</span>
          </div>
          <div className="admin-header-right">
            <Link to="/products" target="_blank" rel="noopener noreferrer" className="view-site-btn">
              View Products Page ↗
            </Link>
            <button className="admin-logout-btn" onClick={handleLogout}>
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <div className="admin-content">

        {/* Page Title */}
        <div className="admin-page-title-row">
          <div>
            <h1 className="admin-page-title">Products</h1>
            <p className="admin-page-subtitle">{products.length} products in catalogue</p>
          </div>
          <button className="add-product-btn" onClick={openAdd}>
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <StatCard label="Total Products" value={products.length} highlight />
          {categories.map((cat) => (
            <StatCard key={cat} label={cat} value={counts[cat] ?? 0} />
          ))}
        </div>

        {/* Filters */}
        <div className="admin-filters-bar">
          <div className="admin-search-box">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search products…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="cat-pills">
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                className={`cat-pill ${filterCat === cat ? 'active' : ''}`}
                onClick={() => setFilterCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product List */}
        <div className="product-list-card">
          <div className="product-list-header">
            <span>Product</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <ProductRow
                key={product.id}
                index={i}
                product={product}
                onEdit={() => openEdit(product)}
                onDelete={() => setDeleteTarget(product)}
              />
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="empty-state">
              <Package size={44} />
              <p>No products found</p>
              {searchTerm && (
                <button className="cancel-btn" onClick={() => setSearchTerm('')}>
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>

        <p className="demo-note">
          💡 <strong>Demo mode:</strong> Data is saved in this browser. 
          To make it permanent across all devices, connect Firebase — ask your developer.
        </p>
      </div>

      {/* ── Drawers & Modals ── */}
      <AnimatePresence>
        {showForm && (
          <ProductFormDrawer
            product={editingProduct}
            categories={categories}
            onAddCategory={addCategory}
            onSave={handleSave}
            onClose={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            productName={deleteTarget.name}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;
