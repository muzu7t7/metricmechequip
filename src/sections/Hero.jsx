import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import './Sections.css';
import heroBg from '../assets/hero-bg.png';

const Hero = () => {
  return (
    <section id="home" className="hero-section">
      <div className="hero-bg-layer" style={{ backgroundImage: `url(${heroBg})` }}></div>
      <div className="hero-overlay"></div>
      
      <div className="container hero-content">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-text"
        >
          <h1 className="hero-title">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-gradient">PRECISION</span> ENGINEERING
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              UNYIELDING RELIABILITY
            </motion.div>
          </h1>
          <p className="hero-subtitle">
            Your premier source for high-quality mechanical equipment and spare parts in the UAE. We deliver solutions that keep the industry moving forward.
          </p>
          <div className="hero-actions">
            <a href="#services" className="btn">
              <span>Our Services</span>
              <ArrowRight size={18} />
            </a>
            <a href="#contact" className="btn btn-outline-white">
              <span>Contact Us</span>
              <ArrowRight size={18} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
