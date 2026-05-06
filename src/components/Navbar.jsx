import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50 || location.pathname !== '/');
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavClick = (e, path, isPage) => {
    if (isPage) {
      setMobileMenuOpen(false);
      return;
    }

    e.preventDefault();
    const id = path.replace('#', '');
    
    if (location.pathname !== '/') {
      // If not on home page, navigate to home and pass the scroll target
      navigate('/', { state: { scrollTo: id } });
    } else {
      // If already on home page, just scroll
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '#home' },
    { name: 'About', path: '#about' },
    { name: 'Products', path: '/products', isPage: true },
  ];

  return (
    <header ref={navbarRef} className={`navbar ${isScrolled || location.pathname !== '/' ? 'scrolled' : ''}`}>
      <div className="nav-main">
        <div className="container nav-inner">
          <div className="logo">
            <Link to="/" onClick={(e) => handleNavClick(e, '#home', false)}>
              <div className="logo-brand">
                <img src={logo} alt="Metric Mechanical Logo" className="logo-img" />
                <div className="logo-text">
                  <div className="logo-main">METRIC <span className="text-primary">MECHANICAL</span></div>
                  <div className="logo-sub">Equipment Spare Parts Trading LLC</div>
                </div>
              </div>
            </Link>
          </div>
          
          <nav className="desktop-nav">
            <ul>
              {navLinks.map((link) => (
                <li key={link.name}>
                  {link.isPage ? (
                    <Link to={link.path} className={link.name === 'Products' && location.pathname === '/products' ? 'active' : ''}>
                      {link.name}
                    </Link>
                  ) : (
                    <a href={link.path} onClick={(e) => handleNavClick(e, link.path, false)}>{link.name}</a>
                  )}
                </li>
              ))}
              <li><a href="#contact" onClick={(e) => handleNavClick(e, '#contact', false)} className="btn btn-sm">Contact Us</a></li>
            </ul>
          </nav>
          
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <ul>
          {navLinks.map((link) => (
            <li key={link.name}>
              {link.isPage ? (
                <Link to={link.path} onClick={() => setMobileMenuOpen(false)}>
                  {link.name}
                </Link>
              ) : (
                <a href={link.path} onClick={(e) => handleNavClick(e, link.path, false)}>
                  {link.name}
                </a>
              )}
            </li>
          ))}
          <li><a href="#contact" onClick={(e) => handleNavClick(e, '#contact', false)}>Contact Us</a></li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;

