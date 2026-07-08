import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

/* ── Team photos – place these files in /public/team/ ── */
const SLIDES = [
  {
    src: '/team/team_desk_writing.jpg',
    caption: 'Building dreams from the ground up 💻',
  },
  {
    src: '/team/team_standing_floral.jpg',
    caption: 'Our family — growing together, one step at a time 🌱',
  },
  {
    src: '/team/team_standing_green.jpg',
    caption: 'Collaborating on the future of learning and technology 💡',
  },
  {
    src: '/team/team_group_standing.jpg',
    caption: 'The passionate minds driving the WeIntern mission forward 🚀',
  },
  {
    src: '/team/team_pointing_sign_1.jpg',
    caption: 'Proudly launching WeIntern Private Limited 🌟',
  },
  {
    src: '/team/team_pointing_sign_2.jpg',
    caption: 'Empowering every student with opportunities and training 🎯',
  },
  {
    src: '/team/team_pointing_sign_3.jpg',
    caption: 'Together we stand, together we build 🤝',
  },
];

/* ── Developer photos ── */
const DEVELOPER_SLIDES = [
  {
    src: '/team/developer1.jpg',
    name: 'Lead Developer',
    role: 'Senior Full-Stack Engineer',
    caption: 'Building scalable solutions with modern tech stack 💻',
  },
  {
    src: '/team/developer2.jpg',
    name: 'Core Developer',
    role: 'Full-Stack Engineer',
    caption: 'Crafting seamless user experiences 🚀',
  },
  {
    src: '/team/developer3.jpg',
    name: 'Backend Specialist',
    role: 'Full-Stack Engineer',
    caption: 'Architecting robust backend systems ⚡',
  },
];

/* ── Leadership photos ── */
const LEADERSHIP_SLIDES = [
  {
    src: '/team/founder1.jpg',
    name: 'Founder & CEO',
    role: 'Visionary Leader',
    caption: 'Driving innovation and empowering students 🚀',
  },
  {
    src: '/team/hr_manager.jpg',
    name: 'HR Manager',
    role: 'People & Culture',
    caption: 'Nurturing talent and building teams 🤝',
  },
];

const AboutUs = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('next');
  
  // Developer slideshow state
  const [devCurrent, setDevCurrent] = useState(0);
  const [devIsAnimating, setDevIsAnimating] = useState(false);
  const [devDirection, setDevDirection] = useState('next');
  
  // Leadership slideshow state
  const [leaderCurrent, setLeaderCurrent] = useState(0);
  const [leaderIsAnimating, setLeaderIsAnimating] = useState(false);
  const [leaderDirection, setLeaderDirection] = useState('next');

  const goTo = useCallback(
    (index, dir = 'next') => {
      if (isAnimating) return;
      setDirection(dir);
      setIsAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setIsAnimating(false);
      }, 500);
    },
    [isAnimating]
  );

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length, 'next');
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length, 'prev');
  }, [current, goTo]);
  
  // Developer slideshow functions
  const devGoTo = useCallback(
    (index, dir = 'next') => {
      if (devIsAnimating) return;
      setDevDirection(dir);
      setDevIsAnimating(true);
      setTimeout(() => {
        setDevCurrent(index);
        setDevIsAnimating(false);
      }, 500);
    },
    [devIsAnimating]
  );

  const devNext = useCallback(() => {
    devGoTo((devCurrent + 1) % DEVELOPER_SLIDES.length, 'next');
  }, [devCurrent, devGoTo]);

  const devPrev = useCallback(() => {
    devGoTo((devCurrent - 1 + DEVELOPER_SLIDES.length) % DEVELOPER_SLIDES.length, 'prev');
  }, [devCurrent, devGoTo]);
  
  // Leadership slideshow functions
  const leaderGoTo = useCallback(
    (index, dir = 'next') => {
      if (leaderIsAnimating) return;
      setLeaderDirection(dir);
      setLeaderIsAnimating(true);
      setTimeout(() => {
        setLeaderCurrent(index);
        setLeaderIsAnimating(false);
      }, 500);
    },
    [leaderIsAnimating]
  );

  const leaderNext = useCallback(() => {
    leaderGoTo((leaderCurrent + 1) % LEADERSHIP_SLIDES.length, 'next');
  }, [leaderCurrent, leaderGoTo]);

  const leaderPrev = useCallback(() => {
    leaderGoTo((leaderCurrent - 1 + LEADERSHIP_SLIDES.length) % LEADERSHIP_SLIDES.length, 'prev');
  }, [leaderCurrent, leaderGoTo]);

  /* auto-play for all three slideshows */
  useEffect(() => {
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [next]);
  
  useEffect(() => {
    const id = setInterval(devNext, 5000);
    return () => clearInterval(id);
  }, [devNext]);
  
  useEffect(() => {
    const id = setInterval(leaderNext, 5500); // Slightly different timing
    return () => clearInterval(id);
  }, [leaderNext]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      {/* ── Header ── */}
      <div className="about-header">
        <div className="about-header-inner">
          <Link to="/" className="about-back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </Link>
          <Link to="/" className="about-logo">
            <img src="/welogo.png" alt="WeIntern" />
          </Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="about-particles" id="aboutParticles" />
        <div className="about-content-wrapper">
          <div className="about-left">
            <div className="about-label">OUR VISION</div>
            <h1 className="about-title">
              Building a Generation<br />That's Ready.
            </h1>
            <p className="about-description">
              To create a generation of professionals who are not afraid of interviews,
              not confused about skills, and not dependent only on degrees.
            </p>
            <div className="about-flow">
              {[
                { icon: '📚', label: 'Learning' },
                { icon: '💼', label: 'Experience' },
                { icon: '💰', label: 'Income' },
                { icon: '🚀', label: 'Future' },
              ].map((item, i, arr) => (
                <React.Fragment key={item.label}>
                  <div className="flow-item">
                    <span className="flow-icon">{item.icon}</span>
                    <span className="flow-label">{item.label}</span>
                  </div>
                  {i < arr.length - 1 && <div className="flow-arrow">→</div>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Founder card */}
          <div className="about-right">
            <div className="founder-card">
              <div className="founder-glow" />
              <div className="founder-header">
                <div className="founder-avatar">WI</div>
                <div className="founder-info">
                  <h3>WeIntern Team</h3>
                  <p>Founders &amp; Co-founders</p>
                </div>
              </div>
              <blockquote className="founder-quote">
                "We started WeIntern because we saw talented students being rejected —
                not for lack of skill, but lack of opportunity. We're changing that,
                one intern at a time. This isn't just a company — it's our family."
              </blockquote>
              <div className="founder-social">
                <a href="https://www.linkedin.com/company/weintern" target="_blank" rel="noopener noreferrer" className="social-link">
                  LinkedIn
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/weintern.in" target="_blank" rel="noopener noreferrer" className="social-link">
                  Instagram
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Family Slideshow ── */}
      <section className="family-section">
        <div className="family-section-inner">
          {/* HEADER TEXT - In the center */}
          <div className="family-header-text">
            <span className="about-label" style={{ display: 'block', textAlign: 'center' }}>THE PEOPLE BEHIND THE MISSION</span>
            <h2 className="family-title">Our Family</h2>
            <p className="family-subtitle">
              WeIntern isn't just a startup — it's a family of passionate builders, dreamers, and doers.
              Every face you see here believes in one thing: <em>students deserve better.</em>
            </p>
          </div>

          {/* TOP ROW: Leadership (Left) and Developers (Right) */}
          <div className="family-top-row">
            {/* LEFT: Leadership */}
            <div className="family-top-box">
              <div className="top-box-header">
                <h3>Our Leadership</h3>
                <p>Founders & HR</p>
              </div>
              
              <div className="top-box-stage">
                <div className={`top-box-img-wrap ${leaderIsAnimating ? `top-box-exit-${leaderDirection}` : 'top-box-enter'}`}>
                  <img
                    src={LEADERSHIP_SLIDES[leaderCurrent].src}
                    alt={LEADERSHIP_SLIDES[leaderCurrent].name}
                    className="top-box-img"
                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                  <div className="top-box-placeholder" style={{ display: 'none' }}>
                    <span>👔</span>
                  </div>
                </div>
                
                <div className="top-box-overlay">
                  <h4>{LEADERSHIP_SLIDES[leaderCurrent].name}</h4>
                  <p className="top-box-role">{LEADERSHIP_SLIDES[leaderCurrent].role}</p>
                </div>

                <button className="top-box-arrow top-box-arrow-left" onClick={leaderPrev}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button className="top-box-arrow top-box-arrow-right" onClick={leaderNext}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              <div className="top-box-dots">
                {LEADERSHIP_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    className={`top-box-dot ${i === leaderCurrent ? 'active' : ''}`}
                    onClick={() => leaderGoTo(i, i > leaderCurrent ? 'next' : 'prev')}
                  />
                ))}
              </div>
            </div>

            {/* MIDDLE: Spacer (empty grid column) */}
            <div></div>

            {/* RIGHT: Developers */}
            <div className="family-top-box">
              <div className="top-box-header">
                <h3>Our Developers</h3>
                <p>Tech Team</p>
              </div>
              
              <div className="top-box-stage">
                <div className={`top-box-img-wrap ${devIsAnimating ? `top-box-exit-${devDirection}` : 'top-box-enter'}`}>
                  <img
                    src={DEVELOPER_SLIDES[devCurrent].src}
                    alt={DEVELOPER_SLIDES[devCurrent].name}
                    className="top-box-img"
                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                  <div className="top-box-placeholder" style={{ display: 'none' }}>
                    <span>👨‍💻</span>
                  </div>
                </div>
                
                <div className="top-box-overlay">
                  <h4>{DEVELOPER_SLIDES[devCurrent].name}</h4>
                  <p className="top-box-role">{DEVELOPER_SLIDES[devCurrent].role}</p>
                </div>

                <button className="top-box-arrow top-box-arrow-left" onClick={devPrev}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button className="top-box-arrow top-box-arrow-right" onClick={devNext}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              <div className="top-box-dots">
                {DEVELOPER_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    className={`top-box-dot ${i === devCurrent ? 'active' : ''}`}
                    onClick={() => devGoTo(i, i > devCurrent ? 'next' : 'prev')}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM: Main Team Slideshow */}
          <div className="family-main-slideshow">
            <div className="slideshow-wrapper">
              <div className="slideshow-stage">
                <div className={`slide-img-wrap ${isAnimating ? `slide-exit-${direction}` : 'slide-enter'}`}>
                  <img
                    src={SLIDES[current].src}
                    alt={`WeIntern team — slide ${current + 1}`}
                    className="slide-img"
                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                  <div className="slide-placeholder" style={{ display: 'none' }}>
                    <span>📷</span>
                    <p>Team photo coming soon</p>
                  </div>
                </div>

                {/* Gradient overlay + caption */}
                <div className="slide-overlay">
                  <p className="slide-caption">{SLIDES[current].caption}</p>
                </div>

                {/* Nav arrows */}
                <button className="slide-arrow slide-arrow-left" onClick={prev} aria-label="Previous">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button className="slide-arrow slide-arrow-right" onClick={next} aria-label="Next">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              {/* Dots */}
              <div className="slide-dots">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    className={`slide-dot ${i === current ? 'active' : ''}`}
                    onClick={() => goTo(i, i > current ? 'next' : 'prev')}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Thumbnail strip */}
              <div className="slide-thumbs">
                {SLIDES.map((slide, i) => (
                  <button
                    key={i}
                    className={`slide-thumb ${i === current ? 'active' : ''}`}
                    onClick={() => goTo(i, i > current ? 'next' : 'prev')}
                    aria-label={`Slide ${i + 1}`}
                  >
                    <img
                      src={slide.src}
                      alt={`Thumb ${i + 1}`}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <div className="thumb-fallback">{i + 1}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Family values row */}
          <div className="family-values-row">
            {[
              { icon: '❤️', title: 'Family First', text: 'We treat every team member and intern as family. Your growth is our growth.' },
              { icon: '🌟', title: 'Celebrate Together', text: 'Every milestone, big or small, is worth celebrating — together as one unit.' },
              { icon: '💪', title: 'Grow Together', text: 'We challenge each other, support each other, and rise together every single day.' },
              { icon: '🎯', title: 'One Mission', text: 'Empowering learning, enabling technology, elevating tomorrow — for all of us.' },
            ].map(v => (
              <div className="family-value-card" key={v.title}>
                <span className="fv-icon">{v.icon}</span>
                <h4>{v.title}</h4>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission Section ── */}
      <section className="about-mission">
        <div className="about-mission-inner">
          <h2 className="mission-title">Our Mission</h2>
          <p className="mission-text">
            To empower every student with practical skills, real experience, and financial
            independence through meaningful work. We bridge the gap between education and
            employment by providing hands-on training and real project opportunities.
          </p>
          <div className="mission-stats">
            {[
              { value: '12,500+', label: 'Students Trained' },
              { value: '920+', label: 'Projects Delivered' },
              { value: '₹4.5 Cr+', label: 'Paid in Stipends' },
              { value: '200+', label: 'College Partners' },
            ].map(s => (
              <div className="mission-stat" key={s.label}>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values Section ── */}
      <section className="about-values">
        <div className="about-values-inner">
          <h2 className="values-title">Our Core Values</h2>
          <div className="values-grid">
            {[
              { icon: '🎯', title: 'Student-First Approach', text: 'Every decision we make prioritizes student growth, learning, and success.' },
              { icon: '💡', title: 'Real-World Learning', text: 'We believe in learning by doing, not just theory and certifications.' },
              { icon: '🤝', title: 'Fair Compensation', text: 'Students deserve to earn for the value they create through their work.' },
              { icon: '🌱', title: 'Continuous Growth', text: 'We foster an environment of constant learning and skill development.' },
            ].map(v => (
              <div className="value-card" key={v.title}>
                <div className="value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="about-cta">
        <div className="about-cta-inner">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of students who are learning, earning, and building their future with WeIntern.</p>
          <div className="about-cta-buttons">
            <Link to="/#courses" className="btn-about-primary">Explore Courses</Link>
            <Link to="/#contact" className="btn-about-outline">Get in Touch</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="about-footer">
        <div className="about-footer-inner">
          <div className="footer-section footer-company">
            <div className="footer-logo-section">
              <Link to="/" className="footer-logo-link">
                <img src="/welogo.png" alt="WeIntern" className="footer-logo" />
              </Link>
              <p className="footer-tagline">Empowering students with practical skills, real experience, and financial independence.</p>
            </div>
            <div className="footer-social-links">
              <a href="https://www.linkedin.com/company/weintern" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
              <a href="https://www.instagram.com/weintern.in" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
              <a href="https://twitter.com/weintern" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>
              </a>
            </div>
          </div>

          <div className="footer-section footer-contact">
            <h4>Contact Us</h4>
            <div className="footer-contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              <a href="tel:+917414974582">+91 7414974582</a>
            </div>
            <div className="footer-contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              <a href="mailto:contact@weintern.in">contact@weintern.in</a>
            </div>
            <div className="footer-contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <span>Office No. 305, 3rd Floor, Tower B, City Vista, Kharadi, Pune - 411014</span>
            </div>
          </div>

          <div className="footer-section footer-details">
            <h4>Company Details</h4>
            <div className="footer-detail-item"><strong>CIN:</strong><span>U85500MH2026PTC467896</span></div>
            <div className="footer-detail-item"><strong>Industry:</strong><span>IT Services &amp; Ed-Tech Solutions</span></div>
            <div className="footer-detail-item"><strong>Company Size:</strong><span>11–50 employees</span></div>
            <div className="footer-detail-item"><strong>Founded:</strong><span>2026</span></div>
            <div className="footer-detail-item"><strong>Headquarters:</strong><span>Pune, Maharashtra</span></div>
          </div>

          <div className="footer-section footer-specialties">
            <h4>Our Specialties</h4>
            <div className="footer-tags">
              {['IT Services', 'Web Development', 'App Development', 'AI Automation', 'UI/UX Design', 'API Integration', 'Ed-Tech Solutions', 'Cloud & DevOps', 'Cyber Security', 'IT Consulting'].map(t => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <p>© 2026 WeIntern Private Limited. All rights reserved.</p>
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
