import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    if (!isHome) { navigate('/'); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300); }
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
      <div className="nav-inner">
        <Link to="/" className="logo-link">
          <img src="/welogo.png" alt="WeIntern" className="nav-logo" />
        </Link>
        <ul className="nav-links">
          {[['story','Our Story'],['how','How It Works'],['services','Services'],['courses','Courses'],['testimonials','Stories'],['contact','Contact']].map(([id, label]) => (
            <li key={id}><button className="nav-link" onClick={() => scrollTo(id)}>{label}</button></li>
          ))}
        </ul>
        <div className="nav-ctas">
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn btn-outline">
                {user.role === 'admin' ? '⚙️ Admin' : '👤 Dashboard'}
              </Link>
              <button onClick={handleLogout} className="btn btn-primary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary btn-glow">Sign Up Free</Link>
            </>
          )}
        </div>
        <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
          <span /><span /><span />
        </button>
      </div>
      {menuOpen && (
        <div className="mobile-menu open">
          {[['story','Our Story'],['how','How It Works'],['services','Services'],['courses','Courses'],['testimonials','Stories']].map(([id, label]) => (
            <button key={id} className="mobile-nav-link" onClick={() => scrollTo(id)}>{label}</button>
          ))}
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMenuOpen(false)}>
                {user.role === 'admin' ? '⚙️ Admin Panel' : '👤 My Dashboard'}
              </Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="mobile-cta-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="mobile-cta-btn">Sign Up Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
