import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Footer.css';
import logo from '../assets/logo.png';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e, path) => {
    e.preventDefault();
    const id = path.replace('#', '');
    
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <div className="footer-logo">
              <img src={logo} alt="Metric Mechanical Logo" className="footer-logo-img" />
              <div className="footer-logo-text">
                <h3>METRIC <span className="text-primary">MECHANICAL</span></h3>
                <p className="footer-tagline">Equipment Spare Parts Trading LLC</p>
              </div>
            </div>
            <p>Your trusted supplier of premium mechanical equipment spare parts, delivering quality and reliability across the UAE and beyond.</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home" onClick={(e) => handleNavClick(e, '#home')}><ArrowRight size={14}/> Home</a></li>
              <li><a href="#about" onClick={(e) => handleNavClick(e, '#about')}><ArrowRight size={14}/> About Us</a></li>
              <li><a href="#services" onClick={(e) => handleNavClick(e, '#services')}><ArrowRight size={14}/> Services</a></li>
              <li><a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}><ArrowRight size={14}/> Contact</a></li>
            </ul>
          </div>

          <div className="footer-services">
            <h4>Our Services</h4>
            <ul>
              <li><ArrowRight size={14}/> Industrial Machinery Parts</li>
              <li><ArrowRight size={14}/> Hydraulic Systems</li>
              <li><ArrowRight size={14}/> Heavy Equipment Spares</li>
              <li><ArrowRight size={14}/> Custom Component Sourcing</li>
              <li><ArrowRight size={14}/> 24/7 Onsite Service & Repairs</li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact Details</h4>
            <ul>
              <li><MapPin size={18} className="text-primary" /> Al Jurf Industrial 2, Ajman, UAE.</li>
              <li><Phone size={18} className="text-primary" /> +971 58 901 3804</li>
              <li><Mail size={18} className="text-primary" /> mechmetric@gmail.com</li>
              <li><Clock size={18} className="text-primary" /> Mon – Fri: 8 AM – 8 PM<br/>Sun: 8 AM - 1 PM</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Metric Mechanical Equipment Spare Parts Trading LLC. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
