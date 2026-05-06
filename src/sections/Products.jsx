import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CircleDot, Droplets, Link as LinkIcon, AirVent, Filter, Nut } from 'lucide-react';
import BearingIcon from '../components/icons/BearingIcon';
import HydraulicIcon from '../components/icons/HydraulicIcon';
import BoltIcon from '../components/icons/BoltIcon';
import './Sections.css';

const Products = () => {
  const productCategories = [
    {
      title: "Precision Bearings",
      desc: "High-performance ball and roller bearings for all industrial applications.",
      icon: <BearingIcon size={32} />
    },
    {
      title: "Hydraulic Seals",
      desc: "Premium seals and O-rings for high-pressure hydraulic systems.",
      icon: <HydraulicIcon size={32} />
    },
    {
      title: "Power Transmission",
      desc: "Belts, chains, and sprockets for efficient machinery operation.",
      icon: <LinkIcon size={32} />
    },
    {
      title: "Pneumatic Valves",
      desc: "Reliable control valves and cylinders for pneumatic automation.",
      icon: <AirVent size={32} />
    },
    {
      title: "Industrial Filters",
      desc: "Advanced filtration solutions for oil, air, and fuel systems.",
      icon: <Filter size={32} />
    },
    {
      title: "Specialized Bolts",
      desc: "High-tensile fasteners and specialized bolting for critical structures.",
      icon: <BoltIcon size={32} />
    }
  ];

  return (
    <section id="products" className="section products-section">
      <div className="container">
        <h2 className="section-title text-center">Our Core Products</h2>
        <p className="section-subtitle text-center">
          As a leading manufacturer and supplier, we provide a comprehensive range of high-precision spare parts engineered to meet the highest international standards.
        </p>

        <div className="products-grid">
          {productCategories.map((product, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="product-card"
            >
              <div className="product-icon">
                {product.icon}
              </div>
              <h3>{product.title}</h3>
              <p>{product.desc}</p>
              <Link to="/products" className="learn-more">View Category</Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
