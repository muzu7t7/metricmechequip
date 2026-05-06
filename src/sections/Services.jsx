import React from 'react';
import { motion } from 'framer-motion';
import { HardHat, AirVent, Link, PackageSearch } from 'lucide-react';
import BearingIcon from '../components/icons/BearingIcon';
import HydraulicIcon from '../components/icons/HydraulicIcon';
import './Sections.css';

const Services = () => {
  const servicesData = [
    {
      icon: <HydraulicIcon size={40} />,
      title: "Hydraulic Systems",
      desc: "Complete hydraulic solutions, pumps, valves, and high-pressure hose assemblies."
    },
    {
      icon: <BearingIcon size={40} />,
      title: "Precision Bearings",
      desc: "Standard and custom bearings ensuring minimal friction and extended machine life."
    },
    {
      icon: <HardHat size={40} />,
      title: "Heavy Equipment Spares",
      desc: "Earthmoving and construction equipment parts ready for immediate dispatch."
    },
    {
      icon: <AirVent size={40} />,
      title: "Pneumatic Components",
      desc: "Air cylinders, actuators, and pneumatic controllers for automated systems."
    },
    {
      icon: <Link size={40} />,
      title: "Transmission Belts",
      desc: "Industrial-grade V-belts, timing belts, and robust power transmission products."
    },
    {
      icon: <PackageSearch size={40} />,
      title: "Custom Sourcing",
      desc: "Hard-to-find components tracked down and delivered globally."
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
