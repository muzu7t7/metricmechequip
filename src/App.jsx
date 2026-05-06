import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import AboutUs from './sections/AboutUs';
import Services from './sections/Services';
import Contact from './sections/Contact';

import MechanicalBackground from './components/MechanicalBackground';
import MainPageParticles from './components/MainPageParticles';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        // Small delay to ensure the section is rendered
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.state]);

  return (
    <main>
      <MainPageParticles />
      <Hero />
      <AboutUs />
      <Services />
      <Contact />
    </main>
  );
}

function App() {
  return (
    <Router>
      <MechanicalBackground />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
