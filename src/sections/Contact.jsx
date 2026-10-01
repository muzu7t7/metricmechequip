import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import WhatsAppIcon from '../components/icons/WhatsAppIcon';
import { BRANCHES, WHATSAPP_LINK, WHATSAPP_DISPLAY } from '../data/contact';
import './Sections.css';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdekvbaa';

const Contact = () => {
  // 'idle' | 'submitting' | 'success' | 'error'
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setStatus('submitting');

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

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
            <a
              href="https://www.google.com/maps/search/?api=1&query=Metric+Mechanical+Equipment+spare+parts+trading+company+llc"
              target="_blank"
              rel="noopener noreferrer"
              className="info-card info-card-link"
            >
              <div className="icon-wrapper">
                <MapPin className="text-primary" size={28} />
              </div>
              <div>
                <h4>Our Location</h4>
                <p>Al Jurf Industrial 2, Ajman, UAE.</p>
              </div>
            </a>
            
            <div className="info-card branches-card">
              <div className="icon-wrapper">
                <Phone className="text-primary" size={28} />
              </div>
              <div>
                <h4>Call Us</h4>
                <ul className="branches-list">
                  {BRANCHES.map((b) => (
                    <li key={b.label}>
                      <a href={`tel:${b.tel}`}>
                        <span className="branch-label">{b.label}</span>
                        <span className="branch-number">{b.display}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="info-card info-card-link"
            >
              <div className="icon-wrapper">
                <WhatsAppIcon className="text-primary" size={28} />
              </div>
              <div>
                <h4>WhatsApp</h4>
                <p>{WHATSAPP_DISPLAY}</p>
              </div>
            </a>

            <a
              href="mailto:mechmetric@gmail.com"
              className="info-card info-card-link"
            >
              <div className="icon-wrapper">
                <Mail className="text-primary" size={28} />
              </div>
              <div>
                <h4>Email Us</h4>
                <p>mechmetric@gmail.com</p>
              </div>
            </a>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="contact-form-container"
          >
            <form className="contact-form" onSubmit={handleSubmit}>
              {/* Honeypot: hidden from real visitors, bots fill every field. Formspree drops the submission if this is non-empty. */}
              <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />

              <div className="form-group">
                <input type="text" name="name" placeholder="Your Name" required disabled={status === 'submitting'} />
              </div>
              <div className="form-group">
                <input type="email" name="email" placeholder="Your Email" required disabled={status === 'submitting'} />
              </div>
              <div className="form-group">
                <input type="text" name="subject" placeholder="Subject / Part Number" disabled={status === 'submitting'} />
              </div>
              <div className="form-group">
                <textarea name="message" placeholder="Your Message or Request Details..." rows="5" required disabled={status === 'submitting'}></textarea>
              </div>

              <button type="submit" className="btn btn-full" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending…' : <>Send Message <Send size={16} /></>}
              </button>

              {status === 'success' && (
                <p className="form-status form-status-success">
                  <CheckCircle size={16} /> Thank you! Your message has been sent — we'll get back to you shortly.
                </p>
              )}
              {status === 'error' && (
                <p className="form-status form-status-error">
                  <AlertCircle size={16} /> Something went wrong. Please try again, or reach us directly via phone or WhatsApp.
                </p>
              )}
            </form>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="map-embed-container"
          style={{ marginTop: '40px' }}
        >
          {/* Rounded corners live on the iframe itself: clipping an iframe with
              overflow:hidden inside an animated (transformed) parent renders blank in some Edge/Chromium builds. */}
          <iframe
            title="Metric Mechanical Location Map"
            src="https://www.google.com/maps?q=Metric+Mechanical+Equipment+spare+parts+trading+company+llc.&z=15&hl=en&output=embed"
            width="100%"
            height="360"
            style={{
              display: 'block',
              border: '1px solid var(--border-color)',
              borderRadius: '24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Map not loading?{' '}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Metric+Mechanical+Equipment+spare+parts+trading+company+llc"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--primary)', fontWeight: 600 }}
            >
              Open in Google Maps ↗
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
