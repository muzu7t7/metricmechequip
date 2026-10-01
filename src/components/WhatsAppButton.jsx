import React from 'react';
import { motion } from 'framer-motion';
import WhatsAppIcon from './icons/WhatsAppIcon';
import { WHATSAPP_LINK, WHATSAPP_DISPLAY } from '../data/contact';
import './WhatsAppButton.css';

// Floating WhatsApp button, shown on every page above all other content.
const WhatsAppButton = () => (
  <motion.a
    href={WHATSAPP_LINK}
    target="_blank"
    rel="noopener noreferrer"
    className="whatsapp-fab"
    aria-label={`Chat with us on WhatsApp: ${WHATSAPP_DISPLAY}`}
    title={`Chat on WhatsApp: ${WHATSAPP_DISPLAY}`}
    initial={{ opacity: 0, scale: 0.5, y: 20 }}
    animate={{ opacity: 1, scale: 1,   y: 0  }}
    transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.94 }}
  >
    <span className="whatsapp-fab-ping" aria-hidden="true" />
    <WhatsAppIcon size={28} />
  </motion.a>
);

export default WhatsAppButton;
