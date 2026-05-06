import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import './Sections.css';

const Contact = () => {
  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        <p className="section-subtitle">Have a part requirement or a general inquiry? Reach out to our experts and we'll get back to you immediately.</p>
        
        <div className="contact-grid">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="contact-info-cards"
          >
            <div className="info-card">
              <div className="icon-wrapper">
                <MapPin className="text-primary" size={28} />
              </div>
              <div>
                <h4>Our Location</h4>
                <p>Al Jurf Industrial 2, Ajman, UAE.</p>
              </div>
            </div>
            
            <div className="info-card">
              <div className="icon-wrapper">
                <Phone className="text-primary" size={28} />
              </div>
              <div>
                <h4>Call Us</h4>
                <p>+971 58 901 3804</p>
              </div>
            </div>
            
            <div className="info-card">
              <div className="icon-wrapper">
                <Mail className="text-primary" size={28} />
              </div>
              <div>
                <h4>Email Us</h4>
                <p>mechmetric@gmail.com</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="contact-form-container"
          >
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required />
              </div>
              <div className="form-group">
                <input type="text" placeholder="Subject / Part Number" />
              </div>
              <div className="form-group">
                <textarea placeholder="Your Message or Request Details..." rows="5" required></textarea>
              </div>
              <button type="submit" className="btn btn-full">
                Send Message <Send size={16} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
