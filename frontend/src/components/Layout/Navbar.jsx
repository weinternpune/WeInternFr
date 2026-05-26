import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else navigate('/');
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const NAV_LINKS = [
    { label: 'Courses',         id: 'courses', scrollTo: true },
    { label: 'How It Works',    id: 'ecosystem', scrollTo: true },
    { label: 'For Colleges',    id: 'story', scrollTo: true },
    { label: 'Success Stories', id: 'testimonials', scrollTo: true },
    { label: 'About Us',        id: 'about', isRoute: true },
  ];

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
      <div className="nav-inner">
        <Link to="/" className="logo-link">
          <img src="/welogo.png" alt="WeIntern" className="nav-logo" />
        </Link>

        <ul className="nav-links">
          {NAV_LINKS.map(l => (
            <li key={l.id}>
              {l.isRoute ? (
                <Link to={`/${l.id}`} className="nav-link">
                  {l.label}
                </Link>
              ) : (
                <button className="nav-link" onClick={() => scrollTo(l.id)}>{l.label}</button>
              )}
            </li>
          ))}
        </ul>

        <div className="nav-ctas">
          {user ? (
            <>
              <div className="nav-user-info">
                <div className="nav-avatar">{user.name?.[0]?.toUpperCase()}</div>
                <span className="nav-user-type">
                  {user.role === 'admin' ? 'Admin' : 'Student'}
                </span>
              </div>
              {user.role === 'admin'
                ? <Link to="/admin" className="btn btn-outline" style={{fontSize:'.82rem',padding:'.5rem 1rem'}}>⚙️ Admin</Link>
                : <Link to="/dashboard" className="btn btn-outline" style={{fontSize:'.82rem',padding:'.5rem 1rem'}}>Dashboard</Link>
              }
              <button onClick={handleLogout} className="btn btn-outline" style={{fontSize:'.82rem',padding:'.5rem 1rem'}}>Logout</button>
            </>
          ) : (
            <>
              <div className="nav-students-count">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>4k+ Students</span>
              </div>
              <div className="nav-for-biz">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                <span>For Businesses</span>
              </div>
              <Link to="/login" className="btn-nav-login">Login / Sign Up</Link>
            </>
          )}
        </div>

        <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {NAV_LINKS.map(l => (
            l.isRoute ? (
              <Link key={l.id} to={`/${l.id}`} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                {l.label}
              </Link>
            ) : (
              <button key={l.id} className="mobile-nav-link" onClick={() => scrollTo(l.id)}>{l.label}</button>
            )
          ))}
          {user ? (
            <>
              {user.role === 'admin'
                ? <Link to="/admin" onClick={() => setMenuOpen(false)} className="mobile-nav-link">Admin Panel</Link>
                : <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="mobile-nav-link">Dashboard</Link>
              }
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="mobile-cta-btn">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="mobile-cta-btn">Login / Sign Up</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
