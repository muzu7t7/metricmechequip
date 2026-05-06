import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Info, Search, Filter, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductsPage.css';

const productsData = [
  { name: "Hoses", category: "Hoses & Tubes" },
  { name: "Hose Fittings", category: "Fittings & Couplings" },
  { name: "Couplings", category: "Fittings & Couplings" },
  { name: "Adaptors", category: "Fittings & Couplings" },
  { name: "Pressure Gauges & Test Point Hoses", category: "Valves & Gauges" },
  { name: "SS Expansion Bellow", category: "Maintenance" },
  { name: "Tubes, Tube Fittings & Clamps", category: "Hoses & Tubes" },
  { name: "Pneumatics Tube & Fittings", category: "Hoses & Tubes" },
  { name: "Hose Protectors", category: "Maintenance" },
  { name: "Oil & Lubricants", category: "Maintenance" },
  { name: "Hose Clips & Clamps", category: "Fittings & Couplings" },
  { name: "SAE Flange Block", category: "Fittings & Couplings" },
  { name: "Quick Release Coupling", category: "Fittings & Couplings" },
  { name: "Valves", category: "Valves & Gauges" },
  { name: "Belts", category: "Maintenance" },
  { name: "GI, MMS & SS Fittings", category: "Fittings & Couplings" },
  { name: "SS Flexible Hoses & Braids", category: "Hoses & Tubes" },
  { name: "Brass Fittings", category: "Fittings & Couplings" },
  { name: "Injector Pipes", category: "Maintenance" },
  { name: "Composite Hoses & Hose Assemblies", category: "Hoses & Tubes" }
];

const categories = ["All", "Hoses & Tubes", "Fittings & Couplings", "Valves & Gauges", "Maintenance"];

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");
  const navigate = useNavigate();

  const goToContact = () => {
    navigate('/', { state: { scrollTo: 'contact' } });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const imageUrls = [
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1534653299134-96a171b61581?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1542013936693-884638324202?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
  ];

  const filteredProducts = useMemo(() => {
    let result = productsData.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

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
            <h1>Industrial <span className="text-primary">Catalog</span></h1>
            <p>Explore our extensive range of high-performance mechanical spare parts and industrial equipment.</p>
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
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
              </select>
            </div>
          </div>
        </div>

        <div className="count-bar">
          <span className="count">{filteredProducts.length} Products Found</span>
        </div>

        <div className="products-grid-full">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, i) => (
              <motion.div 
                layout
                key={product.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="full-product-card"
              >
                <div className="product-img-wrapper">
                  <img src={imageUrls[i % 5]} alt={product.name} />
                  <div className="product-overlay">
                    <button onClick={goToContact} className="btn btn-sm">Inquire Now</button>
                  </div>
                </div>
                <div className="product-info">
                  <span className="category-tag">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p className="product-sku">REF: MM-{1000 + i}</p>
                  <div className="product-footer">
                    <span className="status">In Stock</span>
                    <button onClick={goToContact} className="details-btn"><Info size={16} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="no-results">
            <h3>No products found matching your criteria.</h3>
            <button className="btn" onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}>Reset Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

