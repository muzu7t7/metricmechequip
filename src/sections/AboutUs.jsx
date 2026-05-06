import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import './Sections.css';
import aboutUsImg from '../assets/about-us.png';

const AboutUs = () => {
  const points = [
    "Quality You Can Trust",
    "Expert Support",
    "Custom Solutions",
    "Fast & Reliable Delivery"
  ];

  return (
    <section id="about" className="section about-section">
      <div className="container">
        <div className="about-grid">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="about-image-container"
          >
            <div className="about-image">
              <img src={aboutUsImg} alt="Industrial Manufacturing" />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="about-content"
          >
            <h4 className="overline">About Us</h4>
            <h2>Engineered For Excellence</h2>
            <div className="divider"></div>
            <p className="about-lead">
              At Metric Mechanical Equipment Spare Parts Trading Co LLC, we are committed to providing top-tier mechanical components tailored to the toughest industrial challenges.
            </p>
            <p className="about-desc">
              Drawing upon our industry expertise, we specialize in sourcing and delivering mission-critical parts for manufacturing plants, heavy machinery, and hydraulic systems. Our focus is reducing your downtime and boosting operational efficiency.
            </p>
            
            <div className="why-choose-us">
              <h3>Why Choose Us?</h3>
              <ul>
                {points.map((point, i) => (
                  <motion.li 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    key={i}
                  >
                    <CheckCircle className="text-primary" size={20} />
                    <span>{point}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
