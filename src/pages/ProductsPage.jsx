import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Info, Search, Cog } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductsPage.css';
import { products, categories as productCategories } from '../data/catalog';

const ProductsPage = () => {
  const [searchTerm,       setSearchTerm]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy,           setSortBy]           = useState('name-asc');
  const [imageErrors,      setImageErrors]      = useState({});

  const navigate = useNavigate();
  const categories = ['All', ...productCategories];

  const goToContact = () => navigate('/', { state: { scrollTo: 'contact' } });

  const handleImageError = (id) =>
    setImageErrors((prev) => ({ ...prev, [id]: true }));

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchesSearch   = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'name-asc')  result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'name-desc') result.sort((a, b) => b.name.localeCompare(a.name));

    return result;
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <div className="products-page">
      <div className="products-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-content"
          >
            <h1>Our <span className="text-primary">Products</span></h1>
            <p>As a leading manufacturer and supplier, we provide a comprehensive range
               of high-precision spare parts engineered to meet the highest international standards.</p>
          </motion.div>
        </div>
      </div>

      <div className="container products-section-container">
        <div className="products-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={18} /> Back to Home
          </Link>

          <div className="controls">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name-asc">Name: A–Z</option>
                <option value="name-desc">Name: Z–A</option>
              </select>
            </div>
          </div>
        </div>

        <div className="count-bar">
          <span className="count">{filteredProducts.length} Products Found</span>
        </div>

        <div className="products-grid-full">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
              const imgSrc    = product.imageUrl || null;
              const hasError  = imageErrors[product.id];
              const showImage = imgSrc && !hasError;

              return (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1   }}
                  exit={{ opacity: 0,   scale: 0.9  }}
                  transition={{ duration: 0.3 }}
                  className="full-product-card"
                >
                  <div className="product-img-wrapper">
                    {showImage ? (
                      <img
                        src={imgSrc}
                        alt={product.name}
                        onError={() => handleImageError(product.id)}
                      />
                    ) : (
                      <div className="image-placeholder-icon">
                        <Cog size={48} className="spin-slow" />
                        <span>Industrial Component</span>
                      </div>
                    )}
                    <div className="product-overlay">
                      <button onClick={goToContact} className="btn btn-sm">Inquire Now</button>
                    </div>
                  </div>

                  <div className="product-info">
                    <span className="category-tag">{product.category}</span>
                    <h3>{product.name}</h3>

                    {/* Description is optional in products.json */}
                    {product.description && (
                      <p className="product-description">{product.description}</p>
                    )}

                    <p className="product-sku">REF: {product.sku}</p>

                    <div className="product-footer">
                      <span className={`status ${product.inStock === false ? 'out-of-stock' : ''}`}>
                        {product.inStock === false ? 'Out of Stock' : 'In Stock'}
                      </span>
                      <button onClick={goToContact} className="details-btn">
                        <Info size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-results">
            <h3>No products found matching your criteria.</h3>
            <button
              className="btn"
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
