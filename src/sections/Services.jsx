import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Search, Settings, Truck, Headphones, Wrench } from 'lucide-react';
import onsiteVan from '../assets/onsite-van-v3.png';
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
    },
    {
      icon: <Wrench size={40} />,
      title: "Custom Fabrication",
      desc: "Bespoke assembly and crimping of hydraulic and composite hoses tailored to your exact specifications."
    },
    {
      icon: <Clock size={40} />,
      title: "Scheduled Maintenance",
      desc: "Scheduled inspection, pressure testing, and replacement services to avoid costly unexpected shutdowns."
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
          className="onsite-highlight"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="onsite-content">
            <div className="onsite-icon-wrapper">
              <Wrench size={32} />
            </div>
            <h3>Onsite Service & Repairs</h3>
            <p>Our dedicated mobile service teams are equipped to handle critical repairs and maintenance directly at your facility. We bring the expertise to you, minimizing downtime and ensuring your operations get back online quickly and safely.</p>
            <ul className="onsite-features">
              <li>✓ 24/7 Emergency Dispatch</li>
              <li>✓ Fully Equipped Mobile Units</li>
              <li>✓ Hydraulic & Hose Specialists</li>
              <li>✓ Onsite Hose Crimping & Assembly</li>
            </ul>
          </div>
          <div className="onsite-image-wrapper">
            <img src={onsiteVan} alt="Metric Mech Equip Onsite Service Van" className="onsite-image" />
            <div className="onsite-image-overlay"></div>
          </div>
        </motion.div>

        <motion.div 
          className="services-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ marginTop: '80px' }}
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
