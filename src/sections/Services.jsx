import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Search, Settings, Truck, Headphones } from 'lucide-react';
import './Sections.css';

const Services = () => {
  const servicesData = [
    {
      icon: <Headphones size={40} />,
      title: "Technical Support",
      desc: "Expert engineering advice to help you select the precise components for your machinery and systems."
    },
    {
      icon: <Truck size={40} />,
      title: "Rapid Delivery",
      desc: "Strategic logistics ensuring fast and reliable delivery across the UAE to minimize your downtime."
    },
    {
      icon: <Search size={40} />,
      title: "Global Sourcing",
      desc: "If it's hard to find, we'll track it down. Our global network connects you to rare and specialized parts."
    },
    {
      icon: <ShieldCheck size={40} />,
      title: "Quality Assurance",
      desc: "We supply only genuine, certified equipment from trusted manufacturers to ensure long-term reliability."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="services" className="section bg-light">
      <div className="container">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">Comprehensive industrial solutions designed to keep your operations running at peak performance.</p>
        
        <motion.div 
          className="services-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {servicesData.map((service, index) => (
            <motion.div key={index} className="service-card" variants={itemVariants}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <div className="service-hover-line"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
